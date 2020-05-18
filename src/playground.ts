interface SingleEvent {
    date: string;
    description: string;
}

type EventGroup = SingleEvent[];

type SequenceMember = SingleEvent | EventGroup;


