import { readFileSync } from 'node:fs';

const PLATFORM = 'xbl';
const USERNAME = 'eartharoid';
const DAYS = 30;

// const player = JSON.parse(readFileSync(`data/${PLATFORM}-${USERNAME}.json`));
const games = JSON.parse(readFileSync(`data/${PLATFORM}-${USERNAME}-games.json`));
const recent = games.reports.filter(game => (Date.now() - (game.timestamp * 1000)) / (1000 * 60 * 60 * 24) < DAYS);



console.log('Calculating Score/min for %d games', recent.length);
const PPM = recent
	.reduce(($, game) => {
		const data = JSON.parse(readFileSync(`data/games/${PLATFORM}-${game.gameReportId}.json`));
		const players = data.children.reduce(($, children) => [...$, ...children.children], []);
		const player = players.find(p => p.metadata.platformSlug === PLATFORM && p.metadata.name === USERNAME);
		$ = [...$, player.stats.find(s => s.metadata.key === 'scorePerMinute').value];
		return $;
	}, [])
	.reduce(($, PPM) => $ + PPM, 0) / recent.length;



console.log('Calculating K/D for %d games', recent.length);
const KD = recent
	.reduce(($, game) => {
		const data = JSON.parse(readFileSync(`data/games/${PLATFORM}-${game.gameReportId}.json`));
		const players = data.children.reduce(($, children) => [...$, ...children.children], []);
		const player = players.find(p => p.metadata.platformSlug === PLATFORM && p.metadata.name === USERNAME);
		$ = [...$, player.stats.find(s => s.metadata.key === 'kdRatio').value];
		return $;
	}, [])
	.reduce(($, KD) => $ + KD, 0) / recent.length;



console.log('Calculating KPM for %d games', recent.length);
const KPM = recent
	.reduce(($, game) => {
		const data = JSON.parse(readFileSync(`data/games/${PLATFORM}-${game.gameReportId}.json`));
		const players = data.children.reduce(($, children) => [...$, ...children.children], []);
		const player = players.find(p => p.metadata.platformSlug === PLATFORM && p.metadata.name === USERNAME);
		$ = [...$, player.stats.find(s => s.metadata.key === 'killsPerMinute').value];
		return $;
	}, [])
	.reduce(($, KPM) => $ + KPM, 0) / recent.length;



console.log('Calculating highest kills for %d games', recent.length);
const highestKills = Math.max(
	...recent
		.reduce(($, game) => {
			const data = JSON.parse(readFileSync(`data/games/${PLATFORM}-${game.gameReportId}.json`));
			const players = data.children.reduce(($, children) => [...$, ...children.children], []);
			const player = players.find(p => p.metadata.platformSlug === PLATFORM && p.metadata.name === USERNAME);
			$ = [...$, player.stats.find(s => s.metadata.key === 'kills').value];
			return $;
		}, [])
);



const stats = {
	PPM,
	KD,
	KPM,
	highestKills,
};

console.log(stats);
