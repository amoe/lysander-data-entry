import {EntityCache, EventDatum} from './interfaces2';
import {SubjectPanelData} from './subject-panel/interfaces';

interface AppState {
    allEvents: EventDatum[];
    entityCache: EntityCache;
    subjectPanelData: SubjectPanelData;
}

export enum ActionType {
    ADD_EVENT = 'addEvent',
    SET_ENTITY_CACHE = 'setEntityCache',
    SET_SUBJECT_PANEL_DATA = 'setSubjectPanelData'
};


type Action = {type: ActionType.ADD_EVENT, event: any}
    | {type: ActionType.SET_ENTITY_CACHE, entityType: string, payload: any}
    | {type: ActionType.SET_SUBJECT_PANEL_DATA, key: string, payload: {[key: string]: any}[]}

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
        case ActionType.SET_SUBJECT_PANEL_DATA:
            return {
                ...state,
                subjectPanelData: {
                    ...state.subjectPanelData,
                    [action.key]: action.payload
                }
            };
        default:
            throw new Error("no");
    }
}
