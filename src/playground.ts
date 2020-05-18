interface SingleEvent {
    date: string;
    description: string;
}

type EventGroup = SingleEvent[];

type SequenceMember = SingleEvent | EventGroup;

type EventSequence = SequenceMember[]

export function meaningOfLife() { return 42; }


