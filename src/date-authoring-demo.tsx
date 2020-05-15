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

type DateChangeHandler = (year: number, month: number | undefined, day: number | undefined) => void;


function DateAuthoringComponent(props: {onChange: DateChangeHandler}) {
    const [year, setYear] = useState(1939);
    const [month, setMonth] = useState<number | undefined>(1);
    const [day, setDay] = useState(2);

    function makeUpdater(setValue: Function) {
        return (x: string | number | undefined) => {
            setValue(x);
            console.log("about to fire onchange");
            props.onChange(year, month, day);
        }
    }

    return (
        <span>
        <OptionalNumber value={year}
                        onChange={makeUpdater(setYear)}
                        label="Year"
                        min={1930}
                        max={1950}/>
        <OptionalNumber value={month}
                        onChange={makeUpdater(setMonth)}
                        label="Month"
                        min={1}
                        max={12}/>
        <OptionalNumber value={day}
                        onChange={makeUpdater(setDay)}
                        label="Day"
                        min={1}
                        max={month === undefined ? undefined : daysFromMonthNumber(year, month)}/>
        </span>
    );
}



export function DateAuthoringDemo() {
    const [dates, setDates] = useState<PartialDate[]>([]);
    const [currentDate, setCurrentDate] = useState<PartialDate | undefined>(undefined)

    const onChangeDate: DateChangeHandler = (y, m, d) => {
        setCurrentDate(new PartialDate(y, m, d));
    }


    const addDate = (e: MouseEvent) => {
        if (currentDate !== undefined) {
            setDates([...dates, currentDate]);
        }
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
          
 
          <DateAuthoringComponent onChange={onChangeDate}/>

            <ul>
            {dates.map((x, i) => <li>{x.toString()}</li>)}
            </ul>

            <button onClick={addDate}>Add</button>
            </div>
    );
}
