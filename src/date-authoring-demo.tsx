import React, {useState, ChangeEvent} from 'react';
import {InputNumber, Checkbox} from 'antd';
import {Button, Form, Input} from 'antd';

// not sure how to type the onchange handler
function OptionalNumber(props: {value: number, onChange: any, label: string}) {
    const [isEnabled, setEnabled] = useState(true);

    console.log("enabled value is %o", isEnabled);


    return (
        <div>
          
          <Checkbox checked={isEnabled} onChange={e => setEnabled(e.target.checked)} />
          <InputNumber value={props.value} onChange={props.onChange} 
                       disabled={!isEnabled}/>
        </div>
    );
}

export function DateAuthoringDemo() {
    const [year, setYear] = useState(1939);
    const [month, setMonth] = useState(1);

    return (
        <div>
          <h1>Date authoring demo</h1>
          
          <OptionalNumber value={year} onChange={setYear} label="Year"/>
          <OptionalNumber value={month} onChange={setMonth} label="Month"/>
        </div>
    );
}
