

export function identity(x: any) { 
    return x;
}

export function strictFindIndex<T>(sequence: T[], predicate: (value: T) => boolean): number {
    const result = sequence.findIndex(predicate);

    if (result === -1) {
        throw new Error('index not found');
    }

    return result;
}
