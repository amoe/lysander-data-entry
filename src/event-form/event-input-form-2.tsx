import React, {useState} from 'react';
import {EventInputDetails} from './interfaces';
import {InputNumber, TimePicker} from 'antd';
import moment from 'moment';

export function EventInputForm(
    props: {
        value: EventInputDetails,
        onChange: (v: EventInputDetails) => void
    }) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.currentTarget;
        const value = target.value;
        console.log("child: propagating change with value %o", value);
        props.onChange({...props.value, [target.name]: value});
    };

    const f = (val: string | number | undefined) => {
        if (typeof val === 'string') throw new Error("string");
        if (val === undefined) throw new Error("undefined");
        
        props.onChange(
            {...props.value, timeOffset: {...props.value.timeOffset, dayOrdinal: val}}
        );
    };

    const format = 'HH:mm';

    const defaultValue = moment('12:08', format);
    
    return (
        <div>
          <input type="text"
                 name="description"
                 value={props.value.description}
                 onChange={handleChange}/>

          <InputNumber value={props.value.timeOffset.dayOrdinal}
                       onChange={f}/>

          <TimePicker defaultValue={defaultValue} format={format} />
        </div>
    );
}
