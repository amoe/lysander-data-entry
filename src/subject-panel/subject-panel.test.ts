import {buildIndex} from './functions';
import {FilterConfiguration} from './interfaces';

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
}

const expected = {
    'date': {name: 'date',
             key: 'nightOf',
             data: {
                 '1940': ['A', 'B'],
                 '1941': ['C', 'D'],
                 '1942': ['E', 'F']
             }},
    'pilot': {name: 'pilot',
              key: 'name',
              data: {'Murray': ['A', 'D'],
                     'Grimm': ['F', 'B']}}
}


it('builds an index from a configuration', () => {
    expect(buildIndex(configuration)).toEqual(expected);
});

