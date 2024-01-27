<script lang="ts">
	export let data: PageData;
	import type { PageData } from "./$types";
	import { page } from "$app/stores";
	import Footer from "$lib/components/Footer.svelte";
</script>

<svelte:head>
	<title>Battlefield V Game Modes</title>
</svelte:head>

<div
	class="min-h-screen bg-slate-800 bg-cover bg-fixed bg-center bg-no-repeat text-white"
	style="background-image: url('/bg/raf.webp')"
>
	<div class="min-h-screen backdrop-brightness-[0.6]">
		<div class="container mx-auto">
			<div class="flex h-full flex-col items-center justify-center pt-16">
				<a href="/">
					<img src="/logo.png" class="mb-8 h-auto w-56" alt="BFV" />
				</a>

				<h2 class="text-shadow-lg mb-8 text-2xl font-bold shadow-black">Game Modes</h2>

				<p>
					Source: <a
						href="https://battlefieldtracker.com/"
						target="_blank"
						class="underline decoration-dotted hover:decoration-double">Battlefield Tracker</a
					>
				</p>

				<div class="my-12 grid w-8/12 grid-cols-1 gap-6">
					{#each Object.values(data.gamemodes) as gamemode}
						<div class="rounded-lg border-2 border-white/50 bg-black/50 p-8 backdrop-blur-md">
							<p class="pb-2 font-semibold">
								<span class="text-2xl">{gamemode.name}</span>
							</p>
							<p class="text-lg text-gray-100">{gamemode.description || ""}</p>
						</div>
					{/each}
				</div>
			</div>
		</div>
		<div class="bottom-0 left-0 right-0">
			<Footer />
		</div>
	</div>
</div>
