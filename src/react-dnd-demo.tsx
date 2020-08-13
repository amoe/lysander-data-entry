import React, {useState} from 'react';
import {DndProvider, useDrag, useDrop, DragSourceMonitor, DropTargetMonitor} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {cloneDeep} from 'lodash';

enum ItemType {
    LIST_ITEM = 'listItem'
};

interface DragObject {
    type: ItemType,
    id: number
}


//drop?: (item: DragObject, monitor: DropTargetMonitor) => DropResult | undefined;
//canDrop?: (item: DragObject, monitor: DropTargetMonitor) => boolean;


// see interfaces/hooksApi.d.ts

function ListItem(props: {id: number, value: string, onSwap: Function}) {
    const dragSpec = {
        item: {type: ItemType.LIST_ITEM, id: props.id},
        collect: (monitor: DragSourceMonitor) => ({
            isDragging: !!monitor.isDragging()
        })
    };
            
    const [dragProps, dragSourceRef, dragPreviewRef] = useDrag(dragSpec);

    const dropSpec = {
        accept: ItemType.LIST_ITEM,
        drop: (item: any, monitor: any) => {
            props.onSwap(item.id, props.id);
        },
        hover: (item: DragObject, monitor: DropTargetMonitor) => {
            console.log("testing droppability: %o", monitor.canDrop());
        },
        canDrop: (item: DragObject, monitor: DropTargetMonitor) => {
            return false;
        }
    };

    const [dropProps, dropTargetRef] = useDrop(dropSpec);
    
    return (
        <li ref={dropTargetRef}>
          <span ref={dragSourceRef}>{props.value}</span>
        </li>
    );
}

export function ReactDndDemo() {
    const initialData = [
        {id: 1, value: "Fry"},
        {id: 2, value: "Bender"},
        {id: 3, value: "Leela"}
    ];

    const [data, setData] = useState(initialData);
    

    function handleSwap(sourceId: number, targetId: number) {
        console.log("I would handle swap: %o -> %o", sourceId, targetId);
        const sourcePosition = data.findIndex(x => x.id === sourceId);
        const targetPosition = data.findIndex(x => x.id === targetId);
        
        console.log("swapping position ", sourcePosition, targetPosition);

        const newData = cloneDeep(data);
        newData[targetPosition] = data[sourcePosition];
        newData[sourcePosition] = data[targetPosition];
        setData(newData);
    }


    return (
        <DndProvider backend={HTML5Backend}>
          <div>
            <h1>My Component</h1>

            <ol>
              {data.map(x => <ListItem key={x.id} {...x} onSwap={handleSwap}/>)}
            </ol>
          </div>
        </DndProvider>
    );
}

