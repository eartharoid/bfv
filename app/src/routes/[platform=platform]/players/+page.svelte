<script lang="ts">
	export let data: PageData;
	import type { PageData } from "./$types";
	import { page } from "$app/stores";
	import Footer from "$lib/components/Footer.svelte";
	import Back from "$lib/components/Back.svelte";
	import type { TRNPlatform } from "$lib/types";

	const platformSlug = <TRNPlatform>$page.params.platform;
	const platforms = {
		xbl: "Xbox",
		psn: "PlayStation",
		origin: "PC"
	};
	const platformName = platforms[platformSlug];
</script>

<svelte:head>
	<title>Battlefield V {platformName} Players</title>
</svelte:head>

<div
	class="min-h-screen bg-slate-800 bg-cover bg-fixed bg-center bg-no-repeat text-white"
	style="background-image: url('/bg/iwo-jima.webp')"
>
	<div class="min-h-screen backdrop-brightness-75">
		<div class="grid min-h-screen grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3">
			<div class="to-black-0 h-full bg-gradient-to-r from-black/80 p-8 md:p-16 lg:p-24">
				<div class="mx-auto">
					<Back />
					<h1 class="mb-12 mt-2 text-4xl font-bold">{platformName} Players</h1>
					<div class="flex flex-col gap-1">
						{#each data.players as player}
							<a href={`./${encodeURIComponent(player)}/`}>
								<p
									class="rounded-sm bg-black/50 px-4 py-2 transition duration-300 hover:bg-white/25"
								>
									{player}
								</p>
							</a>
						{/each}
					</div>
				</div>
			</div>
			<div class="absolute pointer-events-none bottom-0 left-0 right-0">
				<Footer />
			</div>
		</div>
	</div>
</div>
