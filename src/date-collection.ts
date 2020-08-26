import React, {useState} from 'react';
import {PartialDate, comparePartialDates} from './partial-date';
import {random} from 'lodash';
import {getDaysInMonth, isBefore, isAfter, isEqual} from 'date-fns';


// month is 1-based
export function daysFromMonthNumber(year: number, month: number): number {
    return getDaysInMonth(new Date(year, month - 1));
}

export function randomPartial(): PartialDate {
    const extraElements = random(0, 2);

    var x;

    const randomYear = random(1939, 1945);
    const randomMonth = random(1, 12);
    const randomDay = random(1, daysFromMonthNumber(randomYear, randomMonth));

    if (extraElements === 0) {
        x = new PartialDate(randomYear)
    } else if (extraElements === 1) {
        x = new PartialDate(randomYear, randomMonth);
    } else {
        x = new PartialDate(randomYear, randomMonth, randomDay);
    }

    return x;
 }

export class DateCollection {
    contents: PartialDate[];

    constructor() {
        this.contents = [];
    }

    static fromArray(contents: PartialDate[]) {
        const result = new DateCollection();
        result.contents = contents;
        return result;
    }

    populate(size: number) {
        for (var i = 0; i < size; i++) {
            this.contents.push(randomPartial());
        }

        this.contents.sort(comparePartialDates);
    }

    canMoveDisregardingInterveningItems(sourceIndex: number, targetIndex: number) {
        const source = this.contents[sourceIndex];
        const target = this.contents[targetIndex];

        if (sourceIndex < targetIndex) {    // We are moving the event forward
            const x = source.toLatestDate();
            const y = target.toEarliestDate();

            return isAfter(x, y) || isEqual(x, y);
        } else if (sourceIndex > targetIndex)  {// We are moving the event backward
            const x = source.toEarliestDate();
            const y = target.toLatestDate();

            return isBefore(x, y) || isEqual(x, y);
        } else {
            console.warn("attempt to swap date with itself: %o", sourceIndex);
            return true;
        }
    }

    canMove(sourceIndex: number, targetIndex: number): boolean {
        const source = this.contents[sourceIndex];
        const target = this.contents[targetIndex];

         if (sourceIndex < targetIndex) {    // Moving event forward
            const x = source.toLatestDate();
            const y = target.toEarliestDate();

            const isValid = isAfter(x, y) || isEqual(x, y);

            return isValid && this.canMove(sourceIndex, targetIndex - 1);
        } else if (sourceIndex > targetIndex) {    // Moving backward
            const x = source.toEarliestDate();
            const y = target.toLatestDate();

            const isValid = isBefore(x, y) || isEqual(x, y);

            return isValid && this.canMove(sourceIndex, targetIndex + 1);
        } else {
            return true;    // base case, same event can always be swapped
        }
    }
}
