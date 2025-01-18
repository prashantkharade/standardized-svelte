<script lang="ts">
	let { increase } = $props();
	let required = $state();
	required = 15 + 5;
</script>

<div class="m-10 flex flex-col space-x-4 space-y-4 bg-slate-200 p-20">
	<button
		class="w-20 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
		onclick={() => increase(required)}>Add</button
	>
</div>
