import fs, { existsSync } from 'node:fs';

fs.readdirSync('data/xbl')
	.filter(file => file.endsWith('.json'))
	.forEach(file => {
		const segments = file.slice(0, -5).split('-');
		if (!existsSync('data/xbl/' + segments[1])) {
			fs.mkdirSync('data/xbl/' + segments[1]);
		}
		fs.renameSync(
			'data/xbl/' + file, 
			'data/xbl/players/' + segments[1] + '/' + (segments[2] === 'games' ? 'games.json' : 'overview.json' )
		)
	});