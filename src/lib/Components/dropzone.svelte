<script lang="ts">
    export let droppedItems: string[];
    export let onDrop: (id: string) => void;
  
    function handleDragOver(event: DragEvent) {
      event.preventDefault();
    }
  
    function handleDrop(event: DragEvent) {
      const id = event.dataTransfer?.getData('text/plain');
      if (id) {
        onDrop(id);
      }
    }
  </script>
  
  <div 
    class="dropzone p-10 border-2 border-dashed border-gray-500 m-5 bg-blue-100"
    on:dragover={handleDragOver} 
    on:drop={handleDrop}
  >
    <slot></slot>
    {#each droppedItems as item}
      <div class="mt-4 p-2 border border-gray-400 bg-gray-200">{item}</div>
    {/each}
  </div>
  

<!-- <script lang="ts">
	import { dropzone } from '$lib/index';

	export let droppedItems: string[];
	export let onDrop: (id: string) => void;
</script>

<div
	use:dropzone={{ on_dropzone: (data: any) => onDrop(data.id) }}
	class="dropzone m-5 border-2 border-dashed border-gray-500 bg-blue-100 p-10"
>
	<slot></slot>
	{#each droppedItems as item}
		<div class="mt-4 border border-gray-400 bg-gray-200 p-2">{item}</div>
	{/each}
</div> -->
