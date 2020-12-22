import {CardinalPoint} from './interfaces';

// Returns degrees
export function cardinalToBearing(direction: CardinalPoint): number {
    switch (direction) {
        case CardinalPoint.NORTH:
            return 0;
        case CardinalPoint.EAST:
            return 90;
        case CardinalPoint.SOUTH:
            return 180;
        case CardinalPoint.WEST:
            return 270;
        default:
            throw new Error("unable to resolve direction " + direction);
    }
}
