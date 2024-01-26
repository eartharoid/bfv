<script>
	// @ts-ignore
	import Fa from "svelte-fa/src/fa.svelte";
	import { faXbox } from "@fortawesome/free-brands-svg-icons";
	import Footer from "$lib/components/Footer.svelte";
</script>

<svelte:head>
	<title>Battlefield V Stats</title>
</svelte:head>

<div
	class="min-h-screen bg-slate-800 bg-cover bg-fixed bg-center bg-no-repeat text-white"
	style="background-image: url('/bg/marita.webp')"
>
	<div class="min-h-screen backdrop-brightness-[0.6]">
		<div class="container mx-auto">
			<div class="flex h-screen flex-col items-center justify-center">
				<img src="/logo.png" class="mb-8 h-auto w-56" alt="BFV" />

				<h2 class="text-shadow-lg mb-8 text-2xl font-bold shadow-black">
					Select a platform to view stats
				</h2>

				<div class="mb-12 flex flex-row gap-4">
					<a
						href="/xbl/"
						class="shadow-black transition duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-lg"
					>
						<div class="bg-xbox rounded-lg border-2 border-white/50 px-6 py-4">
							<p class="flex flex-row items-center justify-center gap-2 text-xl font-semibold">
								<Fa icon={faXbox}></Fa>
								Xbox
							</p>
						</div>
					</a>
				</div>

				<div class="mb-12 flex flex-row items-center gap-6">
					<h3 class="text-shadow-lg font-semibold shadow-black">Or explore:</h3>
					<a
						href="/gamemodes/"
						class="shadow-black transition duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-lg"
					>
						<div class="rounded-lg border-2 border-white/50 bg-black/25 px-2 py-1 backdrop-blur-md">
							<p class="font-semibold">Game modes</p>
						</div>
					</a>
					<a
						href="/maps/"
						class="shadow-black transition duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-lg"
					>
						<div class="rounded-lg border-2 border-white/50 bg-black/25 px-2 py-1 backdrop-blur-md">
							<p class="font-semibold">Maps</p>
						</div>
					</a>
				</div>
				<div class="absolute bottom-0 left-0 right-0">
					<Footer />
				</div>
			</div>
		</div>
	</div>
</div>
