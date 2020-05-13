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
    items: PartialDate[]
};

function makeDraggableChildren(value: PartialDate) {
    return (provided: DraggableProvided,
            snapshot: DraggableStateSnapshot,
            rubric: DraggableRubric) => 
                <li ref={provided.innerRef} 
                     {...provided.dragHandleProps}
                     {...provided.draggableProps}>{value.toString()}</li>;
}

function makeDroppableChildren(items: PartialDate[]) {
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
    const [items, setItems] = useState(props.items);
    const [year, setYear] = useState("");
    const [isDropDisabled, setDropDisabled] = useState(false);

    const onDragUpdate: OnDragUpdateResponder = (u, p) => {
        console.log("update is %o", u);

        const d = u.destination;

        if (!u.destination) {
            console.log("no destination, drop allowed");
            // Drag to nowhere
            //setDropDisabled(true);
        } else if (u.destination.index === 0) {
            console.log("disallowed");
            setDropDisabled(true);
        } else {
            console.log("non zero destination, drop allowed");
            setDropDisabled(false);
            // Allowed
        }

//        setDropDisabled(true);
    };


    const onDragEnd = (result: DropResult, provided: ResponderProvided) => {
        setDropDisabled(false);
        if (!result.destination)  return;    // invalid drop

        const startIndex = result.source.index;
        const endIndex = result.destination.index;

        // Destructure because we know we always have 1 item.
        const [removed] = items.splice(startIndex, 1);
        items.splice(endIndex, 0, removed);
        setItems(items);

        console.log("start index is %o, end index is %o", startIndex, endIndex);
    };

    const handleClick = () => {
        const newItemsValue = clone(items);
        newItemsValue.sort(comparePartialDates);
        setItems(newItemsValue);
    };

    const handleYearChange = (event: ChangeEvent<HTMLInputElement>) => {
        setYear(event.currentTarget.value);
    }

    const handleAdd = () => {
        const yearNum = parseInt(year);
        const newItemsValue = clone(items);
        newItemsValue.push(new PartialDate(yearNum))
        setItems(newItemsValue);
    };

    return (
        <div>
          <h1>Sequence</h1>

          <DragDropContext onDragEnd={onDragEnd}
                           onDragUpdate={onDragUpdate}>
            <Droppable droppableId="main" isDropDisabled={isDropDisabled}>
              {makeDroppableChildren(items)}
            </Droppable>
          </DragDropContext>

          <button onClick={handleClick}>Sort</button>

          <p>Val is {year}</p>

          <label>Year only:</label>
          <input value={year} onChange={handleYearChange} />

          <button onClick={handleAdd}>Add</button>
        </div>
    );
}
