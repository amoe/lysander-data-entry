import React, { Component } from "react";
import ReactDOM from "react-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

// fake data generator
function getItems(count: any) {
    return Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k}`,
        content: `item ${k}`
    }));
}

// a little function to help us with reordering the result
function reorder(list: any, startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

const grid = 8;

function getItemStyle(isDragging: any, draggableStyle: any) {
    return {
        // some basic styles to make the items look a bit nicer
        userSelect: "none",
        padding: grid * 2,
        margin: `0 0 ${grid}px 0`,

        // change background colour if dragging
        background: isDragging ? "lightgreen" : "grey",

        // styles we need to apply on draggables
        ...draggableStyle
    };
}

function getListStyle(isDraggingOver: any) {
    return {
        background: isDraggingOver ? "lightblue" : "lightgrey",
        padding: grid,
        width: 250
    };
}

type AppProps = any;
type AppState = any;

export class RbdSample extends Component<AppProps, AppState> {
    constructor(props: any) {
        super(props);
        this.state = {
            items: getItems(10)
        };
        console.log("state is %o", this.state);
        this.onDragEnd = this.onDragEnd.bind(this);
    }

    onDragEnd(result: any) {
        // dropped outside the list
        if (!result.destination) {
            return;
        }

        const items = reorder(
            this.state.items,
            result.source.index,
            result.destination.index
        );

        this.setState({
            items
        });
    }

    // Normally you would want to split things out into separate components.
    // But in this example everything is just done in one place for simplicity
    render() {
        return (
            <DragDropContext onDragEnd={this.onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                        >
                      {this.state.items.map((item: any, index: number) => (
                          <Draggable key={item.id} draggableId={item.id} index={index}>
                            {(provided, snapshot) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    style={getItemStyle(
                                            snapshot.isDragging,
                                            provided.draggableProps.style
                                    )}
                                    >
                                  {item.content}
                                </div>
                            )}
                          </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                )}
              </Droppable>
            </DragDropContext>
        );
    }
}

