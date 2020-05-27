import React, {useState} from 'react';
import singletons from './singletons';
import {FlightEventDates, FlightEventPilotNames} from './statements/subject-filter';
import {Select} from 'antd';

function narrow(source: any, date: string): Set<String> {
    const result = new Set<String>();
    source[date].planeSortieNames.forEach((x: any) => result.add(x));
    return result;
}

export function SmartSubjectPicker() {
    const [date, setDate] = useState(undefined as string | undefined);
    
    const mockDates = [
        {nightOf: '1940', planeSortieNames: ['A', 'B']},
        {nightOf: '1941', planeSortieNames: ['C', 'D']},
        {nightOf: '1942', planeSortieNames: ['E', 'F']}
    ];

    const mockPilots = [
        {name: 'Murray', planeSortieNames: ['A', 'D']},
        {name: 'Grimm', planeSortieNames: ['F', 'B']}
    ];

    const handleChange = () => {
        console.log("change happened");
    };

    const result = narrow(mockDates, date);


    return (
        <div>
          <h1>My Component</h1>


          <Select options={mockDates.map(x=>({value: x.nightOf}))} 
                  onChange={handleChange} style={{width: '100%'}}/> 
        </div>
    );
}

