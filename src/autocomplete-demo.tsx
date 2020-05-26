import React, {useState} from 'react';
import {AutoComplete} from 'antd';


export function AutocompleteDemo() {
    const options = [{value: 'fry'},
                     {value: 'bender'},
                     {value: 'leela'}];

    const [value, setValue] = useState(undefined as string | undefined);

    return (
        <div>
          <h1>My Component</h1>

          <AutoComplete style={{ width: '100%' }}
                        value={value}
                        onChange={setValue}
                        options={options}/>
        </div>
    );
}

