import React, {useState, ChangeEvent} from 'react';
import {
    DragDropContext, Droppable, Draggable,
    DropResult, DroppableProvided, DroppableStateSnapshot, DraggableRubric, 
    DraggableStateSnapshot, DraggableProvided, ResponderProvided,
    DragUpdate, OnDragUpdateResponder
} from 'react-beautiful-dnd';
import {PartialDate, comparePartialDates} from './partial-date';
import {clone} from 'lodash';

interface AppProps {
//    items: string[]
};

function makeDraggableChildren(value: string) {
    return (provided: DraggableProvided,
            snapshot: DraggableStateSnapshot,
            rubric: DraggableRubric) => 
                <li ref={provided.innerRef} 
                     {...provided.dragHandleProps}
                     {...provided.draggableProps}>{value.toString()}</li>;
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


export function GroupedDndDemo(props: AppProps) {
    const characters = ['fry', 'bender', 'leela'];
    const variables = ['foo', 'bar', 'baz'];
    const cryptoUsers = ['alice', 'bob', 'charlie'];

    const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
        console.log("ondragend called");
    };

    return (
        <div>
          <h1>Sequence</h1>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="main">
              {makeDroppableChildren(characters)}
            </Droppable>
          </DragDropContext>
        </div>
    );
}
