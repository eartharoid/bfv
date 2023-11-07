<script lang="ts">
	export let text: string = "Back";
	// @ts-ignore
	import Fa from "svelte-fa/src/fa.svelte";
	import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
</script>

<a href="../" class="hover:underline hover:decoration-double">
	<p class="flex flex-row items-center gap-2 font-semibold">
		<Fa icon={faArrowLeft}></Fa>
		{text}
	</p>
</a>
