import React, {useState} from 'react';
import singletons from './singletons';
import {Select} from 'antd';


interface SubjectPanelFilter {
    name: string;
    key: string;
    data: {[key: string]: any}[]
}

function getOptions(filter: SubjectPanelFilter) {
    return filter.data.map(x => ({value: x[filter.key]}));
}


function SingleFilter(props: {
    filter: SubjectPanelFilter,
    onChange: (x: any) => void
}) {

    return (<Select style={{width: '100%'}}
                    options={getOptions(props.filter)}
                    onChange={(x: any) => props.onChange({name: props.filter.name, value: x})}/>);
}


function SubjectPanel(
    props: {
        configuration: SubjectPanelFilter[],
        onChange: () => void
    }) {
    const handleChange = (change: {name: string, value: any}) => {
        console.log("change happened %o", change);
        
    };

    return (
        <div>
          <h1>My Component</h1>


          {props.configuration.map(f => <SingleFilter key={f.name} 
                                                      filter={f}
                                                      onChange={handleChange}/>)}
        </div>
    );
}

export function SmartSubjectPicker() {
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

    const configuration = [
        {name: 'date',
         key: 'nightOf',
         data: mockDates},
        {name: 'pilot',
         key: 'name',
         data: mockPilots}
    ];

    return (
        <div>
          <SubjectPanel configuration={configuration}
                        onChange={handleChange}/>
        </div>
    );
}
