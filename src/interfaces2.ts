export enum ViewMode {
    VIEW = 'view',
    MOVE = 'move'
};

export type MoveHandler = (eventId: string) => void;

export interface EventBlob {
    [key: string]: any
};

export interface EntityCache {
    pilots: any;
    locations: any;
    operations: any;
}


export interface Pilot {
    clusterId: string;
    firstName: string[];
    lastName: string[];
}

export interface Location {
    id: string;
    code: string;
    description: string;
    codename: string;
}

export interface Operation {
    name: string;
}


export interface SubjectData {
    date: string | undefined;
    pilotName: string | undefined;
};
