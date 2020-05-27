interface SubjectPanelFilter {
    name: string;
    key: string;
    data: {[key: string]: any}[]
}

interface FieldChange {
    name: string;
    value: any;
}

interface FilterConfiguration {
    targetField: string;
    filters: SubjectPanelFilter[];
}
