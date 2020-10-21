import React from 'react';
import {EventInputDetails} from './interfaces';

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
    
    return (
        <div>
          <input type="text"
                 name="description"
                 value={props.value.description}
                 onChange={handleChange}/>
        </div>
    );
}
