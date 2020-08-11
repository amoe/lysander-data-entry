import React, {useReducer} from 'react';

type EventContent = string;
type EventItem = EventContent | Array<EventContent>;
type EventList = Array<EventItem>;

enum ActionType {
    ADD_ITEM = 'addItem'
};


type Action = {type: ActionType.ADD_ITEM, content: EventContent}


function reduceEventList(state: EventList, action: Action): EventList {
    switch (action.type) {
        case ActionType.ADD_ITEM:
            return [...state, action.content]
        default:
            throw new Error("no");
    }
}



export function GroupAndMoveDemo() {
    const [state, dispatch] = useReducer(reduceEventList, []);

    return (
        <div>
          <h1>My Component</h1>

          <ol>
            {state.map((x, i) => <li>{x}</li>)}
          </ol>

          <button onClick={() => dispatch({type: ActionType.ADD_ITEM, content: "foo"})}>Add item</button>
        </div>
    );
}

