import {SingleEvent, EventSequence} from './playground';

it('accepts multiple types of sequence', () => {
    expect(2 + 2).toBe(4);
    const e1: SingleEvent = {date: '2020-01-01', description: 'start of year'};
    const e2: SingleEvent = {date: '2020-02-05', description: 'trump acquitted'};
    const e3: SingleEvent = {date: '2020-03-08', description: 'italian quarantine begins'};
    const e4: SingleEvent = {date: '2020-04-18', description: 'nova scotia killing spree'};

    // Empty sequence is valid
    const seq1: EventSequence = [];
    const seq2: EventSequence = [e1];
    const seq3: EventSequence = [e1, e2];
    const seq4: EventSequence = [e1, [e3, e4]];


    // XXX: Degenerate cases, it's not clear that these makes sense
    const seq5: EventSequence = [e1, [e2]];
    const seq6: EventSequence = [e1, []];
});

