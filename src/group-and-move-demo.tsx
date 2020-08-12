import React, {useReducer, useState} from 'react';
import {cloneDeep} from 'lodash';
import uuidv4 from 'uuid/v4';
import './group-and-move-demo.css';

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

function GroupMember(props: {x: EventContent}) {
    return (
        <div className="event-group-member">
          {props.x}
        </div>
    )
}

type SplitHandler = (groupOffset: number) => void;

function EventGroup(props: {members: EventContent[], onSplit: SplitHandler}) {
    const lastIndex = props.members.length - 1;

    return (
        <div className="event-group">
          Group of {props.members.length} items, contents:
          {
              props.members.map((x, i) => {
                  return (
                      <div key={i}>  {/* not sure if key here is right! */}
                        <GroupMember x={x}/>
                        {i < lastIndex && <button onClick={() => props.onSplit(i + 1)}>Split</button>}
                      </div>
                  );
              })
          }
        </div>
    );

}

function EventItemInList(
    props: {
        item: EventItem,
        index: number,
        onSplit: SplitHandler
    })
{
    const listPosition = props.index + 1;

    switch (props.item.type) {
        case ListItemType.SINGLE_EVENT:
            return <div className="top-level-event-list-item">{listPosition}. Single item: {props.item.content}</div>;
        case ListItemType.GROUP:
            return <EventGroup onSplit={props.onSplit} members={props.item.groupContent}/>
        default:
            throw new Error("no");
    }
}

function ConnectButton(
    props: {onClick: (event: React.MouseEvent<HTMLButtonElement> ) => void}
) {

    return (
        <div>
          <button onClick={props.onClick}>Connect</button>
        </div>
    );
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

    const lastIndex = state.length - 1;
//
    return (
        <div>
          <h1>My Component</h1>

          <h2>Values</h2>

          <p>Count: {state.length}</p>

          <div>
            {
                state.map((x, i) => {
                    const handleSplit: SplitHandler = (groupOffset) => {
                        console.log("requested at %o", groupOffset);
                         dispatch(
                              {
                                  type: ActionType.SPLIT_GROUP_AT_INDEX,
                                  itemIndex: i,
                                  groupOffset
                              })
                    };


                    return (
                    <div key={x.id}>
                      <EventItemInList key={x.id}
                                       index={i} 
                                       item={x}
                                       onSplit={handleSplit}/>
                      {i < lastIndex && <ConnectButton onClick={() => dispatch({type: ActionType.CONNECT_TO_ADJACENT_ITEM, firstItem: i})}/>}
                    </div>
                    )
                })
            }
          </div>

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

