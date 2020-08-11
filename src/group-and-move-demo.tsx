import React, {useReducer, useState} from 'react';
import {cloneDeep} from 'lodash';

type EventContent = string;
type EventItem = EventContent | Array<EventContent>;
type EventList = Array<EventItem>;

enum ActionType {
    ADD_ITEM = 'addItem',
    MOVE_ITEM = 'moveItem'
};


type Action = 
  {type: ActionType.ADD_ITEM, content: EventContent}
  | {type: ActionType.MOVE_ITEM, sourcePosition: number, targetPosition: number};


function reduceEventList(state: EventList, action: Action): EventList {
    switch (action.type) {
        case ActionType.ADD_ITEM:
            return [...state, action.content];
        case ActionType.MOVE_ITEM:
            // XXX: error handling
            const newState = cloneDeep(state);
            const removed = newState.splice(action.sourcePosition, 1)[0];
            newState.splice(action.targetPosition, 0, removed);
            return newState;
        default:
            throw new Error("no");
    }
}



export function GroupAndMoveDemo() {
    const [state, dispatch] = useReducer(reduceEventList, []);
    const [sourcePosition, setSourcePosition] = useState<number>(0);
    const [targetPosition, setTargetPosition] = useState<number>(0);

    const handleTargetPositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTargetPosition(parseInt(e.target.value));
    };

    const handleSourcePositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSourcePosition(parseInt(e.target.value));
    };

    return (
        <div>
          <h1>My Component</h1>

          <h2>Values</h2>

          <p>Count: {state.length}</p>

          <ol>
            {state.map((x, i) => <li>{x}</li>)}
          </ol>

          <h2>Actions</h2>

          <div>
            <button onClick={() => dispatch({type: ActionType.ADD_ITEM, content: "foo " + Date.now()})}>Add item</button>
          </div>
          
          <div>
            <label>Source position
              <input type="number"
                     value={sourcePosition}
                     onChange={handleSourcePositionChange}/>
            </label>

            <label>Target position
              <input type="number"
                     value={targetPosition}
                     onChange={handleTargetPositionChange}/>
            </label>


            <button onClick={() => dispatch({type: ActionType.MOVE_ITEM, sourcePosition, targetPosition})}>Move item</button>
          </div>

        </div>
    );
}

