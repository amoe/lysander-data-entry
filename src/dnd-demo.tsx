import React, {useState} from 'react';
import {
    DragDropContext, Droppable, Draggable,
    DropResult, DroppableProvided, DroppableStateSnapshot, DraggableRubric, 
    DraggableStateSnapshot, DraggableProvided, ResponderProvided
} from 'react-beautiful-dnd';

interface AppProps {
};

function makeDraggableChildren(value: string) {
    return (provided: DraggableProvided,
            snapshot: DraggableStateSnapshot,
            rubric: DraggableRubric) => 
                <li ref={provided.innerRef} 
                     {...provided.dragHandleProps}
                     {...provided.draggableProps}>{value}</li>;
}

function makeDroppableChildren(items: string[]) {
    return (provided: DroppableProvided, 
            snapshot: DroppableStateSnapshot) =>
                <ul ref={provided.innerRef}>
                  {items.map((value, i) => (
                      <Draggable draggableId={i.toString()}
                                 index={i}
                                 key={i}
                                 isDragDisabled={false}>
                        {makeDraggableChildren(value)}
                      </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>;
}

export function DndDemo(props: AppProps) {
    const [items, setItems] = useState(['fry', 'bender', 'leela']);

    const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
        if (!result.destination)  return;    // invalid drop

        const startIndex = result.source.index;
        const endIndex = result.destination.index;

        // Destructure because we know we always have 1 item.
        const [removed] = items.splice(startIndex, 1);
        items.splice(endIndex, 0, removed);
        setItems(items);

        console.log("start index is %o, end index is %o", startIndex, endIndex);
    };

    return (
        <div>
          <h1>Hello</h1>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="main" isDropDisabled={false}>
              {makeDroppableChildren(items)}
            </Droppable>
          </DragDropContext>
        </div>
    );
}
