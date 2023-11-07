<script lang="ts">
	import { page } from "$app/stores";
	import Footer from "$lib/components/Footer.svelte";

	const platformSlug = <"xbl" | "psn" | "origin">$page.params.platform;
	const platforms = {
		xbl: "Xbox",
		psn: "PlayStation",
		origin: "PC"
	};
	const platformName = platforms[platformSlug];
</script>

<svelte:head>
	<title>BFV {platformName} Stats</title>
</svelte:head>

<div
	class="min-h-screen bg-slate-800 bg-cover bg-fixed bg-center bg-no-repeat text-white"
	style="background-image: url('/bg/spitfires.webp')"
>
	<div class="min-h-screen backdrop-brightness-[0.6]">
		<div class="container mx-auto">
			<div class="flex h-screen flex-col items-center justify-center">
				<a href="/">
					<img src="/logo.png" class="mb-8 h-auto w-56" alt="BFV" />
				</a>

				<h2 class="text-shadow-lg my-8 text-2xl font-bold shadow-black">{platformName} Stats</h2>

				<div class="mb-8 flex flex-row gap-4">
					<a
						href="./players/"
						class="shadow-black transition duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-lg"
					>
						<div class="rounded-lg border-2 border-white/50 bg-black/50 px-6 py-4 backdrop-blur-md">
							<p class="text-xl font-semibold">Players</p>
						</div>
					</a>
					<a
						href="./platoons/"
						class="shadow-black transition duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-lg"
					>
						<div class="rounded-lg border-2 border-white/50 bg-black/50 px-6 py-4 backdrop-blur-md">
							<p class="text-xl font-semibold">Platoons</p>
						</div>
					</a>
				</div>
			</div>
			<div class="absolute bottom-0 left-0 right-0">
				<Footer />
			</div>
		</div>
	</div>
</div>
