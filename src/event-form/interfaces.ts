import {DateInputs} from '../date-authoring-component';
import {UserFacingTimeOffset} from '../core/time-offset';

export enum CardinalPoint {
    NORTH = 'NORTH',
    NORTH_NORTH_EAST = 'NORTH_NORTH_EAST',
    NORTH_EAST = 'NORTH_EAST',
    EAST_NORTH_EAST = 'EAST_NORTH_EAST',
    EAST = 'EAST',
    EAST_SOUTH_EAST = 'EAST_SOUTH_EAST',
    SOUTH_EAST = 'SOUTH_EAST',
    SOUTH_SOUTH_EAST = 'SOUTH_SOUTH_EAST',
    SOUTH = 'SOUTH',
    SOUTH_SOUTH_WEST = 'SOUTH_SOUTH_WEST',
    SOUTH_WEST = 'SOUTH_WEST',
    WEST_SOUTH_WEST = 'WEST_SOUTH_WEST',
    WEST = 'WEST',
    WEST_NORTH_WEST = 'WEST_NORTH_WEST',
    NORTH_WEST = 'NORTH_WEST',
    NORTH_NORTH_WEST = 'NORTH_NORTH_WEST',
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
    offset: number | null;
    position: RelativePosition | null;
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
    relativeDistance: number;
    relativeCardinal: CardinalPoint
    relativeHeight: number;
    locationId: string | undefined;    // location must start off undefined
}

