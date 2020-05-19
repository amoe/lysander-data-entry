// An eventsequence exposes a more restricted api than an array.

import {PartialDate} from './partial-date';

interface SequenceMember {
}

class FlightEvent implements SequenceMember {
    private description: string;
    private date: PartialDate;
}

class EventGroup implements SequenceMember {
    private contents: FlightEvent[];
}


export class EventSequence {
    private contents: SequenceMember[];

    constructor() {
    }

    addEvent(e: FlightEvent) {
    }
};
