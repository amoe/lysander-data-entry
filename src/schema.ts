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
        {label: 'Status', fieldName: 'status'},

        // change the fieldname of these, query with alex
        {label: 'Method/Role', fieldName: 'methodOrRole'},
        {label: 'By/For (Person/Object)', fieldName: 'byForPersonObject'},
        {label: 'Op/Org/Circuit', fieldName: 'opOrgCircuit'},
        {label: 'Quotes/MediaRef', fieldName: 'quotesMediaRef'},

        {label: 'Location', fieldName: 'location'},
        {label: 'Source', fieldName: 'source'},
        {label: 'Note', fieldName: 'note'},
];

export const SCHEMA: EntitySchema = {
    [EventTheme.PERSON]: [
        {label: 'Person', fieldName: 'person'},
        {label: 'Forename', fieldName: 'forename'},
        {label: 'Event', fieldName: 'event'},
        ...commonFields
    ],
    [EventTheme.ORGANIZATION]: [
        {label: 'Organization', fieldName: 'organization'},
        {label: 'Event', fieldName: 'event'},
        ...commonFields
    ],
    [EventTheme.FLIGHT]: [
        {label: 'SuperEvent: AirSortie', fieldName: 'superEvent'},
        {label: 'Pilot', fieldName: 'pilot'},
        {label: 'Event', fieldName: 'event'},
        ...commonFields,
        {label: 'Relative Loc', fieldName: 'relativeLoc'},
        {label: 'Distance', fieldName: 'distance'},
        {label: 'Metric', fieldName: 'metric'},
        {label: 'Height/Distance/Range', fieldName: 'heightDistanceRange'},
        {label: '< / >', fieldName: 'locationRelation'},
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
