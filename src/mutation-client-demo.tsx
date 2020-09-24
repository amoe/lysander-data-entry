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
        }
    }    
`;

const EVENT_QUERY = gql`
    query {
        Event {
            description
        }
    }
`

const CREATE_EVENT = gql`
    mutation {
        CreateEvent(description: "foo") {
            description
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

//client.query({query}).then(result => console.log(result));

interface Event {
    uuid: string;
    description: string;
}

interface EventSequence {
    name: string;
    uuid: string;
    content: Event[];
}


function EventView(props: Event) {
    const [setEventDescription, {data}] = useMutation(
        SET_EVENT_DESCRIPTION, {refetchQueries: [{query: EVENT_SEQUENCE_QUERY}]}
    );

    const onChange = (foo: any) => {
        console.log("inside on change handler foo is %o", foo);
        setEventDescription({variables: {uuid: props.uuid, description: foo}});
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
    return (
        <div>
          <h1>Event Sequence</h1>
          <p>UUID: {props.uuid}</p>
          <p>Name: {props.name}</p>

          <div>
            {props.content.map(e => <EventView key={e.uuid} {...e}/>)}
          </div>
        </div>
    );
}

function CreateEventWidget() {
    const [createEvent, {data}] = useMutation(
        CREATE_EVENT, {refetchQueries: [{query: EVENT_QUERY}]}
    );
    
    return (
        <div>
          <button onClick={() => {
                  createEvent();
          }}>Create event</button>
        </div>
    )
}
//

function PlaneSortieSelector() {
    const {loading, error, data} = useQuery(ALL_PLANESORTIES_QUERY);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error!</p>;

    return (
        <div>
          <select>
            {data['PlaneSortie'].map((ps: any) => <option value={ps.name}>{ps.name}</option>)}
          </select>
        </div>
    )
}

function SequenceData() {
    const {loading, error, data} = useQuery(EVENT_SEQUENCE_QUERY);

    // Gonna return the same thing
    const foo = useQuery(EVENT_QUERY);

    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error!</p>;

    if (foo.loading) return <div/>;
    if (foo.error) return <div/>;

    return (
        <div>
          <PlaneSortieSelector/>
          
          {data['EventSequence'].map((es: EventSequence) => <EventSequenceView key={es.uuid} {...es}/>)}


          <hr/>
          <CreateEventWidget/>
          {foo.data['Event'].length}
        </div>
    );
}

export function MutationClientDemo() {
    return (
        <ApolloProvider client={client}>
          <div>
            <h1>My Component</h1>

            <SequenceData/>
          </div>
        </ApolloProvider>
    );
}

