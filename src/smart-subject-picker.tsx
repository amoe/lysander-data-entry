import React, {useState} from 'react';
import singletons from './singletons';
import {Select} from 'antd';
import {
    SubjectPanelFilter, FieldChange, FilterConfiguration
} from './subject-panel/interfaces';
import {buildIndex} from './subject-panel/functions';
import {intersection} from 'lodash';


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
        onChange: (x: FieldChange) => void
    }) {


    return (
        <div>
          <h1>My Component</h1>


          {props.configuration.map(f => <SingleFilter key={f.name} 
                                                      filter={f}
                                                      onChange={props.onChange}/>)}
        </div>
    );
}


function Pinpoint(props: {
    configuration: FilterConfiguration,
    criteria: {[key: string]: any}
}) {
    const index = buildIndex(props.configuration);

    var soFar = undefined;

    for (let [k, v] of Object.entries(props.criteria)) {
        const thisSet = index[k].data[v];

        if (soFar === undefined) {
            soFar = thisSet;
        } else {
            soFar = intersection(soFar, thisSet);
        }
    }
    
    return (
        <div>{JSON.stringify(soFar)}</div>
    );
}

export function SmartSubjectPicker() {
    const [state, setState] = useState({});
    const handleChange = (change: {name: string, value: any}) => {
        console.log("change happened %o", change);
        setState({...state, [change.name]: change.value});
    };

    const mockDates = [
        {nightOf: '1940', planeSortieNames: ['A', 'B']},
        {nightOf: '1941', planeSortieNames: ['C', 'D']},
        {nightOf: '1942', planeSortieNames: ['E', 'F']}
    ];

    const mockPilots = [
        {name: 'Murray', planeSortieNames: ['A', 'D']},
        {name: 'Grimm', planeSortieNames: ['F', 'B']}
    ];


    const configuration: FilterConfiguration = {
        targetField: 'planeSortieNames',
        filters: [
            {name: 'date',
             key: 'nightOf',
             data: mockDates},
            {name: 'pilot',
             key: 'name',
             data: mockPilots}
        ]
    };
        
    return (
        <div>
          {JSON.stringify(state)}

          <SubjectPanel configuration={configuration.filters}
                        onChange={handleChange}/>


          <Pinpoint configuration={configuration}
                    criteria={state}/>
        </div>
    );
}
