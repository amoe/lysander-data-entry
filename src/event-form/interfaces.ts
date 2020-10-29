interface PartialTime {
    hour: number;
    minute: number;
}

export interface Event {
    uuid: string;
    description: string;
    time: PartialTime;
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
    hour: number;
    minute: number;
}
