import { readFileSync, writeFileSync } from 'node:fs';
import { stringify } from 'csv-stringify/sync';

const PLATFORM = 'xbl';
const USERNAME = 'eartharoid';
const DAYS = 30;

// const player = JSON.parse(readFileSync(`data/${PLATFORM}-${USERNAME}.json`));
const games = JSON.parse(readFileSync(`data/${PLATFORM}-${USERNAME}-games.json`));
const recent = games.reports.filter(game => (Date.now() - (game.timestamp * 1000)) / (1000 * 60 * 60 * 24) < DAYS);
const round = (n, d = 2) => Number(n.toFixed(d));

console.log('Calculating Kills for %d games', recent.length);

writeFileSync(
	`generated/${PLATFORM}-${USERNAME}-kills.csv`,
	stringify([
		['Timestamp', 'Kills'],
		...recent
			.map(game => {
				const data = JSON.parse(readFileSync(`data/games/${PLATFORM}-${game.gameReportId}.json`));
				const players = data.children.reduce(($, children) => [...$, ...children.children], []);
				const player = players.find(p => p.metadata.platformSlug === PLATFORM && p.metadata.name === USERNAME);
				// const timestamp = new Date(data.metadata.timestamp * 1000).toISOString();
				// const timestamp = new Date(data.metadata.timestamp * 1000).toISOString().slice(0, 10);
				const timestamp = new Date(data.metadata.timestamp * 1000).toISOString().split('.')[0].replace('T', ' ');
				const stat = player.stats.find(s => s.metadata.key === 'kills').value;
				return [timestamp, round(stat)];
			}, [])
	])
);