export function HeaderFactory(setHeaders: (headers: Record<string, string>) => void) {
	return {
		cache(value: string = "public, max-age=3600") {
			// headers["Cache-Control"] = value;
			setHeaders({ "cache-control": value });
			return this;
		},
		gzip() {
			// headers["Content-Encoding"] = "gzip";
			setHeaders({ "content-encoding": "gzip" });
			return this;
		},
		json() {
			// headers["Content-Type"] = "application/json";
			setHeaders({ "content-type": "application/json" });
			return this;
		}
	};
}
