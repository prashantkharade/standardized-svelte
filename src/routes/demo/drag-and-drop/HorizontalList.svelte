<script lang="ts">   
    import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
    export let items:any;
    export let containerWidth = '200vw';
    export let itemWidth = '5em';
	const flipDurationMs = 300;
	function handleDndConsider(e: { detail: { items: any; }; }) {
		items = e.detail.items;
	}
	function handleDndFinalize(e: { detail: { items: any; }; }) {
		items = e.detail.items;
	}
</script>

<style>
	section {
    height: 60px;
		padding: 0.3em;
		border: 1px solid black;
		display: flex;
		overflow-x: scroll;
	}
	div {
    height: 45px;
    display: inline-block;
		padding: 0.9em;
		border: 1px solid blue;
		margin: 0 0.15em;
	}
</style>
<section style="width:{containerWidth}" use:dndzone={{items, flipDurationMs}} on:consider={handleDndConsider} on:finalize={handleDndFinalize}>
	{#each items as item(item.id)}
		<div style="flex: 0 0 {itemWidth}" animate:flip="{{duration: flipDurationMs}}">
			{item.name}	
		</div>
	{/each}
</section>