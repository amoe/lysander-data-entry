import React from 'react';
import {DndProvider, useDrag, useDrop, DragSourceMonitor} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';

enum ItemType {
    LIST_ITEM = 'listItem'
};


//drop?: (item: DragObject, monitor: DropTargetMonitor) => DropResult | undefined;

// see interfaces/hooksApi.d.ts

function ListItem(props: {value: string}) {
    const dragSpec = {
        item: {type: ItemType.LIST_ITEM},
        collect: (monitor: DragSourceMonitor) => ({
            isDragging: !!monitor.isDragging()
        })
    };
            
    const [dragProps, dragSourceRef, dragPreviewRef] = useDrag(dragSpec);

    const dropSpec = {
        accept: ItemType.LIST_ITEM,
        drop: (item: any, monitor: any) => {
            console.log("item is %o", monitor.getItem());
        }
    };

    const [dropProps, dropTargetRef] = useDrop(dropSpec);
    
    return <li ref={dropTargetRef}><span ref={dragSourceRef}>{props.value}</span></li>;
}

export function ReactDndDemo() {
    return (
        <DndProvider backend={HTML5Backend}>
          <div>
            <h1>My Component</h1>

            <ol>
              <ListItem value="Fry"/>
              <ListItem value="Bender"/>
              <ListItem value="Leela"/>
            </ol>
          </div>
        </DndProvider>
    );
}

