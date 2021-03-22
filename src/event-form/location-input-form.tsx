import React from 'react';
import {Location} from './interfaces';
import {Input} from 'antd';

export function LocationInputForm(props: {value: Location,
                                          onChange: (v: Location) => void,}) {
    const location = props.value;

    const handleChange = (e: React.ChangeEvent<any>) => {
        const target = e.currentTarget;
        const value = target.value;
        console.log("child: propagating change with value %o", value);
        props.onChange({...props.value, [target.name]: value});
    };


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
        <Input value={location.latitude} name="latitude" onChange={handleChange}/>
      </div>

      <div>
        <span>Longitude:</span>
        <Input value={location.longitude} name="longitude" onChange={handleChange}/>
      </div>
    </div>);
};
    
