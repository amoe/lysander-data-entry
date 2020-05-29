const ALLOWED_EVENT_TYPE_FOR_FLIGHT = [
    'Operation commissioner',
    'Sortie arranged',
    'Sortie postponed',
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


export enum EventTheme {
    PERSON = 'person',
    ORGANIZATION = 'organization',
    FLIGHT = 'flight'
};

export enum FieldType {
    INPUT = 'input',
    SELECT = 'select'
}

export interface FieldSpecification {
    label: string;
    fieldName: string;
    typeSpec: {fieldType: FieldType.INPUT} | {fieldType: FieldType.SELECT, options: string[]}
}


interface EntitySchema {
    [key: string]: FieldSpecification[]
};


const commonFields: FieldSpecification[] = [
    {label: 'Date', fieldName: 'date', typeSpec: {fieldType: FieldType.INPUT}},
    {label: 'Time', fieldName: 'time', typeSpec: {fieldType: FieldType.INPUT}},
    {label: 'Status', fieldName: 'status', typeSpec: {fieldType: FieldType.INPUT}},
    {label: 'Method/Role', fieldName: 'methodOrRole', typeSpec: {fieldType: FieldType.INPUT}},
    {label: 'By/For (Person/Object)', fieldName: 'byForPersonObject', typeSpec: {fieldType: FieldType.INPUT}},
    {label: 'Op/Org/Circuit', fieldName: 'opOrgCircuit', typeSpec: {fieldType: FieldType.INPUT}},
    {label: 'Quotes/MediaRef', fieldName: 'quotesMediaRef', typeSpec: {fieldType: FieldType.INPUT}},
    {label: 'Location', fieldName: 'location', typeSpec: {fieldType: FieldType.INPUT}},
    {label: 'Source', fieldName: 'source', typeSpec: {fieldType: FieldType.INPUT}},
    {label: 'Note', fieldName: 'note', typeSpec: {fieldType: FieldType.INPUT}},
];

export const SCHEMA: EntitySchema = {
    [EventTheme.PERSON]: [
        {label: 'Person', fieldName: 'person', typeSpec: {fieldType: FieldType.INPUT}},
        {label: 'Forename', fieldName: 'forename', typeSpec: {fieldType: FieldType.INPUT}},
        {label: 'Event', fieldName: 'event', typeSpec: {fieldType: FieldType.INPUT}},
       ...commonFields
    ],
    [EventTheme.ORGANIZATION]: [
        {label: 'Organization', fieldName: 'organization', typeSpec: {fieldType: FieldType.INPUT}},
        {label: 'Event', fieldName: 'event', typeSpec: {fieldType: FieldType.INPUT}},
        ...commonFields
    ],
    [EventTheme.FLIGHT]: [
        {label: 'Pilot', fieldName: 'pilot', typeSpec: {fieldType: FieldType.INPUT}},
        {
            label: 'Event',
            fieldName: 'event',
            typeSpec: {
                fieldType: FieldType.SELECT,
                options: ALLOWED_EVENT_TYPE_FOR_FLIGHT
            }
        },
       ...commonFields,
        {label: 'Relative Loc', fieldName: 'relativeLoc', typeSpec: {fieldType: FieldType.INPUT}},
        {label: 'Distance', fieldName: 'distance', typeSpec: {fieldType: FieldType.INPUT}},
        {label: 'Metric', fieldName: 'metric', typeSpec: {fieldType: FieldType.INPUT}},
        {label: 'Height/Distance/Range', fieldName: 'heightDistanceRange', typeSpec: {fieldType: FieldType.INPUT}},
        {label: '< / >', fieldName: 'locationRelation', typeSpec: {fieldType: FieldType.INPUT}},
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




