import React, {useState} from 'react';
import {PartialDate, comparePartialDates} from './partial-date';
import {random} from 'lodash';
import {getDaysInMonth, isBefore, isAfter, isEqual} from 'date-fns';

export type MaybePartialDate = PartialDate | undefined;

// month is 1-based
export function daysFromMonthNumber(year: number, month: number): number {
    return getDaysInMonth(new Date(year, month - 1));
}

export function randomPartial(): PartialDate {
    const extraElements = random(0, 4);

    var x;

    const randomYear = random(1939, 1945);
    const randomMonth = random(1, 12);
    const randomDay = random(1, daysFromMonthNumber(randomYear, randomMonth));
    const randomHour = random(0, 23);
    const randomMinute = random(0, 59);

    console.log(randomYear);
    
    if (extraElements === 0) {
        x = new PartialDate({year: randomYear})
    } else if (extraElements === 1) {
        x = new PartialDate({year: randomYear, monthIndex: randomMonth - 1});
    } else if (extraElements === 2) {
        x = new PartialDate(
            {year: randomYear, monthIndex: randomMonth - 1, day: randomDay}
        );
    } else if (extraElements === 3) {
        x = new PartialDate(
            {year: randomYear, monthIndex: randomMonth - 1, day: randomDay, hours: randomHour}
        );
    } else {
        x = new PartialDate(
            {year: randomYear, monthIndex: randomMonth - 1, day: randomDay, hours: randomHour, minutes: randomMinute}
        );
    }

    return x;
 }

function compareMaybePartialDates(a: MaybePartialDate, b: MaybePartialDate): number {
    if (a === undefined || b === undefined) {
        return -1;    // I think this is ok????
    } else {
        return comparePartialDates(a, b);
    }
}

function checkValidityForward(source: MaybePartialDate, target: MaybePartialDate): boolean {
    if (source === undefined || target === undefined) {
        return true;
    } else {
        const x = source.toLatestDate();
        const y = target.toEarliestDate();

        const isValid = isAfter(x, y) || isEqual(x, y);
        return isValid;
    }
}


function checkValidityBackward(source: MaybePartialDate, target: MaybePartialDate): boolean {
    if (source === undefined || target === undefined) {
        return true;
    } else {
        const x = source.toEarliestDate();
        const y = target.toLatestDate();

        const isValid = isBefore(x, y) || isEqual(x, y);
        return isValid;
    }
}


export class MaybeDateCollection {
    contents: MaybePartialDate[];

    constructor() {
        this.contents = [];
    }

    static fromArray(contents: MaybePartialDate[]) {
        const result = new MaybeDateCollection();
        result.contents = contents;
        return result;
    }

    populate(size: number) {
        for (var i = 0; i < size; i++) {
            this.contents.push(randomPartial());
        }

        this.contents.sort(compareMaybePartialDates);
    }

    canMove(sourceIndex: number, targetIndex: number): boolean {
        const source = this.contents[sourceIndex];
        const target = this.contents[targetIndex];

        if (sourceIndex < targetIndex) {    // Moving event forward
            const isValid = checkValidityForward(source, target);
            return isValid && this.canMove(sourceIndex, targetIndex - 1);
        } else if (sourceIndex > targetIndex) {    // Moving backward
            const isValid = checkValidityBackward(source, target);
            return isValid && this.canMove(sourceIndex, targetIndex + 1);
        } else {
            return true;    // base case, same event can always be swapped
        }
    }
}
