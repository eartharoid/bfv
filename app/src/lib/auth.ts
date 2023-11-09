import type { Auth, Platoon, TRNPlatform } from "./types";
import { JWT_SECRET } from "$env/static/private";
import { createVerifier } from "fast-jwt";
import { readFile } from "./s3";
import { gunzip } from "./gzip";

export async function getAuthentication(request: Request): Promise<Auth | null> {
	const verify = createVerifier({ key: async () => JWT_SECRET });
	const authorization = request.headers.get("Authorization");
	if (!authorization) return null;
	const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." + authorization.substring(7);
	try {
		return await verify(token);
	} catch (error) {
		return null;
	}
}

export async function checkAuthorisation(
	against: { type: "player" | "platoon"; id: string; platform: TRNPlatform },
	auth: Auth
) {
	// admin
	if (auth.vpy && auth.vpy[0] === "*") return true;
	if (auth.vpt && auth.vpt[0] === "*") return true;

	const easyId = against.platform + ":" + against.id;

	// self
	if (against.type === "player" && auth.sub === easyId) return true;

	// other players
	if (against.type === "player" && auth.vpy && auth.vpy.includes(easyId)) return true;
	if (against.type === "player" && auth.vpt) {
		// this is slightly pointless because it can be easily bypassed by adding a member to a platoon but ¯\_(ツ)_/¯
		const platoons: Platoon[] = [];
		for (const vpt of auth.vpt) {
			const [platoonPlatform, platoonId] = vpt.split(":");
			if (platoonPlatform !== against.platform) continue;
			const key = `${platoonPlatform}/platoons/${platoonId}/platoon.json.gz`;
			const data = <ReadableStream>await readFile(key, { as: "stream" });
			const platoon: Platoon = await new Response(gunzip(data)).json();
			platoons.push(platoon);
		}
		return platoons.some((platoon) => platoon.members.some((member) => member.name === against.id));
	}

	// platoons
	if (against.type === "platoon" && auth.vpt && auth.vpt.includes(easyId)) return true;

	return false;
}
