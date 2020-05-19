import {EventSequence, FlightEvent} from './event-sequence';
import {PartialDate} from './partial-date';

it('works', () => {
    const seq = new EventSequence();
    const e1 = new FlightEvent('financial crisis', new PartialDate(2008));
    seq.addEvent(e1);
    expect(seq.size()).toBe(1);
});


