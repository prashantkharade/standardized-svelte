<!-- <script lang="ts">
    export let id: string;
    export let text: string;
  
    function handleDragStart(event: DragEvent) {
      event.dataTransfer?.setData('text/plain', id);
    }
  </script>
  
  <div 
    class="draggable p-4 border border-gray-400 m-2 cursor-grab bg-gray-200"
    draggable="true" 
    on:dragstart={handleDragStart}
  >
    {text}
  </div>
   -->

<script lang="ts">
	import { draggable } from '$lib/index';

	export let id: string;
	export let text: string;
</script>

<div
	use:draggable={{ id, text }}
	class="draggable m-2 cursor-grab border border-gray-400 bg-gray-200 p-4"
>
	{text}
</div>
