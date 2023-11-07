<script>
	// @ts-ignore
	import Fa from "svelte-fa/src/fa.svelte";
	import { faGithub, faYoutube } from "@fortawesome/free-brands-svg-icons";
</script>

<div class="py-4">
	<div class="flex flex-col items-center justify-center gap-4 pointer-events-auto">
		<a
			href="https://www.youtube.com/@eartharoid"
			target="_blank"
			class="shadow-black transition duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-lg"
		>
			<div class="rounded-lg border-2 border-red-400 bg-red-700 px-2 py-1">
				<p class="flex flex-row items-center gap-2 text-lg font-semibold">
					<Fa icon={faYoutube} size="lg"></Fa>
					@eartharoid
				</p>
			</div>
		</a>

		<div
			class="text-shadow-lg flex flex-col items-center justify-center gap-1 text-xs shadow-black"
		>
			<a
				href="https://github.com/eartharoid/bfv"
				target="_blank"
				class="underline decoration-dotted hover:decoration-double"
			>
				<p class="flex flex-row items-center justify-center gap-2 font-semibold">
					<Fa icon={faGithub}></Fa>
					GitHub
				</p>
			</a>
			<p>
				Made by
				<a
					href="https://eartharoid.me"
					target="_blank"
					class="underline decoration-dotted hover:decoration-double"
				>
					eartharoid,
				</a>
				contact me on
				<a
					href="https://lnk.earth/discord"
					target="_blank"
					class="underline decoration-dotted hover:decoration-double"
				>
					Discord
				</a>
				or Xbox: @eartharoid
			</p>
		</div>

		<!-- <div class="text-shadow-lg flex flex-col items-center justify-center gap-1 text-sm shadow-black">
			<p>
				Made by
				<a
					href="https://eartharoid.me"
					target="_blank"
					class="underline decoration-dotted hover:decoration-double"
				>
					eartharoid.
				</a>
			</p>
			<p>
				Contact me on
				<a
					href="https://lnk.earth/discord"
					target="_blank"
					class="underline decoration-dotted hover:decoration-double"
				>
					Discord
				</a>
				or Xbox: @eartharoid.
			</p>
			<a
				href="https://github.com/eartharoid/bfv"
				target="_blank"
				class="underline decoration-dotted hover:decoration-double"
			>
				<p class="flex flex-row items-center justify-center gap-2 font-semibold">
					<Fa icon={faGithub}></Fa>
					GitHub
				</p>
			</a>
		</div> -->
	</div>
</div>
