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
}
