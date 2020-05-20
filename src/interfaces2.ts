export enum ViewMode {
    VIEW = 'view',
    MOVE = 'move'
};

export type MoveHandler = (eventId: string) => void;
