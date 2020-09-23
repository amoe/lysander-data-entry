import {PartialDate} from '../partial-date';

export enum ListItemType {
    SINGLE_EVENT = 'singleEvent',
    GROUP = 'group'
}

export enum DraggableType {
    LIST_ITEM = 'listItem',
    GROUP_ITEM = 'groupItem'
}

export interface DragObject {
    type: DraggableType,
    id: string   // or whatever is used as id property of EventItem
}



// Separated into two because the tracking data is generated, rest is
// user-entered.

export interface EventInfo {
    description: string;
}

export interface EventTrackingData {
    date: PartialDate | undefined;

    // These ALSO need a key, as well as the event container itself, as they must
    // be rendered as group children.
    id: string;
}

export type EventContent = EventInfo & EventTrackingData;






export type EventItem = 
    {type: ListItemType.SINGLE_EVENT, content: EventContent, id: string}
    | {type: ListItemType.GROUP, groupContent: EventContent[], id: string};
export type EventList = Array<EventItem>;

export interface PageState {
    eventList: EventList;
    canMoveValue: boolean;
}

export enum ActionType {
    ADD_ITEM = 'addItem',
    MOVE_ITEM = 'moveItem',
    MOVE_BY_ID = 'moveById',
    CONNECT_TO_ADJACENT_ITEM = 'connectToAdjacentItem',
    SPLIT_GROUP_AT_INDEX = 'splitGroupAtIndex',
    MOVE_EVENT_WITHIN_GROUP = 'moveEventWithinGroup',
    MOVE_EVENT_WITHIN_GROUP_BY_ID = 'moveEventWithinGroupById',
    SET_CAN_MOVE_VALUE = 'setCanMoveValue',
    ADD_ITEM_WITH_UNDEFINED_DATE = 'addItemWithUndefinedDate'
};

export type Action = 
    {type: ActionType.ADD_ITEM, content: EventContent}
    | {type: ActionType.MOVE_ITEM, sourcePosition: number, targetPosition: number}
    | {type: ActionType.MOVE_BY_ID, sourceId: string, targetId: string}
    | {type: ActionType.CONNECT_TO_ADJACENT_ITEM, firstItem: number}
    | {type: ActionType.SPLIT_GROUP_AT_INDEX, itemIndex: number, groupOffset: number}
    | {type: ActionType.MOVE_EVENT_WITHIN_GROUP, itemIndex: number, sourceGroupOffset: number, targetGroupOffset: number}
    | {type: ActionType.MOVE_EVENT_WITHIN_GROUP_BY_ID, groupId: string, sourceId: string, targetId: string}
    | {type: ActionType.SET_CAN_MOVE_VALUE, newValue: boolean}
    | {type: ActionType.ADD_ITEM_WITH_UNDEFINED_DATE};

export type SplitHandler = (groupOffset: number) => void;

// Stupid hack to make webpack reload the interfaces properly
export const INTERFACES_FILE_VERSION = 1;
