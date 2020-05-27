import {SubjectPanelFilter, FilterConfiguration} from './interfaces';

function transform(targetField: string, item: SubjectPanelFilter) {
    const result = {} as {[key: string]: any};
    
    for (let x of item.data) {
        result[x[item.key]] = x[targetField];
    }

    return result;
}

export function buildIndex(input: FilterConfiguration) {
    const result = {} as {[key: string]: any};

    for (let item of input.filters) {
        result[item.name] = {...item, data: transform(input.targetField, item)};
    }

    return result;
}
