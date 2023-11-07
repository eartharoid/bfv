import {
	S3_ACCESS_KEY,
	S3_BUCKET,
	S3_ENDPOINT,
	S3_REGION,
	S3_SECRET_KEY
} from "$env/static/private";
import { ListObjectsV2Command, GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import type { _Object, CommonPrefix } from "@aws-sdk/client-s3";

const s3 = new S3Client({
	credentials: {
		accessKeyId: S3_ACCESS_KEY,
		secretAccessKey: S3_SECRET_KEY
	},
	endpoint: S3_ENDPOINT,
	region: S3_REGION
	// signatureVersion: "v4"
});

export async function ls(Prefix: string) {
	const command = new ListObjectsV2Command({
		Bucket: S3_BUCKET,
		Prefix,
		Delimiter: "/"
	});

	let isTruncated = true;
	let objects: _Object[] = [];
	let folders: CommonPrefix[] = [];

	while (isTruncated) {
		const { Contents, CommonPrefixes, IsTruncated, NextContinuationToken } = await s3.send(command);
		if (Contents !== undefined) objects = objects.concat(Contents);
		if (CommonPrefixes !== undefined) folders = folders.concat(CommonPrefixes);
		if (IsTruncated !== undefined) isTruncated = IsTruncated;
		command.input.ContinuationToken = NextContinuationToken;
	}

	// B2 doesn't always return them in order
	return {
		folders: folders.sort(({ Prefix: a }, { Prefix: b }) => (a && b ? a.localeCompare(b) : 0)),
		objects: objects.sort(({ Key: a }, { Key: b }) => (a && b ? a.localeCompare(b) : 0))
	};
}

export async function readFile(Key: string) {
	const command = new GetObjectCommand({
		Bucket: S3_BUCKET,
		Key
	});
	const response = await s3.send(command);
	const data = await response.Body?.transformToString();
	return data;
}
