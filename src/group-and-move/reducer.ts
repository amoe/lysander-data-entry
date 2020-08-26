import {cloneDeep} from 'lodash';
import uuidv4 from 'uuid/v4';
import {
    EventItem, EventContent, EventList, Action, ActionType, ListItemType,
    PageState
} from './interfaces';
import {arrayMove} from '../utility';

// You can only split a group.  That means that splitting requires two parameters:
// index within the EventList and index within the group.  If it is not a group,
// an error should be thrown.

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

function moveEventWithinGroupById(
    oldState: EventList, groupId: string, sourceId: string, targetId: string
) {
    console.log("inside mwgbi handler");

    const newState = cloneDeep(oldState);

    const groupIndex = oldState.findIndex(x => x.id === groupId);
    if (groupIndex === -1) throw new Error("bad group");


    const newGroup = newState[groupIndex];
    if (newGroup.type !== ListItemType.GROUP) {
        throw new Error("will not work");
    }

    const oldGroup = oldState[groupIndex];
    if (oldGroup.type !== ListItemType.GROUP) {
        throw new Error("will not work");
    }


    const sourceGroupOffset = oldGroup.groupContent.findIndex(x => x.id === sourceId);
    const targetGroupOffset = oldGroup.groupContent.findIndex(x => x.id === targetId);
    if (sourceGroupOffset === -1) throw new Error("bad source");
    if (targetGroupOffset === -1) throw new Error("bad source");
    

    const content = newGroup.groupContent;

    arrayMove(content, sourceGroupOffset, targetGroupOffset);

    // content[targetGroupOffset] = oldGroup.groupContent[sourceGroupOffset];
    // content[sourceGroupOffset] = oldGroup.groupContent[targetGroupOffset];
    
    return newState;
}

function moveById(state: EventList, sourceId: string, targetId: string) {
    const newState = cloneDeep(state);
    const sourcePosition = state.findIndex(x => x.id === sourceId);
    const targetPosition = state.findIndex(x => x.id === targetId);
    if (sourcePosition === -1) throw new Error("bad source");
    if (targetPosition === -1) throw new Error("bad source");

    newState[targetPosition] = state[sourcePosition];
    newState[sourcePosition] = state[targetPosition];

    return newState;
}

export function reduceEventList(state: PageState, action: Action): PageState {
    const newState = cloneDeep(state.eventList);

    // Nearly all functions preserve the canmovevalue, so use this helper
    // probably similar to state slices in redux
    const val = (l: EventList): PageState  => {
        return {canMoveValue: state.canMoveValue, eventList: l};
    }

    switch (action.type) {
        case ActionType.ADD_ITEM:
            return val([...newState,
                    {type: ListItemType.SINGLE_EVENT, content: action.content, id: uuidv4()}
                       ]);
        case ActionType.MOVE_ITEM:
            // XXX: error handling
            const removed = newState.splice(action.sourcePosition, 1)[0];
            newState.splice(action.targetPosition, 0, removed);
            return val(newState);
        case ActionType.MOVE_BY_ID:
            return val(moveById(state.eventList, action.sourceId, action.targetId));
        case ActionType.CONNECT_TO_ADJACENT_ITEM:
            return val(connectToAdjacentItem(cloneDeep(state.eventList), action.firstItem));
        case ActionType.SPLIT_GROUP_AT_INDEX:
            return val(splitGroupAtIndex(cloneDeep(state.eventList), action.itemIndex, action.groupOffset));
        case ActionType.MOVE_EVENT_WITHIN_GROUP:
            const {itemIndex, sourceGroupOffset, targetGroupOffset} = action;

            const newGroup = newState[itemIndex];
            if (newGroup.type !== ListItemType.GROUP) {
                throw new Error("will not work");
            }

            const oldGroup = state.eventList[itemIndex];
            if (oldGroup.type !== ListItemType.GROUP) {
                throw new Error("will not work");
            }

            const content = newGroup.groupContent;
            content[targetGroupOffset] = oldGroup.groupContent[sourceGroupOffset];
            content[sourceGroupOffset] = oldGroup.groupContent[targetGroupOffset];

            return val(newState);
        case ActionType.MOVE_EVENT_WITHIN_GROUP_BY_ID:
            return val(moveEventWithinGroupById(
                state.eventList, action.groupId, action.sourceId, action.targetId
            ));
        case ActionType.SET_CAN_MOVE_VALUE:
            return {canMoveValue: action.newValue, eventList: state.eventList}
        default:
            throw new Error("no");
    }
}
