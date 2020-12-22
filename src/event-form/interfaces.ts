import {DateInputs} from '../date-authoring-component';
import {UserFacingTimeOffset} from '../core/time-offset';


export enum CardinalPoint {
    NORTH,
    EAST,
    SOUTH,
    WEST
}

export interface Location {
    id: string;
    codename: string;
    description: string;
    latitude: number;
    longitude: number;
}

export interface RelativePosition {
    height: number;
    distance: number;
    cardinal: CardinalPoint;
    location: Location;
}

export interface Event {
    uuid: string;
    description: string;
    offset: number;   // time offset -- should probably be renamed
    position: RelativePosition;
}

export interface Sortie {
    nightOf: string;
}

export interface PlaneSortie {
    name: string;
    sortie: Sortie;
}

export interface InSequenceRelationship {
    position: number;
    Event: Event;
}

export interface EventSequence {
    name: string;
    uuid: string;
    events: InSequenceRelationship[];
    planeSortie: PlaneSortie | null;
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
    reference: string;
    quotation: string;
    notes: string;
}

