import React from 'react';
import {LocationInput} from './interfaces';
import {Input, InputNumber} from 'antd';

export function LocationInputForm(
    props: {value: LocationInput, onChange: (v: LocationInput) => void}
) {
    const location = props.value;

    const handleChange = (e: React.ChangeEvent<any>) => {
        const target = e.currentTarget;
        const value = target.value;
        console.log("child: propagating change with value %o", value);
        props.onChange({...props.value, [target.name]: value});
    };

    // InputNumber has a different signature
    function makeNumericHandler(fieldName: string) {
        return (val: string | number | undefined) => {
            props.onChange({...props.value, [fieldName]: val});
        };
    }


    // XXX numeric input fields needed for numeric stuff
    
    return (<div>
      <div>
        <span>ID:</span>
        <Input value={location.id} name="id" onChange={handleChange}/>
      </div>

      <div>
        <span>Codename:</span>
        <Input value={location.codename} name="codename" onChange={handleChange}/>
      </div>

      <div>
        <span>Description:</span>
        <Input value={location.description} name="description" onChange={handleChange}/>
      </div>

      <div>
        <span>Latitude:</span>
        <InputNumber value={location.latitude}
                     name="latitude"
                     step={0.01}
                     onChange={makeNumericHandler('latitude')}/>
      </div>

      <div>
        <span>Longitude:</span>
        <InputNumber value={location.longitude}
                     name="longitude"
                     step={0.01}
                     onChange={makeNumericHandler('longitude')}/>
      </div>
    </div>);
};
   
