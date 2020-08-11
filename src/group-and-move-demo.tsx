import React, {useReducer, useState} from 'react';
import {cloneDeep} from 'lodash';
import uuidv4 from 'uuid/v4';

// You can only split a group.  That means that splitting requires two parameters:
// index within the EventList and index within the group.  If it is not a group,
// an error should be thrown.

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
    CONNECT_TO_ADJACENT_ITEM = 'connectToAdjacentItem',
    SPLIT_GROUP_AT_INDEX = 'splitGroupAtIndex'
};


type Action = 
  {type: ActionType.ADD_ITEM, content: EventContent}
  | {type: ActionType.MOVE_ITEM, sourcePosition: number, targetPosition: number}
  | {type: ActionType.CONNECT_TO_ADJACENT_ITEM, firstItem: number}
  | {type: ActionType.SPLIT_GROUP_AT_INDEX, itemIndex: number, groupOffset: number};

function contentAsArray(item: EventItem): EventContent[] {
    switch (item.type) {
        case ListItemType.SINGLE_EVENT:
            return [item.content];
        case ListItemType.GROUP:
            return item.groupContent;
        default:
            throw new Error("no");
    }
}


function splitGroupAtIndex(state: EventList, itemIndex: number, groupOffset: number) {
    const group = state[itemIndex];
    if (group.type !== ListItemType.GROUP) {
        throw new Error("cannot split a non group");
    }

    const currentContent = group.groupContent;


    // For a  group of 2 items.
    // If we split at offset 0, it's invalid, and would remain the same.
    // If we split at offset 1, we split the group in half.
    // If we split at offset 2, it's invalid and would remain the same.

    // For a group of 3 items:
    // offset 0 = invalid
    // offset 1 = 1 single item, 1 group of 2
    // offset 2 = 1 group of 2, 1 single item
    // offset 3 = invalid

    if (groupOffset <= 0) {
        throw new Error("invalid split attempt: index is too low");
    }

    if (groupOffset >= currentContent.length) {
        throw new Error("invalid split attempt: index is too high");
    }

    const fore = [];
    const aft = [];

    for (var i = 0; i < currentContent.length; i++) {
        const item = currentContent[i];

        if (i < groupOffset) {
            fore.push(item);
        } else {
            aft.push(item);
        }
    }

    var foreItem: EventItem;
    if (fore.length === 1) {
        foreItem = {
            type: ListItemType.SINGLE_EVENT,
            content: fore[0],
            id: uuidv4()    // again not sure this is right
        };
    } else {
        foreItem = {
            type: ListItemType.GROUP,
            groupContent: fore,
            id: group.id    // keep id of original group for first
        }
    }

    var aftItem: EventItem;
    if (aft.length === 1) {
        aftItem = {
            type: ListItemType.SINGLE_EVENT,
            content: aft[0],
            id: uuidv4()    // XXX, same issue as before
        };
    } else {
        aftItem = {
            type: ListItemType.GROUP,
            groupContent: aft,
            id: uuidv4()    // always gen a new id for the second list
        }
    }

    state.splice(itemIndex, 1, foreItem, aftItem);
    return state;
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
        case ActionType.SPLIT_GROUP_AT_INDEX:
            return splitGroupAtIndex(cloneDeep(state), action.itemIndex, action.groupOffset);
        default:
            throw new Error("no");
    }
}

function EventGroup(props: {members: EventContent[]}) {
    return <li>
      Group of {props.members.length} items: contents {props.members.map((x, i) => <cite>[{x}]</cite>)}
    </li>;
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

    const [splitItemIndex, setSplitItemIndex] = useState<number>(0);
    const [splitGroupOffset, setSplitGroupOffset] = useState<number>(0);

    const handleTargetPositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTargetPosition(parseInt(e.target.value));
    };

    const handleSourcePositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSourcePosition(parseInt(e.target.value));
    };

    const handleFirstItemToConnectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFirstItemToConnect(parseInt(e.target.value));
    };

    const handleSplitItemIndexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSplitItemIndex(parseInt(e.target.value));
    };

    const handleSplitGroupOffsetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSplitGroupOffset(parseInt(e.target.value));
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

          <div>
            <label>Item index
              <input type="number"
                     value={splitItemIndex} onChange={handleSplitItemIndexChange}/>
            </label>

            <label>Group offset
              <input type="number"
                     value={splitGroupOffset} onChange={handleSplitGroupOffsetChange}/>
            </label>

            <button onClick={() => dispatch({type: ActionType.SPLIT_GROUP_AT_INDEX, itemIndex: splitItemIndex, groupOffset: splitGroupOffset})}>Split group</button>
          </div>
        </div>
    );
}

