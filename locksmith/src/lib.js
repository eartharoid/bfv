import { createSigner } from 'fast-jwt';

export function sign(payload) {
	const sign = createSigner({ key: async () => process.env.JWT_SECRET })
	return sign(payload)
}