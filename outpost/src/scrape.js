import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import got from 'got';
import log from './logger.js';
import config from './config.js';
import HQ from './hq.js';

puppeteer.use(StealthPlugin());

const platforms = new Map([
  ['xbl', 'xboxone'],
  ['psn', 'ps4'],
  ['origin', 'pc'],
]);

export default async function scrape(job) {
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
        for (const [find, replace] of rename) if (_.name === find) _.name = replace; // could use regex
        return _;
      });
      platoon.members = platoon.members.sort((a, b) => {
        if (a.role === b.role) return a.name.localeCompare(b.name);
        const roles = ['General', 'Colonel', 'Lieutenant', 'Private', 'Unknown'];
        return roles.indexOf(a.role) - roles.indexOf(b.role);
      });
      if (platoon.members.length !== platoon.currentSize) {
        log.warn('%s platoon %s has %d members but should have %d', gtn, platoonId, platoon.members.length, platoon.currentSize);
      }
      if (config.use_platoons) for (const member of platoon.members) players.add({ name: member.name, platform: trn });
      try {
        log.info('Updating %s platoon', gtn, platoonId);
        await HQ.put(`${trn}/platoons/${platoonId}`, { json: platoon });
        log.success('Sent %s %s platoon information to HQ', platoon.name, gtn);
      } catch (e) {
        log.error(e);
      }
    }
  }

  // const browser = await puppeteer.launch();
  // const page = await browser.newPage();
}
