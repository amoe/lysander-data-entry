// An eventsequence exposes a more restricted api than an array.

import {PartialDate} from './partial-date';

interface SequenceMember {
    getDescription(): string;
}

export class FlightEvent implements SequenceMember {
    private description: string;
    private date: PartialDate;

    constructor(description: string, date: PartialDate) {
        this.description = description;
        this.date = date;
    }

    getDescription() {
        return this.description;
    }
}

export class EventGroup implements SequenceMember {
    private contents: FlightEvent[];
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