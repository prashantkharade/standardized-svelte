<script lang="ts">
	import Try from './try.svelte';
	let req: number;
	function getValue(required: number) {
		req = required;
		if (required > 0) console.log('required is ', required);
	}
</script>

<Try increase={(required: any) => getValue(required)} />

{req}
