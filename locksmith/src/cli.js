import { config } from 'dotenv';
import { program } from 'commander';
import { sign } from './lib.js';

// function collect(value, previous) {
// 	return previous.concat([value]);
// }

config();

program
	.name('locksmith')
	.requiredOption('--subject <platform:player>')
	// .option('--player <platform:player>[]', 'valid players', collect, [])
	// .option('--platoon <platform:uuid>', 'valid platoons', collect, []);
	.option('--players <platform:player>[]', 'comma-separated valid players', (v) => v.split(','))
	.option('--platoons <platform:platoon>[]', 'comma-separated valid platoons', (v) => v.split(','))

program.parse(process.argv);
const options = program.opts();

if ((!options.players || options.players.length === 0) && (!options.platoons || options.platoons.length === 0)) {
	console.error('Must specify at least one player or platoon');
	process.exit(1);
}

const platforms = ['xbl', 'psn', 'origin'];

if (options.players) {
	options.players.every((player) => {
		if (player === '*') return true;
		const [platform, name] = player.split(':');
		if (!platform || !name || !platforms.includes(platform)) {
			console.error(`Invalid player: ${player}`);
			process.exit(1);
		}
		return true;
	});
}

if (options.platoons) {
	options.platoons.every((platoon) => {
		if (platoon === '*') return true;
		const [platform, uuid] = player.split(':');
		if (!platform || !uuid || !platforms.includes(platform)) {
			console.error(`Invalid platoon: ${platoon}`);
			process.exit(1);
		}
		return true;
	});
}

const payload = {
	iat: Math.floor(Date.now() / 1000),
	sub: options.subject,
};

if (options.players) payload.vpy = options.players;
if (options.platoons) payload.vpt = options.platoons;

const jwt = await sign(payload);
const trimmed = jwt.substring(37); // remove "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." because its the same for all tokens

console.log(trimmed);