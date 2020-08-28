import {MaybeDateCollection, MaybePartialDate} from './maybe-date-collection';
import {PartialDate} from './partial-date';

it('restricts reordering as expected', () => {
    const ordering: MaybePartialDate[] = [
        undefined,                                                 // 0
        new PartialDate({year: 1939}),                             // 1
        new PartialDate({year: 1939, monthIndex: 2}),              // 2
        undefined,                                                 // 3
        new PartialDate({year: 1939, monthIndex: 11, day: 20}),    // 4
        new PartialDate({year: 1940}),                             // 5
        undefined                                                  // 6
    ];

    const coll = MaybeDateCollection.fromArray(ordering);

    expect(coll.canMove(4, 5)).toBe(false);
    expect(coll.canMove(4, 2)).toBe(false);

    // Self-swap is true by definition
    expect(coll.canMove(4, 4)).toBe(true);


    // Should not be possible because (2, 1) is impossible.
    expect(coll.canMove(4, 1)).toBe(false);


    // Undefined moves should be unrestricted
    expect(coll.canMove(0, 0)).toBe(true);
    expect(coll.canMove(3, 2)).toBe(true);
    expect(coll.canMove(3, 4)).toBe(true);
    expect(coll.canMove(3, 4)).toBe(true);
    expect(coll.canMove(3, 6)).toBe(true);
    expect(coll.canMove(3, 0)).toBe(true);
});


