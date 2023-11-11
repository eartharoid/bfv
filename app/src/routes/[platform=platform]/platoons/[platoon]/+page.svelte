<script lang="ts">
	export let data: PageData;
	import type { PageData } from "./$types";
	import { page } from "$app/stores";
	import Footer from "$lib/components/Footer.svelte";
	import Back from "$lib/components/Back.svelte";
	// @ts-ignore
	import Fa from "svelte-fa/src/fa.svelte";
	import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";
	import type { TRNPlatform } from "$lib/types";
	// import { faXbox, faPlaystation, faSteam } from "@fortawesome/free-brands-svg-icons";

	const platformSlug = <TRNPlatform>$page.params.platform;
	// const platformIcons = {
	// 	xbl: faXbox,
	// 	psn: faPlaystation,
	// 	origin: faSteam
	// };
	const platforms = {
		xbl: "Xbox",
		psn: "PlayStation",
		origin: "PC"
	};
	const platformName = platforms[platformSlug];
	const gameToolsPlatforms = {
		xbl: "xboxone",
		psn: "ps4",
		origin: "pc"
	};
	const roleColours = {
		General: "text-yellow-500",
		Colonel: "text-blue-500",
		Lieutenant: "text-green-500",
		Private: "text-slate-400",
		Unknown: "text-slate-400"
	};
</script>

<svelte:head>
	<title>[{data.platoon.tag}] {data.platoon.name} - Battlefield V {platformName} Stats</title>
</svelte:head>

<div
	class="min-h-screen bg-slate-800 bg-cover bg-fixed bg-center bg-no-repeat text-white"
	style="background-image: url('/bg/squad-action.webp')"
>
	<div class="min-h-screen bg-gradient-to-bl from-slate-800/75 to-slate-900">
		<div
			class="lg:px-18 3xl:px-56 4xl:px-64 relative mx-auto h-screen overflow-scroll p-8 md:p-12 2xl:px-48"
		>
			<div class="grid grid-cols-1 gap-12 lg:grid-cols-3">
				<div>
					<div class="m-2 sm:m-8 lg:fixed">
						<div>
							<Back text="Platoons" />
							<!-- <img src={data.platoon.emblem} alt="" class="opacity-20 brightness-75 absolute -z-10"> -->
							<div class="mb-12 mt-2 flex flex-row items-center gap-2">
								<!-- <Fa icon={platformIcons[platformSlug]} class="text-4xl text-slate-400"></Fa> -->
								<img src={data.platoon.emblem} alt="" class="mt-2 w-16 rounded-lg" />
								<div class="text-shadow-lg shadow-black">
									<p class="text-xl font-semibold">
										<span class="text-slate-500">[</span>
										<span class="text-slate-200">{data.platoon.tag}</span>
										<span class="text-slate-500">]</span>
									</p>
									<h1 class="text-4xl font-bold">{data.platoon.name}</h1>
								</div>
							</div>
						</div>
						<div class="flex flex-col gap-1 font-semibold">
							<a href="#overview">
								<p class="rounded-md px-2 py-0.5 transition duration-300 hover:bg-white/25">
									Overview
								</p>
							</a>
						</div>

						<hr class="my-8 border-slate-600" />

						<div class="flex flex-col gap-2 font-semibold">
							<a
								href={`https://gametools.network/platoons/${gameToolsPlatforms[platformSlug]}/${data.platoon.id}`}
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
					<main class="m-2 sm:my-8">
						<h2 id="overview" class="text-shadow-xl text-2xl font-bold shadow-black">Overview</h2>
						<div
							class="my-6 rounded-lg border border-slate-600 bg-slate-900/50 p-2 sm:p-4 md:p-6 backdrop-blur-xl"
						>
							<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
							<!-- <div class="flex flex-wrap flex-row gap-4 md:gap-8 justify-evenly"> -->
								<div>
									<h4 class="font-semibold">Tag</h4>
									<p class="text-sm text-slate-300">{data.platoon.tag}</p>
								</div>
								<div>
									<h4 class="font-semibold">General</h4>
									<p class="text-sm text-slate-300">
										{data.platoon.members.find((m) => m.role === "General")?.name}
									</p>
								</div>
								<div class="md:col-span-2">
								<!-- <div> -->
								<h4 class="font-semibold">Description</h4>
									<p class="text-sm text-slate-300">{data.platoon.description}</p>
								</div>
							</div>
							<div class="mt-6">
								<h4>
									<span class="font-semibold">Members</span>
									<span class="text-sm text-slate-400">({data.platoon.currentSize})</span>
								</h4>
								<div class="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 max-h-48 overflow-y-auto"> <!-- max-h-60 is perfect -->
									{#each data.platoon.members as member}
										<div>
											<a
												href={`../../players/${member.name}/`}
												class="block rounded-md bg-slate-400/10 p-2 px-4 transition duration-150 hover:bg-slate-100/10"
											>
												<p class={`text-xs ${roleColours[member.role]}`}>{member.role}</p>
												<p class="text-sm text-slate-200">{member.name}</p>
											</a>
										</div>
									{/each}
								</div>
							</div>
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
