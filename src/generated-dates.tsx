import React, {useState} from 'react';
import {PartialDate, comparePartialDates} from './partial-date';
import {random} from 'lodash';
import {getDaysInMonth, isBefore, isAfter, isEqual} from 'date-fns';

class DateCollection {
    contents: PartialDate[];

    constructor() {
        this.contents = [];
    }

    populate() {
        for (var i = 0; i < 10; i++) {
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
}


const coll = new DateCollection();
coll.populate();



export function GeneratedDates() {
    const [canMoveHovered, setCanMoveHovered] = useState(Array(10).fill(false));

    for (var i = 0; i < coll.contents.length; i++) {
        
    }

    const onMouseEnter = (sourceIndex: number, e: MouseEvent) => {
        console.log("mouse enter is %o", e);
        
        const newCanMove = [];

        for (var targetIndex = 0; targetIndex < 10; targetIndex++) {
            newCanMove.push(coll.canMove(sourceIndex, targetIndex));
        }
        

        console.log("recalculated move matrix");
        setCanMoveHovered(newCanMove);
    };

    return (
        <div>
          <h1>Sequence Move Rules</h1>

          <ul>
            {coll.contents.map((x, i) => 
                <span key={i}>
                  <li onMouseEnter={(e: any) => onMouseEnter(i, e)}>{x.toString()} ({canMoveHovered[i] ? "✓" : "✗"})</li>
                </span>
            )}
          </ul>
        </div>
    );
}

