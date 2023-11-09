import {
	S3_ACCESS_KEY,
	S3_BUCKET,
	S3_ENDPOINT,
	S3_REGION,
	S3_SECRET_KEY
} from "$env/static/private";
import {
	ListObjectsV2Command,
	GetObjectCommand,
	S3Client,
	HeadObjectCommand,
	PutObjectCommand
} from "@aws-sdk/client-s3";
import type { _Object, CommonPrefix } from "@aws-sdk/client-s3";

type ReadFileOptions = {
	as: "buffer" | "stream" | "string" | "raw";
};

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

export async function readFile(Key: string, options: ReadFileOptions) {
	const command = new GetObjectCommand({
		Bucket: S3_BUCKET,
		Key
	});
	try {
		const response = await s3.send(command);
		if (!response.Body) return null;
		if (options.as === "buffer") return response.Body.transformToByteArray();
		else if (options.as === "stream") return response.Body.transformToWebStream();
		else if (options.as === "string") return response.Body.transformToString();
		else if (options.as === "raw") return response;
		else throw new Error(`"${options.as}" is an invalid return type`);
	} catch (error) {
		if (error instanceof Error && error.name === "NoSuchKey") return null;
		throw error;
	}
}

export async function fileExists(Key: string) {
	const command = new HeadObjectCommand({
		Bucket: S3_BUCKET,
		Key
	});
	try {
		await s3.send(command);
		return true;
	} catch (error) {
		if (error instanceof Error && error.name === "NotFound") return false;
		throw error;
	}
}

export async function writeFile(Key: string, Body: string | Uint8Array) {
	const command = new PutObjectCommand({
		Body,
		Bucket: S3_BUCKET,
		Key
	});
	const response = await s3.send(command);
	return response;
}
