import React, {useState} from 'react';
import {EventInputDetails} from './interfaces';
import {DateAuthoringComponent, DateInputs} from '../date-authoring-component';
import {InputNumber} from 'antd';

type InputNumberChangeHandler = (e: string | number | undefined) =>  void;

export function EventInputForm(
    props: {
        value: EventInputDetails,
        onChange: (v: EventInputDetails) => void
    }) {

    const propagateChange = (field: string, value: any) => {
        console.log("child: propagating change with value %o", value);
        props.onChange({...props.value, [field]: value});
    }
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const target = e.currentTarget;
        const value = target.value;
        propagateChange(target.name, value);
    };

    
    const updateNumber = (field: string): InputNumberChangeHandler =>  {
        return (e) => {
            propagateChange(field, e);
        };
    };
    
    return (
        <div>
          <input type="text"
                 name="description"
                 value={props.value.description}
                 onChange={handleChange}/>
          
          <InputNumber name="hour"
                       value={props.value.hour}
                       onChange={updateNumber('hour')}
                       min={0}
                       max={23}/>
          
          <InputNumber value={props.value.minute}
                       onChange={updateNumber('minute')}
                       min={0}
                       max={59}/>
          
        </div>
    );
}
