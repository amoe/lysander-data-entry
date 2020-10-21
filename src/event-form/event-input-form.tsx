import React, {useState} from 'react';
import {EventInputDetails} from './interfaces';
import {DateAuthoringComponent, DateInputs} from '../date-authoring-component';

export function EventInputForm(
    props: {
        value: EventInputDetails,
        onChange: (v: EventInputDetails) => void
    }) {
    // FIXME lift state up
    // const [dates, setDates] = useState([] as DateInputs[]);
    // const [dateInputs, setDateInputs] = useState({year: 1940} as DateInputs);

    function handleDateChange(x: DateInputs) {
        props.onChange({...props.value, date: x});
//        setDateInputs(x);
    }
    
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

          
          <DateAuthoringComponent value={props.value.date}
                                  onChange={handleDateChange}/>
        </div>
    );
}
