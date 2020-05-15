import React, {useState, ChangeEvent, MouseEvent} from 'react';
import {InputNumber, Checkbox} from 'antd';
import {Button, Form, Input} from 'antd';
import {PartialDate} from './partial-date';
import {clone} from 'lodash';

// not sure how to type the onchange handler
function OptionalNumber(props: {value: number, onChange: any, label: string}) {
    const [isEnabled, setEnabled] = useState(true);

    console.log("enabled value is %o", isEnabled);


    return (
        <div>
          
          <Checkbox checked={isEnabled} onChange={e => setEnabled(e.target.checked)} />
          <InputNumber value={props.value} onChange={props.onChange} 
                       disabled={!isEnabled}/>
        </div>
    );
}

export function DateAuthoringDemo() {
    const [year, setYear] = useState(1939);
    const [month, setMonth] = useState(1);

    const [dates, setDates] = useState<PartialDate[]>([]);

    const addDate = (e: MouseEvent) => {
        setDates([...dates, new PartialDate(1939)]);
    };

    return (
        <div>
          <h1>Date authoring demo</h1>
          
          <OptionalNumber value={year} onChange={setYear} label="Year"/>
          <OptionalNumber value={month} onChange={setMonth} label="Month"/>


          <ul>
            {dates.map((x, i) => <li>{x.toString()}</li>)}
          </ul>

          <button onClick={addDate}>Add</button>
        </div>
    );
}
