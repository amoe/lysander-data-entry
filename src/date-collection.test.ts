import {DateCollection} from './date-collection';
import {PartialDate} from './partial-date';

it('works', () => {
    const ordering: PartialDate[] = [
        new PartialDate(1939),
        new PartialDate(1939, 1),
        new PartialDate(1939, 11, 20),
        new PartialDate(1940)
    ];

    const coll = DateCollection.fromArray(ordering);

//    expect(

});


