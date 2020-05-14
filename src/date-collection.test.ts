import {DateCollection} from './date-collection';
import {PartialDate} from './partial-date';

it('works', () => {
    const ordering: PartialDate[] = [
        new PartialDate(1939),            // 0
        new PartialDate(1939, 1),         // 1
        new PartialDate(1939, 11, 20),    // 2
        new PartialDate(1940)             // 3
    ];

    const coll = DateCollection.fromArray(ordering);

    expect(coll.canMove(2, 3)).toBe(false);
    expect(coll.canMove(2, 1)).toBe(false);


    // Self-swap is true by definition
    expect(coll.canMove(2, 2)).toBe(true);


    // Should not be possible because (2, 1) is impossible.
    expect(coll.canMove(2, 0)).toBe(false);
});


