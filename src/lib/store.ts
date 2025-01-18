import { writable, type Writable } from 'svelte/store';

export const droppedItems: Writable<string[]> = writable([]);
