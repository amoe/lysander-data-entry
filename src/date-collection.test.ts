import {DateCollection} from './date-collection';
import {PartialDate} from './partial-date';

it('works', () => {
    const ordering: PartialDate[] = [
        new PartialDate(1939),            // 0
        new PartialDate(1939, 1),         // 1
        new PartialDate(1939, 11, 20),    // 2
        new PartialDate(1940)             // 3
    ];

    console.log(DateCollection);
    const coll = DateCollection.fromArray(ordering);

    expect(coll.canMove(2, 3)).toBe(false);
});


