import React, {useState} from 'react';
import {PartialDate, comparePartialDates} from './partial-date';
import {random} from 'lodash';
import {getDaysInMonth, isBefore, isAfter, isEqual} from 'date-fns';
import {DateCollection} from './date-collection';


const DATE_COLLECTION_SIZE = 10;
const coll = new DateCollection();
coll.populate(DATE_COLLECTION_SIZE);


/*
coll.contents.push(new PartialDate(1939));
coll.contents.push(new PartialDate(1939, 1));
coll.contents.push(new PartialDate(1939, 11, 20));
coll.contents.push(new PartialDate(1940));
*/

export function GeneratedDates() {
    const [canMoveHovered, setCanMoveHovered] = useState(Array(DATE_COLLECTION_SIZE).fill(false));

    const onMouseEnter = (sourceIndex: number, e: MouseEvent) => {
        console.log("mouse enter is %o", e);
        
        const newCanMove = [];

        for (var targetIndex = 0; targetIndex < coll.contents.length; targetIndex++) {
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

