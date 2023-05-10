import { readFileSync } from 'node:fs';

const PLATFORM = 'xbl';
const USERNAME = 'eartharoid';
const DAYS = 30;

// const player = JSON.parse(readFileSync(`data/${PLATFORM}-${USERNAME}.json`));
const games = JSON.parse(readFileSync(`data/${PLATFORM}-${USERNAME}-games.json`));
const recent = games.reports.filter(game => (Date.now() - (game.timestamp * 1000)) / (1000 * 60 * 60 * 24) < DAYS);

console.log('Calculating Score/min for %d games', recent.length);
const PPM = recent
	.reduce(($PPM, game) => {
		const data = JSON.parse(readFileSync(`data/games/${PLATFORM}-${game.gameReportId}.json`));
		const players = data.children.reduce(($players, children) => [...$players, ...children.children], []);
		const player = players.find(p => p.metadata.platformSlug === PLATFORM && p.metadata.name === USERNAME);
		$PPM = [...$PPM, player.stats.find(s => s.metadata.key === 'scorePerMinute').value];
		return $PPM;
	}, [])
	.reduce(($PPM, PPM) => $PPM + PPM, 0) / recent.length;

console.log('Calculating K/D for %d games', recent.length);
const KD = recent
	.reduce(($KD, game) => {
		const data = JSON.parse(readFileSync(`data/games/${PLATFORM}-${game.gameReportId}.json`));
		const players = data.children.reduce(($players, children) => [...$players, ...children.children], []);
		const player = players.find(p => p.metadata.platformSlug === PLATFORM && p.metadata.name === USERNAME);
		$KD = [...$KD, player.stats.find(s => s.metadata.key === 'kdRatio').value];
		return $KD;
	}, [])
	.reduce(($KD, KD) => $KD + KD, 0) / recent.length;

const stats = {
	PPM,
	KD
};

console.log(stats);