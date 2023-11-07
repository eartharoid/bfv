<script lang="ts">
	import { page } from "$app/stores"
</script>


<svelte:head>
	<title>Battlefield V Stats</title>
</svelte:head>

<div
	class="h-screen bg-slate-800 bg-fixed bg-cover bg-center bg-no-repeat text-white"
	style="background-image: url('/bg/narvik.webp')"
>
	<div class="flex h-full flex-col items-center justify-center backdrop-brightness-[0.6]">
		<h2 class="text-shadow-lg my-4 text-8xl font-bold shadow-black">
			Error {$page.status}
		</h2>
		<p class="text-shadow-lg my-4 text-xl font-semibold shadow-black">
			{$page.error?.message}
		</p>
	</div>
</div>
