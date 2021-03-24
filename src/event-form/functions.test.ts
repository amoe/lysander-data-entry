import {cardinalToBearing} from './functions';
import {CardinalPoint} from './interfaces';

it('works', () => {
    expect(cardinalToBearing(CardinalPoint.WEST)).toEqual(270.0);
    expect(cardinalToBearing(CardinalPoint.NORTH_NORTH_WEST)).toEqual(337.5);
    expect(cardinalToBearing(CardinalPoint.NORTH_WEST)).toEqual(315.0);
});

