import React, {useState, ChangeEvent, MouseEvent} from 'react';
import {InputNumber, Checkbox} from 'antd';
import {Button, Form, Input} from 'antd';
import {PartialDate} from './partial-date';
import {clone} from 'lodash';
import {getDaysInMonth} from 'date-fns';
import {daysFromMonthNumber} from './maybe-date-collection';

export interface DateInputs {
    year: number;
    monthIndex?: number;    // 0-BASED
    day?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    milliseconds?: number;
}

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

export function DateAuthoringComponent(props: {value: DateInputs, onChange: (x: DateInputs) => void}) {
    function makeUpdater(fieldName: string) {
        return (x: string | number | undefined) => {
            props.onChange({...props.value, [fieldName]: x});
        }
    }

    return (
        <span>
          <OptionalNumber value={props.value.year}
                          onChange={makeUpdater('year')}
                          label="Year"
                          min={1930}
                          max={1950}/>
          <OptionalNumber value={props.value.monthIndex}
                          onChange={makeUpdater('monthIndex')}
                          label="Month"
                          min={1}
                          max={12}/>
          <OptionalNumber value={props.value.day}
                          onChange={makeUpdater('day')}
                          label="Day"
                          min={1}
                          max={props.value.monthIndex === undefined ? undefined : daysFromMonthNumber(props.value.year, props.value.monthIndex)}/>
        </span>
    );
}
