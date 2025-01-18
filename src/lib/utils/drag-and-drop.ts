export function draggable(node: HTMLElement, data: any) {
    node.draggable = true;
    node.style.cursor = 'grab';

    function handle_dragstart(e: DragEvent) {
        if (!e.dataTransfer) return;
        e.dataTransfer.setData('text/plain', JSON.stringify(data));
    }

    node.addEventListener('dragstart', handle_dragstart);

    return {
        update(newData: any) {
            data = newData;
        },
        destroy() {
            node.removeEventListener('dragstart', handle_dragstart);
        }
    };
}






// export function dropzone(node: HTMLElement, options: any) {
//     let state = {
//         dropEffect: 'copy',
//         dragover_class: 'droppable',
//         on_dropzone: (data: any, e: DragEvent) => { },
//         ...options
//     };

//     function handle_dragenter(e: DragEvent) {
//         if (!(e.target instanceof HTMLElement)) return;
//         e.target.classList.add(state.dragover_class);
//     }

//     function handle_dragleave(e: DragEvent) {
//         if (!(e.target instanceof HTMLElement)) return;
//         e.target.classList.remove(state.dragover_class);
//     }

//     function handle_dragover(e: DragEvent) {
//         e.preventDefault();
//         if (!e.dataTransfer) return;
//         e.dataTransfer.dropEffect = state.dropEffect;
//     }

//     function handle_drop(e: DragEvent) {
//         e.preventDefault();
//         if (!e.dataTransfer) return;
//         const data = e.dataTransfer.getData('text/plain');
//         if (!(e.target instanceof HTMLElement)) return;
//         e.target.classList.remove(state.dragover_class);
//         state.on_dropzone(JSON.parse(data), e);
//     }

//     node.addEventListener('dragenter', handle_dragenter);
//     node.addEventListener('dragleave', handle_dragleave);
//     node.addEventListener('dragover', handle_dragover);
//     node.addEventListener('drop', handle_drop);

//     return {
//         update(newOptions: any) {
//             state = {
//                 dropEffect: 'copy',
//                 dragover_class: 'droppable',
//                 on_dropzone: (data: any, e: DragEvent) => { },
//                 ...newOptions
//             };
//         },
//         destroy() {
//             node.removeEventListener('dragenter', handle_dragenter);
//             node.removeEventListener('dragleave', handle_dragleave);
//             node.removeEventListener('dragover', handle_dragover);
//             node.removeEventListener('drop', handle_drop);
//         }
//     };
// }


export function dropzone(node: HTMLElement, options) {
    let state = {
        dropEffect: 'copy',
        dragover_class: 'droppable',
        on_dropzone: (data: any, e: DragEvent) => { },
        ...options
    };

    function handle_dragenter(e: DragEvent) {
        if (e.target instanceof HTMLElement) {
            e.target.classList.add(state.dragover_class);
        }
    }

    function handle_dragleave(e: DragEvent) {
        if (e.target instanceof HTMLElement) {
            e.target.classList.remove(state.dragover_class);
        }
    }

    function handle_dragover(e: DragEvent) {
        e.preventDefault();
        if (e.dataTransfer) {
            e.dataTransfer.dropEffect = state.dropEffect;
        }
    }

    function handle_drop(e: DragEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (e.dataTransfer) {
            const data = e.dataTransfer.getData('text/plain');
            if (data) {
                const parsedData = JSON.parse(data);
                if (e.target instanceof HTMLElement) {
                    e.target.classList.remove(state.dragover_class);
                }
                state.on_dropzone(parsedData, e);
            }
        }
    }

    node.addEventListener('dragenter', handle_dragenter);
    node.addEventListener('dragleave', handle_dragleave);
    node.addEventListener('dragover', handle_dragover);
    node.addEventListener('drop', handle_drop);

    return {
        update(newOptions: any) {
            state = {
                ...state,
                ...newOptions
            };
        },
        destroy() {
            node.removeEventListener('dragenter', handle_dragenter);
            node.removeEventListener('dragleave', handle_dragleave);
            node.removeEventListener('dragover', handle_dragover);
            node.removeEventListener('drop', handle_drop);
        }
    };
}