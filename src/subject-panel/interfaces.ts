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
