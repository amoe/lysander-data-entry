import React from 'react';
import {PartialDate} from './partial-date';


export function Event(props: {d: PartialDate}) {
    return (
        <div>
          <p>{props.d.toEarliestDate().toString()}</p>
        </div>
    )
}
