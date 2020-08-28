import {MaybeDateCollection, MaybePartialDate} from './maybe-date-collection';
import {PartialDate} from './partial-date';

it('restricts reordering as expected', () => {
    const ordering: MaybePartialDate[] = [
        undefined,       nnnnn      
        new PartialDate({year: 1939}),
        new PartialDate({year: 1939, monthIndex: 2}),
        undefined,
        new PartialDate({year: 1939, monthIndex: 11, day: 20}),
        new PartialDate({year: 1940}),
        undefined
    ];

    const coll = MaybeDateCollection.fromArray(ordering);

    expect(coll.canMove(2, 3)).toBe(false);
    expect(coll.canMove(2, 1)).toBe(false);

    // Self-swap is true by definition
    expect(coll.canMove(2, 2)).toBe(true);


    // Should not be possible because (2, 1) is impossible.
    expect(coll.canMove(2, 0)).toBe(false);
});


