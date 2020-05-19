import {EventSequence} from './event-sequence';

it('works', () => {
    const seq = new EventSequence();

    seq.addEvent();

    expect(2 + 2).toBe(4);
});


