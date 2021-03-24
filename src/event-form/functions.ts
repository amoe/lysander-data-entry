import {CardinalPoint} from './interfaces';

export function cardinalToBearing(direction: CardinalPoint): number {
    const index: number = Object.keys(CardinalPoint).indexOf(direction);
    return index * 22.5;
}
