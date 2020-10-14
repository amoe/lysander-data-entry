import React, {useState} from 'react';
import {
    ApolloClient, InMemoryCache, ApolloProvider
} from '@apollo/client';
import {
    useQuery, useMutation
} from '@apollo/client';
import {
    EVENT_SEQUENCE_QUERY, ALL_PLANESORTIES_QUERY, SET_EVENT_DESCRIPTION,
    REDIRECT_EVENT_SEQUENCE
} from './graphql-operations';
import './event-form.css'

const client = new ApolloClient({
    uri: 'http://localhost:4000', cache: new InMemoryCache()
});


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

    const onChange = (value: string) => {
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


function PlaneSortieSelector(props: {value: string, onChange: (x: string) => void}) {
    const {loading, error, data} = useQuery(ALL_PLANESORTIES_QUERY);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error!</p>;

    return (
        <span>
          <select value={props.value}
                  onChange={e => props.onChange(e.target.value)}>
            {data['PlaneSortie'].map((ps: PlaneSortie) => <option key={ps.name} value={ps.name}>{ps.name}</option>)}
          </select>
        </span>
    )
}

// View for an individual event sequence.
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
          
          <p>Referred-to PlaneSortie:
            <PlaneSortieSelector value={props.planeSortie.name}
                                 onChange={handlePlaneSortieChange}/>
          </p>

          <p>Total items in event sequence: {props.content.length}</p>
          
          <div className="event-list">
            {props.content.map(e => <EventView key={e.uuid} {...e}/>)}
          </div>
        </div>
    );
}


function AllSequencesView() {
    const [currentId, setCurrentId] = useState("00000000-0000-4000-8000-000000000001");
    const {loading, error, data} = useQuery(EVENT_SEQUENCE_QUERY);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error!</p>;

    const sequences = data['EventSequence'];
    const thisSequence = sequences.find((x: EventSequence) => x.uuid === currentId);

    return (
        <div>
          <select onChange={e => setCurrentId(e.target.value)} value={currentId}>
            {sequences.map((es: EventSequence) => <option key={es.uuid} value={es.uuid}>{es.uuid}</option>)}
          </select>

          <EventSequenceView {...thisSequence}/>
        </div>
    );
}

export function EventForm() {
    return (
        <ApolloProvider client={client}>
          <div>
            <AllSequencesView/>
          </div>
        </ApolloProvider>
    );
}

