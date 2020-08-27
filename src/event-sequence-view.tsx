import React from 'react';
import {PartialDate} from './partial-date';
import {Event} from './event';

export function EventSequenceView() {
    const d1 = new PartialDate({year: 1940});
    const d2 = new PartialDate({year: 1940, monthIndex: 5});
    const d3 = new PartialDate({year: 1940, monthIndex: 6, day: 9});

    const  myValues = [
        d3, d2, d1
    ];

    return (
        <div>
          <h1>Event Sequence View</h1>

          <ul>
            {myValues.map(x => <li><Event d={x}/></li>)}
          </ul>
        </div>
    );
}

