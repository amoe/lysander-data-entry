import React from 'react';
import {
    DragDropContext, Droppable, Draggable,
    DropResult, DroppableProvided, DroppableStateSnapshot, DraggableRubric, 
    DraggableStateSnapshot, DraggableProvided
} from 'react-beautiful-dnd';

interface AppProps {
};

function onDragEnd(result: DropResult, provided: any) {
    console.log("ondragend called");
}

function draggableChildren(
    provided: DraggableProvided, snapshot: DraggableStateSnapshot,
    rubric: DraggableRubric
) {

    return (
        <li ref={provided.innerRef} 
            {...provided.dragHandleProps}
            {...provided.draggableProps}>Fry</li>
    );
}

function droppableChildren(
    provided: DroppableProvided, snapshot: DroppableStateSnapshot
) {
    const items = ['fry', 'bender', 'leela'];

    return (
        <ul ref={provided.innerRef}>
          {items.map((value, i) => (
              <Draggable draggableId={i.toString()}
                         index={i}
                         key={i}>
                {draggableChildren}
              </Draggable>
          ))}
          {provided.placeholder}
        </ul>
    )
}

export function DndDemo(props: AppProps) {
    return (
        <div>
          <h1>Hello</h1>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="main">
              {droppableChildren}
            </Droppable>
          </DragDropContext>
        </div>
    );
}
