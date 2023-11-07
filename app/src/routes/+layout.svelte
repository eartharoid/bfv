<script lang="ts">
	import "../app.css";
	import { navigating } from "$app/stores";
</script>

{#if $navigating}
	<div
		class="h-screen bg-slate-800 bg-cover bg-fixed bg-center bg-no-repeat text-white"
		style="background-image: url('/bg/narvik.webp')"
	>
		<div
			class="fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center backdrop-brightness-[0.6]"
		>
			<div class="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
      <div class="absolute bottom-0 left-0 right-0">
				<div class="flex flex-col items-center justify-center my-8">
          <p class="text-lg font-semibold text-white/75">Loading ammunition...</p>
        </div>
			</div>
		</div>
	</div>
{:else}
	<slot />
{/if}
