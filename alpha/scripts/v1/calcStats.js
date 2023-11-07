import { readFileSync } from 'node:fs';

const PLATFORM = 'xbl';
const USERNAME = 'eartharoid';
const DAYS = 14;

// const player = JSON.parse(readFileSync(`data/${PLATFORM}-${USERNAME}.json`));
const games = JSON.parse(readFileSync(`data/${PLATFORM}-${USERNAME}-games.json`));
const recent = games.reports.filter(game => (Date.now() - (game.timestamp * 1000)) / (1000 * 60 * 60 * 24) < DAYS);

const avg = arr => Number((arr.reduce((t, n) => t + n, 0) / arr.length).toFixed(2));

console.log('Calculating Score/min for %d games', recent.length);
const PPM = avg(
	recent
		.reduce(($, game) => {
			const data = JSON.parse(readFileSync(`data/games/${PLATFORM}-${game.gameReportId}.json`));
			const players = data.children.reduce(($, children) => [...$, ...children.children], []);
			const player = players.find(p => p.metadata.platformSlug === PLATFORM && p.metadata.name === USERNAME);
			$ = [...$, player.stats.find(s => s.metadata.key === 'scorePerMinute').value];
			return $;
		}, [])
)



console.log('Calculating K/D for %d games', recent.length);
const KD_array = recent
	.reduce(($, game) => {
		const data = JSON.parse(readFileSync(`data/games/${PLATFORM}-${game.gameReportId}.json`));
		const players = data.children.reduce(($, children) => [...$, ...children.children], []);
		const player = players.find(p => p.metadata.platformSlug === PLATFORM && p.metadata.name === USERNAME);
		$ = [...$, player.stats.find(s => s.metadata.key === 'kdRatio').value];
		return $;
	}, []);
const KD = avg(KD_array)



console.log('Calculating Corrected K/D for %d games', recent.length);
const CKD = avg(KD_array.filter(KD => KD >= 1));



console.log('Calculating KPM for %d games', recent.length);
const KPM = avg(
	recent
		.reduce(($, game) => {
			const data = JSON.parse(readFileSync(`data/games/${PLATFORM}-${game.gameReportId}.json`));
			const players = data.children.reduce(($, children) => [...$, ...children.children], []);
			const player = players.find(p => p.metadata.platformSlug === PLATFORM && p.metadata.name === USERNAME);
			$ = [...$, player.stats.find(s => s.metadata.key === 'killsPerMinute').value];
			return $;
		}, [])
)



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

console.log('Calculating highest K/D for %d games', recent.length);
const highestKD = Math.max(
	...recent
		.reduce(($, game) => {
			const data = JSON.parse(readFileSync(`data/games/${PLATFORM}-${game.gameReportId}.json`));
			const players = data.children.reduce(($, children) => [...$, ...children.children], []);
			const player = players.find(p => p.metadata.platformSlug === PLATFORM && p.metadata.name === USERNAME);
			$ = [...$, player.stats.find(s => s.metadata.key === 'kdRatio').value];
			return $;
		}, [])
);



const stats = {
	PPM,
	KD,
	CKD,
	KPM,
	highestKills,
	highestKD,
};

console.log(stats);
