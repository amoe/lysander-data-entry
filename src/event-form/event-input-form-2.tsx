import React, {useState} from 'react';
import {EventInputDetails} from './interfaces';
import {UserFacingTimeOffset} from '../core/time-offset';
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

    const g = (chosenTime: moment.Moment | null, timeString: string) => {
        if (chosenTime === null) throw new Error("cannot unset time");
        
        console.log("setting value");
        console.log("chosen time is %o");

        props.onChange(
            {
                ...props.value,
                timeOffset: {
                    ...props.value.timeOffset,
                    hour: chosenTime.hour(),
                    minute: chosenTime.minute()
                }
            }
                 
        );
    };

    function toMoment(offset: UserFacingTimeOffset) {
        return moment({hour: offset.hour, minute: offset.minute});
    }

    const format = 'HH:mm';

    const defaultValue = moment('12:08', format);
    
    return (
        <div>
          <div>
          <span>Description:</span>
          <input type="text"
                 name="description"
                 value={props.value.description}
                 onChange={handleChange}/>
          </div>

          <div>
          <span>Day:</span>
          <InputNumber value={props.value.timeOffset.dayOrdinal}
                       onChange={f}/>
          </div>


          <div>
          <span>Time:</span>
          <TimePicker defaultValue={defaultValue}
                      format={format}
                      value={toMoment(props.value.timeOffset)}
                      onChange={g}/>
          </div>
        </div>
    );
}
