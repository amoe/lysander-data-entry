import React, {useState, ChangeEvent, MouseEvent} from 'react';
import {InputNumber, Checkbox} from 'antd';
import {Button, Form, Input} from 'antd';
import {PartialDate} from './partial-date';
import {clone} from 'lodash';

// not sure how to type the onchange handler
function OptionalNumber(props: {value: number | undefined, onChange: any, label: string}) {
    const [isEnabled, setEnabled] = useState(true);

    console.log("enabled value is %o", isEnabled);

    const onCheckboxChange = (e: any) => {
        console.log("checkbox changed");

        const newEnabledValue = e.target.checked;

        setEnabled(newEnabledValue);
        if (!newEnabledValue) props.onChange(undefined);
    };


    return (
        <div>
          
          <Checkbox checked={isEnabled} onChange={onCheckboxChange} />
          <InputNumber value={props.value} onChange={props.onChange} 
                       disabled={!isEnabled}/>
        </div>
    );
}


export function DateAuthoringDemo() {
    const [year, setYear] = useState(1939);
    const [month, setMonth] = useState<number | undefined>(1);
    const [day, setDay] = useState(2);

    const [dates, setDates] = useState<PartialDate[]>([]);

    const addDate = (e: MouseEvent) => {
        const obj = new PartialDate(year, month, day);

        setDates([...dates, obj]);
    };

    return (
        <div>
          <h1>Date authoring demo</h1>
          
          <OptionalNumber value={year} onChange={setYear} label="Year"/>
          <OptionalNumber value={month} onChange={setMonth} label="Month"/>
          <OptionalNumber value={day} onChange={setDay} label="Day"/>


          <ul>
            {dates.map((x, i) => <li>{x.toString()}</li>)}
          </ul>

          <button onClick={addDate}>Add</button>
        </div>
    );
}
