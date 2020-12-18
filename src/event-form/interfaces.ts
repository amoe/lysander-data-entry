import {DateInputs} from '../date-authoring-component';
import {UserFacingTimeOffset} from '../core/time-offset';

// Anemic because it's not the full PartialDate, which is a class with
// methods on it rather than a JS object.
export interface AnemicPartialDate {
    year: number;
    month: number;
    day: number;
}

export interface Event {
    uuid: string;
    description: string;
    date: AnemicPartialDate;
}

export interface PlaneSortie {
    name: string;
}

export interface InSequenceRelationship {
    position: number;
    Event: Event;
}

export interface EventSequence {
    name: string;
    uuid: string;
    events: InSequenceRelationship[];
    planeSortie: PlaneSortie
}

export enum DraggableType {
    LIST_ITEM = 'listItem',
}

export interface DragObject {
    type: DraggableType,
    id: string
}

// React-side...
export interface EventInputDetails {
    description: string;
    timeOffset: UserFacingTimeOffset;
}

