import React from 'react';
import {
    DragDropContext, Droppable, 
    DropResult, DroppableProvided, DroppableStateSnapshot
} from 'react-beautiful-dnd';

interface AppProps {
};

function onDragEnd(result: DropResult, provided: any) {
    console.log("ondragend called");
}

function droppableChildren(
    provided: DroppableProvided, snapshot: DroppableStateSnapshot
) {
    return (
        <div>
          <h2>Hi.</h2>
        </div>
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
