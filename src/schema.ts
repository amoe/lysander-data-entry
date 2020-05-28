export enum EventTheme {
    PERSON = 'person',
    ORGANIZATION = 'organization',
    FLIGHT = 'flight'
};

enum FieldType {
    INPUT = 'input',
    SELECT = 'select'
}

export interface FieldSpecification {
    label: string;
    fieldName: string;
    fieldType: FieldType;
}

interface EntitySchema {
    [key: string]: FieldSpecification[]
};


const commonFields = [
        {label: 'Date', fieldName: 'date', fieldType: FieldType.INPUT},
        {label: 'Time', fieldName: 'time', fieldType: FieldType.INPUT},
        {label: 'Status', fieldName: 'status', fieldType: FieldType.INPUT},

        // change the fieldname of these, query with alex
        {label: 'Method/Role', fieldName: 'methodOrRole', fieldType: FieldType.INPUT},
        {label: 'By/For (Person/Object)', fieldName: 'byForPersonObject', fieldType: FieldType.INPUT},
        {label: 'Op/Org/Circuit', fieldName: 'opOrgCircuit', fieldType: FieldType.INPUT},
        {label: 'Quotes/MediaRef', fieldName: 'quotesMediaRef', fieldType: FieldType.INPUT},

        {label: 'Location', fieldName: 'location', fieldType: FieldType.INPUT},
        {label: 'Source', fieldName: 'source', fieldType: FieldType.INPUT},
        {label: 'Note', fieldName: 'note', fieldType: FieldType.INPUT},
];

export const SCHEMA: EntitySchema = {
    [EventTheme.PERSON]: [
        {label: 'Person', fieldName: 'person', fieldType: FieldType.INPUT},
        {label: 'Forename', fieldName: 'forename', fieldType: FieldType.INPUT},
        {label: 'Event', fieldName: 'event', fieldType: FieldType.INPUT},
        ...commonFields
    ],
    [EventTheme.ORGANIZATION]: [
        {label: 'Organization', fieldName: 'organization', fieldType: FieldType.INPUT},
        {label: 'Event', fieldName: 'event', fieldType: FieldType.INPUT},
        ...commonFields
    ],
    [EventTheme.FLIGHT]: [
        {label: 'SuperEvent: AirSortie', fieldName: 'superEvent', fieldType: FieldType.INPUT},
        {label: 'Pilot', fieldName: 'pilot', fieldType: FieldType.INPUT},
        {label: 'Event', fieldName: 'event', fieldType: FieldType.INPUT},
        ...commonFields,
        {label: 'Relative Loc', fieldName: 'relativeLoc', fieldType: FieldType.INPUT},
        {label: 'Distance', fieldName: 'distance', fieldType: FieldType.INPUT},
        {label: 'Metric', fieldName: 'metric', fieldType: FieldType.INPUT},
        {label: 'Height/Distance/Range', fieldName: 'heightDistanceRange', fieldType: FieldType.INPUT},
        {label: '< / >', fieldName: 'locationRelation', fieldType: FieldType.INPUT},
    ]
}

const SUBJECT_PANEL_FIELDS = {
    [EventTheme.FLIGHT]: [
        {fieldName: 'Date',
         searcher: 'dates'},
        {fieldName: 'Pilot Name',
         searcher: 'pilots'}
    ],
    [EventTheme.PERSON]: [
//        'Surname', 'Forename'
    ],
    [EventTheme.ORGANIZATION]: [
//        'Type', 'Name'
    ]
};



//organisation		Date	Time	event	Status	method/role	by/for (Person/object)	Op/Org/Circuit	Location (Name)	Source	Notes	Quotes/MediaRef	AssociatedWith	Association




const ALLOWED_EVENT_TYPE_FOR_FLIGHT = [
    'Operation commissioner',
    'Sortie arranged',
    'Sortie postponed',
    'Sortie arranged',
    'Person travels',
    'Take Off',
    'Over Coast',
    'Wayfinding Point',
    'Meteo',
    'Searchlight',
    'Enemy Encounter',
    'Evasive action',
    'Aircraft descends',
    'Rendezvous',
    'Target Area Arrive',
    'Target Area Visibility',
    'Lights seen',
    'Seek lights',
    'Wayfinding Point',
    'Seek lights',
    'Lights seen',
    'Pilot Signal',
    'Ground Signal',
    'LZ Landing',
    'Impeded',
    'Pilot leaves plane',
    'Observed',
    'LZ Take Off',
    'Return Landing',
    'Debrief'
];
