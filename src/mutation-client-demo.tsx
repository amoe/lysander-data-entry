import React from 'react';
import {
    ApolloClient, InMemoryCache, ApolloProvider
} from '@apollo/client';
import { gql, useQuery, useMutation } from '@apollo/client';

const client = new ApolloClient({
    uri: 'http://localhost:4000', cache: new InMemoryCache()
});

const ALL_PLANESORTIES_QUERY = gql`
    query {
        PlaneSortie {
            name
        }
    }
`;

const EVENT_SEQUENCE_QUERY = gql`
    query {
	EventSequence {
            name
            uuid
            content {
                uuid
                description
            }
            planeSortie {
                name
            }
        }
    }    
`;

const SET_EVENT_DESCRIPTION = gql`
    mutation SetEventDescription($uuid: ID!, $description: String!) {
        UpdateEvent(uuid: $uuid, description: $description) {
            uuid
            description
        }
    }
`;

const REDIRECT_EVENT_SEQUENCE = gql`
    mutation RedirectEventSequence($esId: ID!, $psName: String!) {
	redirectEventSequence(esId: $esId, psName: $psName) {
            name
        }
    }
`


interface Event {
    uuid: string;
    description: string;
}

interface PlaneSortie {
    name: string;
}

interface EventSequence {
    name: string;
    uuid: string;
    content: Event[];
    planeSortie: PlaneSortie
}


function EventView(props: Event) {
    const [setEventDescription, {data}] = useMutation(
        SET_EVENT_DESCRIPTION, {refetchQueries: [{query: EVENT_SEQUENCE_QUERY}]}
    );

    const onChange = (value: any) => {
        setEventDescription({variables: {uuid: props.uuid, description: value}});
    };
    
    return (
        <div>
          <input type="text"
                 value={props.description}
                 onChange={(e) => onChange(e.target.value)}/>
        </div>
    )
}

function EventSequenceView(props: EventSequence) {
    const [redirectEventSequence, _] = useMutation(
        REDIRECT_EVENT_SEQUENCE, {refetchQueries: [{query: EVENT_SEQUENCE_QUERY}]}
    );

    const handlePlaneSortieChange = (value: string) => {
        redirectEventSequence({variables: {esId: props.uuid, psName: value}});
    };
    
    return (
        <div>
          <h1>Event Sequence</h1>
          <p>UUID: {props.uuid}</p>
          <p>Name: {props.name}</p>
          
          <p>Referred-to PlaneSortie:</p>
          <PlaneSortieSelector value={props.planeSortie.name}
                               onChange={handlePlaneSortieChange}/>

          <div>
            {props.content.map(e => <EventView key={e.uuid} {...e}/>)}
          </div>
        </div>
    );
}

function PlaneSortieSelector(props: {value: string, onChange: (x: string) => void}) {
    const {loading, error, data} = useQuery(ALL_PLANESORTIES_QUERY);


    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error!</p>;

    return (
        <div>
          <select value={props.value}
                  onChange={e => props.onChange(e.target.value)}>
            {data['PlaneSortie'].map((ps: any) => <option key={ps.name} value={ps.name}>{ps.name}</option>)}
          </select>
        </div>
    )
}

function SequenceData() {
    const {loading, error, data} = useQuery(EVENT_SEQUENCE_QUERY);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error!</p>;

    return (
        <div>
          {data['EventSequence'].map((es: EventSequence) => <EventSequenceView key={es.uuid} {...es}/>)}
        </div>
    );
}

export function MutationClientDemo() {
    return (
        <ApolloProvider client={client}>
          <div>
            <SequenceData/>
          </div>
        </ApolloProvider>
    );
}

