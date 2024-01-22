import { inspect } from 'node:util';
import ms from 'ms';
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import got from 'got';
import config from './config.js';
import log from './logger.js';
import HQ from './hq.js';
import TRNScraper from './trn.js';

puppeteer.use(StealthPlugin());

function handleError(e) {
  if (e.response?.body) {
    try {
      log.error(e.response.statusCode, inspect(JSON.parse(e.response.body), { depth: Infinity }));
    } catch (_) {
      log.error(e.response.body);
    }
  } else {
    log.error(e);
  }
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

async function deviate() {
  const time = Math.random() * ms(config.deviate);
  log.info('Delaying for %s', ms(time, { long: true }));
  await new Promise((r) => {
    setTimeout(r, time);
  });
}

async function pause() {
  const time = random(config.pause.min, config.pause.max);
  log.info('Pausing for %d seconds', (time / 1e+3).toFixed(2));
  await new Promise((r) => {
    setTimeout(r, time);
  });
}

const platforms = new Map([
  ['xbl', 'xboxone'],
  ['psn', 'ps4'],
  ['origin', 'pc'],
]);

export default async function scrape(job) {
  if (job) await deviate();
  const gamemodes = await HQ.get('gamemodes').json();
  const maps = await HQ.get('maps').json();
  const players = new Set();
  for await (const [trn, gtn] of platforms) {
    const platoons = new Map();
    for (const name of config.monitor[trn].players) players.add({ name, platform: trn });
    for await (const platoonId of config.monitor[trn].platoons) {
      log.info('Fetching %s platoon %s from Game Tools', gtn, platoonId);
      const url = `https://api.gametools.network/bfglobal/detailedplatoon/?id=${platoonId}&platform=${gtn}`;
      try {
        const platoon = await got(url).json();
        platoons.set(platoonId, platoon);
      } catch (e) {
        log.error(e);
      }
    }
    for await (const playerName of config.monitor[trn].players) {
      log.info('Fetching platoons of %s player %s from Game Tools', gtn, playerName);
      const url = `https://api.gametools.network/bfv/all/?name=${playerName}&platform=${gtn}`;
      try {
        const player = await got(url).json();
        for (const { id: platoonId } of player.platoons) {
          if (platoons.has(platoonId)) {
            const platoon = platoons.get(platoonId);
            const isDuplicate = !!platoon.members.find((member) => member.id === player.id.toString());
            if (platoons.has(platoonId) && !isDuplicate) {
              platoon.members.push({
                id: player.id.toString(),
                name: player.userName,
                avatar: player.avatar,
                role: 'Unknown',
              });
              platoons.set(platoonId, platoon);
            }
          }
        }
      } catch (e) {
        log.error(e);
      }
    }
    for await (const [platoonId, platoon] of platoons) {
      const rename = Object.entries(config.monitor[trn].rename);
      platoon.members = platoon.members.map((member) => {
        const _ = member;
        for (const [find, replace] of rename) if (_.name === find) _.name = replace; // more efficient than regex
        return _;
      });
      // sort by role then name
      const roles = ['General', 'Colonel', 'Lieutenant', 'Private', 'Unknown'];
      platoon.members = platoon.members.sort((a, b) => {
        if (a.role === b.role) return a.name.localeCompare(b.name);
        return roles.indexOf(a.role) - roles.indexOf(b.role);
      });
      if (platoon.members.length !== platoon.currentSize) {
        log.warn('%s platoon %s has %d members but should have %d', gtn, platoonId, platoon.members.length, platoon.currentSize);
      }
      if (config.use_platoons) for (const member of platoon.members) players.add({ name: member.name, platform: trn });
      platoons.set(platoonId, platoon);
      try {
        log.info('Updating %s platoon', gtn, platoonId);
        await HQ.put(`${trn}/platoons/${platoonId}`, { json: platoon });
        log.success('Sent %s %s platoon information to HQ', platoon.name, gtn);
      } catch (e) {
        log.error(e);
      }
    }
  }
  log.info('Opening browser');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  const TRN = new TRNScraper(page);
  const missingGames = new Set();
  for await (const { name, platform } of players) {
    log.info('Fetching %s player %s overview from TRN', platform, name);
    await TRN.get(`/standard/profile/${platform}/${name}`); // this is just to populate TRN's graphs
    log.info('Fetching existing games for %s player %s from HQ', platform, name);
    let existingReports = [];
    const newReports = [];
    try {
      const data = await HQ.get(`${platform}/players/${name}/games`).json();
      existingReports = data.reports;
    } catch (e) {
      // 404 is expected and is a valid state, not an error
      if (e.response?.statusCode === 404) {
        log.info('%s player %s has no existing games', platform, name);
      } else {
        log.error(e);
        continue;
      }
    }
    log.info('Finding new games for %s player %s from TRN', platform, name);
    if (config.backfill) {
      if (existingReports.length > 0) {
        // TODO: from backfill up to first
      } else {
        // TODO: all from backfill
      }
    }
    if (existingReports.length > 0) {
      // all after last
      try {
        log.info('Getting first page of games...');
        const { data } = await TRN.get(`/gamereports/${platform}/latest/${name}`);
        let { paginationToken } = data;
        newReports.push(...data.reports);
        // until oldest (last) newReports is older than newest (first) existingReports (while the opposite)
        /* eslint-disable no-await-in-loop -- limit parallel requests */
        while (data.reports.at(-1)?.timestamp > existingReports.at(0)?.timestamp && paginationToken) {
          await pause();
          log.info('Getting next page of games...');
          const { data: data2 } = await TRN.get(`/gamereports/${platform}/latest/${name}?paginationToken=${paginationToken}`);
          newReports.push(...data2.reports);
          paginationToken = data2.paginationToken;
        }
        /* eslint-enable no-await-in-loop */
      } catch (e) {
        log.error(e);
      }
    } else {
      // one page
      try {
        log.info('Getting one page of games...');
        const { data } = await TRN.get(`/gamereports/${platform}/latest/${name}`);
        newReports.push(...data.reports);
      } catch (e) {
        log.error(e);
      }
    }

    for await (const report of newReports) {
      try {
        if (report.mode && !gamemodes.hasOwnProperty(report.modeKey)) {
          gamemodes[report.modeKey] = report.mode;
          log.info('Uploading %s gamemode to HQ', report.modeKey);
          await HQ.post('gamemodes', {
            json: report.mode,
          }).json();
          delete report.mode;
        }
        if (report.map && !maps.hasOwnProperty(report.mapKey)) {
          maps[report.mapKey] = report.map;
          log.info('Uploading %s map to HQ', report.mapKey);
          await HQ.post('maps', {
            json: report.map,
          }).json();
          delete report.map;
        }
      } catch (e) {
        handleError(e);
      }
    }
    if (newReports.length === 0) {
      log.info('%s player %s has no new games', platform, name);
    } else {
      log.info('Packaging %d new games', newReports.length);
      // pack reports in shipments of max 5MB
      // await writeFile('reports.json', JSON.stringify(newReports, null, 2));
      const shipments = [[]];
      for (let i = 0; i < newReports.length; i += 1) {
        let current = shipments[shipments.length - 1];
        const string = JSON.stringify(current);
        const size = (new TextEncoder().encode(string)).length; // in Bytes
        if (size > 5e+6) { // if **already** larger than 5MB (actual Lambda limit is 6MB)
          log.info('Filled %d packages', shipments.length);
          shipments.push([]);
          current = shipments[shipments.length - 1];
        }
        current.push(newReports[i]);
      }
      for (let i = 0; i < shipments.length; i += 1) {
        try {
          log.info('Uploading %s player %s games to HQ (%d/%d)', platform, name, i + 1, shipments.length);

          // eslint-disable-next-line no-await-in-loop
          const { missing } = await HQ.post(`${platform}/players/${name}/games`, {
            json: {
              reports: shipments[i],
            },
          }).json();
          for (const id of missing) missingGames.add(id);
        } catch (e) {
          log.error(e);
        }
      }
    }
    log.info('Fetching missing games from TRN');
    for await (const id of missingGames) {
      try {
        log.info('Downloading %s game %s from TRN', platform, id);
        const { data } = await TRN.get(`/gamereports/${platform}/direct/${id}`);
        log.info('Uploading %s game %s to HQ', platform, id);
        await HQ.post(`${platform}/games/${id}`, {
          json: data,
        }).json();
      } catch (e) {
        handleError(e);
      }
    }
  }
  log.info('Closing browser');
  await browser.close();
  log.success('Finished scrape task');
  if (job) log.info('Expect next run to be at', new Date(job.nextDate().ts));
}
