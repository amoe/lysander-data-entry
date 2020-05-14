import React, {useState} from 'react';
import {PartialDate, comparePartialDates} from './partial-date';
import {random} from 'lodash';
import {getDaysInMonth, isBefore, isAfter, isEqual} from 'date-fns';

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
            const extraElements = random(0, 2);

            var x;

            const randomYear = random(1939, 1945);
            const randomMonth = random(1, 12);   // becaues of monthIndex semantics
            
            const someDate = new Date(randomYear, randomMonth - 1);
            const randomDay = random(1, getDaysInMonth(someDate));


            if (extraElements === 0) {
                x = new PartialDate(randomYear)
            } else if (extraElements === 1) {
                x = new PartialDate(randomYear, randomMonth);
            } else {
                x = new PartialDate(randomYear, randomMonth, randomDay);
            }

            this.contents.push(x);
        }

        this.contents.sort(comparePartialDates);
    }

    canMove(sourceIndex: number, targetIndex: number) {
        const source = this.contents[sourceIndex];
        console.log("source is %o", source);
        
        const target = this.contents[targetIndex];

        if (sourceIndex < targetIndex) {    // We are moving the event forward
            console.log("forward branch");

            const x = source.toLatestDate();
            const y = target.toEarliestDate();

            console.log("x = %o, y = %o", x, y);

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
}
