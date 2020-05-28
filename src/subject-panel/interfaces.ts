export interface SubjectPanelFilter {
    name: string;
    key: string;
    data: {[key: string]: any}[]
}

export interface FieldChange {
    name: string;
    value: any;
}

export interface FilterConfiguration {
    targetField: string;
    filters: SubjectPanelFilter[];
}

// Used in the toplevel, this defines what we actually have data on
export interface SubjectPanelData {
    byDate: {[key: string]: any}[],
    byPilot: {[key: string]: any}[]
}
