import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { createWriteStream, existsSync, readFileSync, writeFileSync } from 'node:fs';

puppeteer.use(StealthPlugin());

const API = 'https://api.tracker.gg/api/v1/bfv/gamereports';
const PLATFORM = 'xbl';
const USERNAME = 'StrykoMiko';
const DAYS = 12;
const FILE = `data/${PLATFORM}-${USERNAME}-games.json`;
// const TIMEOUT1 = 2500; // TODO:
// const TIMEOUT2 = 5000; // TODO:
const TIMEOUT1 = 1000; // TODO:
const TIMEOUT2 = 2000; // TODO:

const getJSON = () => JSON.parse(document.querySelector('body').innerText);
const isLessThanDays = (timestamp) => (Date.now() - timestamp) / (1000 * 60 * 60 * 24) < DAYS;

const meta = {
	maps: JSON.parse(readFileSync('data/__meta_maps.json')),
	modes: JSON.parse(readFileSync('data/__meta_modes.json')),
}

const browser = await puppeteer.launch();
const page = await browser.newPage();

console.log('Getting first page of games...');
await page.goto(`${API}/${PLATFORM}/latest/${USERNAME}`);
const { data: games } = await page.evaluate(getJSON);

let { paginationToken } = games;
delete games.paginationToken;

while (isLessThanDays(games.reports[games.reports.length - 1].timestamp * 1000) && paginationToken) {
	console.log('Pausing...');
	await new Promise(r => setTimeout(r, TIMEOUT1));
	console.log('Getting next page of games...');
	await page.goto(`${API}/${PLATFORM}/latest/${USERNAME}?paginationToken=${paginationToken}`);
	const { data: nextGames } = await page.evaluate(getJSON);
	games.reports.push(...nextGames.reports);
	paginationToken = nextGames.paginationToken;
}

console.log('Got %d games', games.reports.length)

games.reports = games.reports.map(game => {
	if (!meta.maps[game.mapKey]) {
		meta.maps[game.mapKey] = game.map;
		writeFileSync('data/__meta_maps.json', JSON.stringify(meta.maps, null, 2));
	}
	delete game.map;
	if (!meta.modes[game.modeKey]) {
		meta.modes[game.modeKey] = game.mode;
		writeFileSync('data/__meta_modes.json', JSON.stringify(meta.modes, null, 2));
	}
	delete game.mode;
	return game;
});

writeFileSync(FILE, JSON.stringify(games, null, 2));

console.log('This could take over %d seconds', Math.ceil(games.reports.length * TIMEOUT2 / 1000));

for (const game of games.reports) {
	const GAME_FILE = `data/games/${PLATFORM}-${game.gameReportId}.json`;
	if (existsSync(GAME_FILE)) {
		console.log('%s already has data, skipping', game.gameReportId);
		continue;
	}
	console.log('Pausing...');
	await new Promise(r => setTimeout(r, TIMEOUT2));
	console.log('Getting %s game data...', game.gameReportId);
	await page.goto(`${API}/${PLATFORM}/direct/${game.gameReportId}`);
	const { data } = await page.evaluate(getJSON);
	createWriteStream(GAME_FILE).write(JSON.stringify(data, null, 2));
}

await browser.close();