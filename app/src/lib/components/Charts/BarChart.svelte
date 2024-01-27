<script lang="ts">
	export let data: XYData;
	import { onMount } from "svelte";
	import type { XYData } from "$lib/types";

	let canvas: HTMLCanvasElement;

	onMount(async () => {
		const { Chart, registerables } = await import("chart.js");
		Chart.register(...registerables);
		Chart.defaults.color = "white";
		Chart.defaults.borderColor = "rgba(0, 0, 0, 0.1)";
		const ctx = canvas.getContext("2d");

		if (!ctx) {
			console.error("No context for canvas");
			return;
		}

		new Chart(ctx, {
			type: "bar",
			data: {
				datasets: [
					{
						label: "label",
						data,
					}
				]
			},
			options: {
				scales: {
					y: {
						beginAtZero: true
					}
				}
			}
		});
	});
</script>

<div>
	<canvas bind:this={canvas} id="" width="100%" height="50" />
</div>
