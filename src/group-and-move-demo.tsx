import React, {useReducer, useState} from 'react';
import {cloneDeep} from 'lodash';
import uuidv4 from 'uuid/v4';


enum ListItemType {
    SINGLE_EVENT = 'singleEvent',
    GROUP = 'group'
}

type EventContent = string;
type EventItem = 
    {type: ListItemType.SINGLE_EVENT, content: EventContent, id: string}
    | {type: ListItemType.GROUP, groupContent: EventContent[], id: string};
type EventList = Array<EventItem>;

enum ActionType {
    ADD_ITEM = 'addItem',
    MOVE_ITEM = 'moveItem',
    CONNECT_TO_ADJACENT_ITEM = 'connectToAdjacentItem'
};


type Action = 
  {type: ActionType.ADD_ITEM, content: EventContent}
  | {type: ActionType.MOVE_ITEM, sourcePosition: number, targetPosition: number}
  | {type: ActionType.CONNECT_TO_ADJACENT_ITEM, firstItem: number};

function contentAsArray(item: EventItem) {
    switch (item.type) {
        case ListItemType.SINGLE_EVENT:
            return [item.content];
        case ListItemType.GROUP:
            return item.groupContent;
        default:
            throw new Error("no");
    }
}


function connectToAdjacentItem(state: EventList, firstItem: number) {
    const targetItem = state[firstItem];
    const itemToMerge = state.splice(firstItem + 1, 1)[0];

    switch (targetItem.type) {
        case ListItemType.SINGLE_EVENT:
            const newContent: EventContent[] = [
                targetItem.content
            ];
            newContent.push(...contentAsArray(itemToMerge));

            state[firstItem] = {
                type: ListItemType.GROUP,
                groupContent: newContent,
                id: targetItem.id   /// not sure if this is correct
            };
            break;
        case ListItemType.GROUP:
            targetItem.groupContent.push(...contentAsArray(itemToMerge));
            break;
        default:
            throw new Error("no");
    }

    return state;
}

function reduceEventList(state: EventList, action: Action): EventList {
    switch (action.type) {
        case ActionType.ADD_ITEM:
            return [...state, {type: ListItemType.SINGLE_EVENT, content: action.content, id: uuidv4()}];
        case ActionType.MOVE_ITEM:
            // XXX: error handling
            const newState = cloneDeep(state);
            const removed = newState.splice(action.sourcePosition, 1)[0];
            newState.splice(action.targetPosition, 0, removed);
            return newState;
        case ActionType.CONNECT_TO_ADJACENT_ITEM:
            return connectToAdjacentItem(cloneDeep(state), action.firstItem);
        default:
            throw new Error("no");
    }
}

function EventGroup(props: {members: EventContent[]}) {
    return <li>Group of {props.members.length} items</li>;
}

function EventItem(props: EventItem) {
    switch (props.type) {
        case ListItemType.SINGLE_EVENT:
            return <li>Single item: {props.content}</li>;
        case ListItemType.GROUP:
            return <EventGroup members={props.groupContent}/>
        default:
            throw new Error("no");
    }
}



export function GroupAndMoveDemo() {
    const [state, dispatch] = useReducer(reduceEventList, []);
    const [sourcePosition, setSourcePosition] = useState<number>(0);
    const [targetPosition, setTargetPosition] = useState<number>(0);
    const [firstItemToConnect, setFirstItemToConnect] = useState<number>(0);

    const handleTargetPositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTargetPosition(parseInt(e.target.value));
    };

    const handleSourcePositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSourcePosition(parseInt(e.target.value));
    };

    const handleFirstItemToConnectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFirstItemToConnect(parseInt(e.target.value));
    };

    return (
        <div>
          <h1>My Component</h1>

          <h2>Values</h2>

          <p>Count: {state.length}</p>

          <ol>
            {state.map(x => <EventItem key={x.id} {...x}/>)}
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

          <div>
            <label>First item
              <input type="number"
                     value={firstItemToConnect}
                     onChange={handleFirstItemToConnectChange}/>
            </label>
            <button onClick={() => dispatch({type: ActionType.CONNECT_TO_ADJACENT_ITEM, firstItem: firstItemToConnect})}>Connect to adjacent item</button>
          </div>

        </div>
    );
}

