import React, {useState} from 'react';

import {DateInputs, DateAuthoringComponent} from './date-authoring-component';

export function DateAuthoringDemo() {
    const [dates, setDates] = useState([] as DateInputs[]);
    const [dateInputs, setDateInputs] = useState({year: 1940} as DateInputs);


    function onChange(x: DateInputs) {
        setDateInputs(x);
    }
    
    function addDate() {
        setDates([...dates, dateInputs]);
    }
    
    return (
        <div>
          <h1>Date authoring demo</h1>
          
          <DateAuthoringComponent value={dateInputs} onChange={onChange}/>

          <ul>
            {dates.map((x, i) => <li>{JSON.stringify(x)}</li>)}
          </ul>

          <button onClick={addDate}>Add</button>
        </div>
    );
}
