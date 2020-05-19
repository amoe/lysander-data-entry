// An eventsequence exposes a more restricted api than an array.
import {PartialDate} from './partial-date';
import {uniqueId} from 'lodash';

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

}


export class EventSequence {
    private contents: SequenceMember[];

    constructor() {
        this.contents = [];
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

    map(f: (x: SequenceMember) => any): any[] {
        return this.contents.map(f);
    }
};
