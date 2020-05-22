export enum EventTheme {
    PERSON = 'person',
    ORGANIZATION = 'organization',
    FLIGHT = 'flight'
};

export interface FieldSpecification {
    label: string;
    fieldName: string;
}

interface EntitySchema {
    [key: string]: FieldSpecification[]
};


const commonFields = [
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
        {label: 'AssociatedWith', fieldName: 'associatedWith'},
        {label: 'Association', fieldName: 'association'}
];

export const SCHEMA: EntitySchema = {
    [EventTheme.PERSON]: [
        {label: 'Person', fieldName: 'person'},
        {label: 'Forename', fieldName: 'forename'},
        ...commonFields
    ],
    [EventTheme.ORGANIZATION]: [
        {label: 'Organization', fieldName: 'organization'},
        ...commonFields
    ],
    [EventTheme.FLIGHT]: [
        {label: 'SuperEvent: AirSortie', fieldName: 'superEvent'},
        {label: 'Pilot', fieldName: 'pilot'},
        ...commonFields,
        {label: 'Relative Loc', fieldName: 'relativeLoc'},
        {label: 'Distance', fieldName: 'distance'},
        {label: 'Metric', fieldName: 'metric'},
        {label: 'Height/Distance/Range', fieldName: 'heightDistanceRange'},
        {label: '< / >', fieldName: 'locationRelation'},
    ]
}



//organisation		Date	Time	event	Status	method/role	by/for (Person/object)	Op/Org/Circuit	Location (Name)	Source	Notes	Quotes/MediaRef	AssociatedWith	Association


