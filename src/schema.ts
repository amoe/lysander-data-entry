export enum Entity {
    PERSON = 'person'
};

export interface FieldSpecification {
    label: string;
    fieldName: string;
}

interface EntitySchema {
    [key: string]: FieldSpecification[]
};



export const SCHEMA: EntitySchema = {
    [Entity.PERSON]: [
        {label: 'Person', fieldName: 'person'},
        {label: 'Forename', fieldName: 'forename'},
        {label: 'Date', fieldName: 'date'},
        {label: 'Time', fieldName: 'time'},
        {label: 'Event', fieldName: 'event'},
        {label: 'Status', fieldName: 'status'},

        // change the fieldname of these, query with alex
        {label: 'Method/Role', fieldName: 'methodOrRole'},
        {label: 'By/For (Person/Object)', fieldName: 'byForPersonObject'},
        {label: 'Op/Org/Circuit', fieldName: 'opOrgCircuit'},
        {label: 'Quotes/MediaRef', fieldName: 'quotesMediaRef'},

        {label: 'Location', fieldName: 'location'},
        {label: 'Source', fieldName: 'source'},
        {label: 'Note', fieldName: 'note'},
        {label: 'AssociatedWith', fieldName: 'association'}
    ]
}
