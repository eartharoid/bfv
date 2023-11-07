import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { writeFileSync } from 'node:fs';

puppeteer.use(StealthPlugin());

const API = 'https://api.tracker.gg/api/v2/bfv/standard/profile';
const PLATFORM = 'xbl';
const USERNAME = 'eartharoid';
const FILE = `data/${PLATFORM}-${USERNAME}.json`;
const TIMEOUT = 2500;

const getJSON = () => JSON.parse(document.querySelector('body').innerText);

const browser = await puppeteer.launch();
const page = await browser.newPage();

console.log('Getting core data...');
await page.goto(`${API}/${PLATFORM}/${USERNAME}`);
const { data: player } = await page.evaluate(getJSON);

for (const segment of player.availableSegments) {
	console.log('Pausing...');
	await new Promise(r => setTimeout(r, TIMEOUT));
	console.log('Getting %s data...', segment.type);
	await page.goto(`${API}/${PLATFORM}/${USERNAME}/segments/${segment.type}`);
	player.segments.push(...(await page.evaluate(getJSON)).data);
}

delete player.availableSegments;

writeFileSync(FILE, JSON.stringify(player, null, 2));

await browser.close();