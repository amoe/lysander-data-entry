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

// MUTATES ITS ARGUMENT
export function arrayMove<T>(arr: T[], fromIndex: number, toIndex: number): void {
    if (typeof arr[fromIndex] === 'undefined') {
        throw new Error("invalid fromIndex in move");
    }

    if (typeof arr[toIndex] === 'undefined') {
        throw new Error("invalid toIndex in move");
    }
    
    const element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
}

