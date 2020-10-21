import {DateInputs} from '../date-authoring-component';

export interface Event {
    uuid: string;
    description: string;
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

export interface EventInputDetails {
    description: string;
    date: DateInputs;
}
