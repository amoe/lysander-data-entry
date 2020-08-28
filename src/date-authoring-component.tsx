import React, {useState, ChangeEvent, MouseEvent} from 'react';
import {InputNumber, Checkbox} from 'antd';
import {Button, Form, Input} from 'antd';
import {PartialDate} from './partial-date';
import {clone, cloneDeep} from 'lodash';
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
        if (newEnabledValue === false) {
            props.onChange(undefined);
        }
    };
//

    return (
        <div>
          {props.label}
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
            // Completely remove undefined values from the object.  That means we can
            // manage a date with a completely undefined year, which just produces an
            // empty object of type DateInputs.
            if (x === undefined) {
                const newProps: any = cloneDeep(props.value);   // YUCK NOT TYPE SAFE
                delete newProps[fieldName];
                props.onChange(newProps);
            } else {
                props.onChange({...props.value, [fieldName]: x});
            }
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
          <OptionalNumber value={props.value.hours}
                          onChange={makeUpdater('hours')}
                          label="Hours"
                          min={0}
                          max={23}/>

          <OptionalNumber value={props.value.minutes}
                          onChange={makeUpdater('minutes')}
                          label="Minutes"
                          min={0}
                          max={59}/>
        </span>
    );
}
