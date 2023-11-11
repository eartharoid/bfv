<script lang="ts">
	export let data: PageData;
	import type { PageData } from "./$types";
	import { page } from "$app/stores";
	import Footer from "$lib/components/Footer.svelte";
	import Back from "$lib/components/Back.svelte";
	// @ts-ignore
	import Fa from "svelte-fa/src/fa.svelte";
	import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
	import { faXbox, faPlaystation, faSteam } from "@fortawesome/free-brands-svg-icons";
	import Chart from "chart.js/auto";
	import { onMount } from "svelte";
	import type { TRNPlatform } from "$lib/types";

	const platformSlug = <TRNPlatform>$page.params.platform;
	const platformIcons = {
		xbl: faXbox,
		psn: faPlaystation,
		origin: faSteam
	};
	const platforms = {
		xbl: "Xbox",
		psn: "PlayStation",
		origin: "PC"
	};
	const platformName = platforms[platformSlug];
	const player = $page.params.player;
</script>

<svelte:head>
	<title>{player} - Battlefield V {platformName} Stats</title>
</svelte:head>

<div
	class="min-h-screen bg-slate-800 bg-cover bg-fixed bg-center bg-no-repeat text-white"
	style="background-image: url('/bg/aerodrome.webp')"
>
	<div class="min-h-screen bg-gradient-to-bl from-slate-800/75 to-slate-900">
		<div class="relative mx-auto h-screen overflow-scroll p-8 md:p-12 lg:px-18 2xl:px-48 3xl:px-56 4xl:px-64">
			<div class="grid grid-cols-1 gap-12 lg:grid-cols-3">
				<div class="m-2 sm:m-8">
					<div class="lg:fixed">
						<div>
							<Back text="Players" />
							<h1 class="mb-12 mt-2 flex flex-row items-center gap-2 text-4xl font-bold">
								<Fa icon={platformIcons[platformSlug]} size="sm" class="text-slate-400"></Fa>
								{player}
							</h1>
						</div>
						<div class="flex flex-col gap-1 font-semibold">
							<a href={`#`}>
								<p class="rounded-md px-2 py-0.5 transition duration-300 hover:bg-white/25">
									Title 1
								</p>
							</a>
						</div>

						<hr class="my-8 border-slate-600" />

						<div class="flex flex-col gap-2 font-semibold">
							<a
								href={`https://battlefieldtracker.com/bfv/profile/xbl/${player}/overview`}
								target="_blank"
							>
								<p
									class="rounded-md border border-white/25 bg-white/10 px-2 py-0.5 transition duration-300 hover:bg-white/25"
								>
									<span class="flex flex-row items-center gap-2">
										<Fa icon={faArrowUpRightFromSquare}></Fa>
										Tracker Network
									</span>
								</p>
							</a>
							<a
								href={`https://gametools.network/stats/xboxone/name/${player}?game=bfv`}
								target="_blank"
							>
								<p
									class="rounded-md border border-white/25 bg-white/10 px-2 py-0.5 transition duration-300 hover:bg-white/25"
								>
									<span class="flex flex-row items-center gap-2">
										<Fa icon={faArrowUpRightFromSquare}></Fa>
										Game tools
									</span>
								</p>
							</a>
						</div>
					</div>
				</div>
				<div class="col-span-2">
					<main class="sm:p-4">
						<div
							class="my-12 rounded-lg border border-slate-600 bg-slate-900/50 p-2 text-slate-200 backdrop-blur-xl"
						>
							<canvas id="totalScore"></canvas>
						</div>
						<div
							class="my-12 rounded-lg border border-slate-600 bg-slate-900/50 p-2 text-slate-200 backdrop-blur-xl"
						>
							<br /><br /><br /><br /><br /><br />Hello<br /><br /><br /><br /><br /><br />
						</div>
						<div
							class="my-12 rounded-lg border border-slate-600 bg-slate-900/50 p-2 text-slate-200 backdrop-blur-xl"
						>
							<br /><br /><br /><br /><br /><br />Hello<br /><br /><br /><br /><br /><br />
						</div>
					</main>
				</div>
			</div>
			<div class="bottom-0 left-0 right-0">
				<Footer />
			</div>
		</div>
	</div>
</div>
