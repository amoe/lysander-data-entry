// Redux types

export interface MyState {
    counter: number;
}

export interface FullStateTree {
    app: MyState;
    keplerGl?: any;
}

export const INCREMENT = 'INCREMENT';

// A type is mandatory, but we don't need any other info
export interface IncrementAction {
    type: typeof INCREMENT
}




// Domain types

export interface SourceRow {
    datum: TilletDatum;
    id: string;
}

export interface TilletDatum {
    record_id: number;
    date: string;
    landing_zone: string[],
    references: string[],
    passengers_out: string[],
    operation: string[],
    squadron: string[]
}

export interface AggregatedForm {
    date: Date,
    codenames: OperationCodename[],
    persons: Person[],
    locations: Location[]
    extraEvents: ExtraEvent[]
}

export interface Location {
    content: string;
}

export enum Role {
    Agent = "agent",
    Pilot = "pilot"
}


export interface Alias {
    name: string;
}

export interface Person {
    name: string;
    role: Role | null;
    aliases: Alias[]
}

// Really it should just be a string, but Vue wants an object.
export interface OperationCodename {
    content: string;
};

export interface ExtraEvent {
    content: string;
}

export interface ModelInsertSpec {
    cypherId: string;
    queryParameters: object;
}

export type ModelInsert = ModelInsertSpec[]

export type IdGenerator = () => string;

export interface RootState {
}


export interface LysanderState {
    counter: number;
    formData: AggregatedForm;
    sourceRowListIndex: number;
    sourceRows: SourceRow[];
    selectedSource: string;
};

// Stupid hack to make webpack reload the interfaces properly
export const INTERFACES_FILE_VERSION = 1;
