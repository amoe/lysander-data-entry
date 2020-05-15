import React, {useState, ChangeEvent, MouseEvent} from 'react';
import {InputNumber, Checkbox} from 'antd';
import {Button, Form, Input} from 'antd';
import {PartialDate} from './partial-date';
import {clone} from 'lodash';
import {getDaysInMonth} from 'date-fns';
import {daysFromMonthNumber} from './date-collection';

// not sure how to type the onchange handler
function OptionalNumber(props: {
    value: number | undefined, 
    onChange: any,
    label: string,
    min: number,
    max: number | undefined
}) {
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
                       disabled={!isEnabled}
                       max={props.max}/>
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

    /* const maybeMaxDaysProp = () => {
     *     return month === undefined ? undefined : daysFromMonthNumber(year, month);

     *     if (month === undefined) {
     *         return {'max': };
     *     } else {
     *         return {'max': daysFromMonthNumber(year, month!)}
     *     }
     * };*/


    return (
        <div>
          <h1>Date authoring demo</h1>
          
          <OptionalNumber value={year}
                          onChange={setYear}
                          label="Year"
                          min={1930}
                          max={1950}/>
          <OptionalNumber value={month}
                          onChange={setMonth}
                          label="Month"
                          min={1}
                          max={12}/>
          <OptionalNumber value={day}
                          onChange={setDay}
                          label="Day"
                          min={1}
                          max={month === undefined ? undefined : daysFromMonthNumber(year, month)}/>


            <ul>
            {dates.map((x, i) => <li>{x.toString()}</li>)}
            </ul>

            <button onClick={addDate}>Add</button>
            </div>
    );
}
