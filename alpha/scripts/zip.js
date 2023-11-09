import fs from 'node:fs';
import { gzipSync, strToU8 } from 'fflate';

// fs.readdirSync('../data/xbl/games')
// 	.filter(file => file.endsWith('.json'))
// 	.forEach(file => {
// 		// const buf = fs.readFileSync(`data/xbl/games/${file}`);
// 		console.log('Reading', file);
// 		const str = fs.readFileSync(`../data/xbl/games/${file}`, 'utf8');
// 		console.log('Minifying');
// 		const min = JSON.stringify(JSON.parse(str));
// 		console.log('Buffering');
// 		const buf = strToU8(min);
// 		console.log('Gzipping');
// 		const gz = gzipSync(buf, {
// 			filename: file,
// 		});
// 		console.log('Writing');
// 		fs.writeFileSync(`../data/2sync/xbl/games/${file}.gz`, gz);
// 	});

// fs.readdirSync('../data/xbl/players')
// 	.forEach(folder => {
// 		console.log('Reading', folder);
// 		const str = fs.readFileSync(`../data/xbl/players/${folder}/games.json`, 'utf8');
// 		console.log('Minifying');
// 		const min = JSON.stringify(JSON.parse(str));
// 		console.log('Buffering');
// 		const buf = strToU8(min);
// 		console.log('Gzipping');
// 		const gz = gzipSync(buf);
// 		console.log('Writing');
// 		fs.mkdirSync(`../data/2sync/xbl/players/${folder}`);
// 		fs.writeFileSync(`../data/2sync/xbl/players/${folder}/games.json.gz`, gz);
// 	});

// const path = '../data/2sync/xbl/platoons/627d46c6-12ef-4653-9342-3a7290410f1c.json';
// console.log('Reading', path);
// const str = fs.readFileSync(path, 'utf8');
// console.log('Minifying');
// const min = JSON.stringify(JSON.parse(str));
// console.log('Buffering');
// const buf = strToU8(min);
// console.log('Gzipping');
// const gz = gzipSync(buf, {
// 	filename: path.split('/').pop(),
// });
// console.log('Writing');
// fs.writeFileSync(`${path}.gz`, gz);

// const str = '[{"id":"627d46c6-12ef-4653-9342-3a7290410f1c","tag":"6SIX","name":"6th Floor","description":"We were just 2 of us","currentSize":24,"canApplyToJoin":true,"canJoinWithoutApply":false,"emblem":"https://eaassets-a.akamaihd.net/battlelog/bf-emblems/prod_default/exclusive/256/Tow_Chapter6.png"}]';
// console.log('Minifying');
// const min = JSON.stringify(JSON.parse(str));
// console.log('Buffering');
// const buf = strToU8(min);
// console.log('Gzipping');
// const gz = gzipSync(buf);
// console.log('Writing');
// fs.writeFileSync('../data/2sync/xbl/__platoons.json.gz', gz);