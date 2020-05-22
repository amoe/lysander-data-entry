import {EntityCache} from './interfaces2';

interface AppState {
    allEvents: any[];
    entityCache: EntityCache;
}

export enum ActionType {
    ADD_EVENT = 'addEvent',
    SET_ENTITY_CACHE = 'setEntityCache'
};


type Action = {type: ActionType.ADD_EVENT, event: any} | 
              {type: ActionType.SET_ENTITY_CACHE, entityType: string, payload: any};

export function reducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case ActionType.ADD_EVENT:
            return {...state, allEvents: [...state.allEvents, action.event]};
        case ActionType.SET_ENTITY_CACHE:
            return {
                ...state,
                entityCache: {
                    ...state.entityCache,
                    [action.entityType]: action.payload
                }
            }
        default:
            throw new Error("no");
    }
}
