import {FilterConfiguration} from './interfaces';

function transform(targetField: string, item: SubjectPanelFilter) {
    const result = {};
    
    for (let x of item.data) {
        result[x[item.key]] = x[targetField];
    }

    return result;
}

export function buildIndex(input: FilterConfiguration) {
    const result = {};

    for (let item of input.filters) {
        result[item.name] = {...item, data: transform(input.targetField, item)};
    }

    return result;
}
