// An eventsequence exposes a more restricted api than an array.
import {PartialDate} from './partial-date';
import {uniqueId, isEqual} from 'lodash';

const SEQUENCE_PREFIX = 'sequenceMember_';

export interface SequenceMember {
    getDescription(): string;
    getId(): string;
}

export class FlightEvent implements SequenceMember {
    private description: string;
    private date: PartialDate;
    private id: string;

    constructor(description: string, date: PartialDate) {
        this.description = description;
        this.date = date;
        this.id = uniqueId(SEQUENCE_PREFIX);
    }

    getId() {
        return this.id;
    }

    getDescription() {
        return this.description;
    }

    getDateString(): string {
        return this.date.toString();
    }
}

export class EventGroup implements SequenceMember {
    private contents: FlightEvent[];
    private id: string;

    constructor(e1: FlightEvent, e2: FlightEvent) {
        this.contents = [e1, e2];
        this.id = uniqueId(SEQUENCE_PREFIX);
    }

    getId() {
        return this.id;
    }

    
    getDescription(): string {
        throw new Error("cannot call getdescription on event group");
    }

    
    map<T>(f: (x: FlightEvent, i?: number) => T): T[] {
        return this.contents.map(f);
    }
}

function typeIdentifier(x: SequenceMember): string {
    if (x instanceof FlightEvent) {
        return 'FE';
    } else if (x instanceof EventGroup) {
        return 'EG';
    } else {
        throw new Error("no");
    }
}


export class EventSequence {
    private contents: SequenceMember[];

    constructor() {
        this.contents = [];
    }

    link(index1: number, index2: number) {

        const e1 = this.contents[index1];
        const e2 = this.contents[index2];

        if (e1 === undefined || e2 === undefined) {
            throw new Error("attempt to group nonexistent indices");
        }

        const typeConfiguration = [typeIdentifier(e1), typeIdentifier(e2)];

        if (isEqual(typeConfiguration, ['FE', 'FE'])) {
            // Both indexes removed.  Group created and inserted at index1.
            const newGroup = new EventGroup(e1 as FlightEvent, e2 as FlightEvent);
            this.contents.splice(index1, 2, newGroup);
        } else if (isEqual(typeConfiguration, ['FE', 'EG'])) {
            // Group at index2 absorbs index1.
            throw new Error("not implemented");
        } else if (isEqual(typeConfiguration, ['EG', 'FE'])) {
            // Group at index1 absorbs index2.
            throw new Error("not implemented");
        } else if (isEqual(typeConfiguration, ['EG', 'EG'])) {
            // First group absorbs second group.
            throw new Error("not implemented");
        }
    }

    addEvent(e: FlightEvent) {
        this.contents.push(e);
    }

    size(): number {
        return this.contents.length;
    }

    isEmpty(): boolean {
        return this.size() === 0;
    }

    map(f: (x: SequenceMember, i?: number) => any): any[] {
        return this.contents.map(f);
    }
};
