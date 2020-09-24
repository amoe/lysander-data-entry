import React from 'react';
import {
    ApolloClient, InMemoryCache, ApolloProvider
} from '@apollo/client';
import { gql, useQuery, useMutation } from '@apollo/client';

const client = new ApolloClient({
    uri: 'http://localhost:4000', cache: new InMemoryCache()
});

const EVENT_SEQUENCE_QUERY = gql`
    query Foo {
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
    query Bar {
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
`

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
    return (
        <div>{props.description}</div>
    )
}

function EventSequenceView(props: EventSequence) {
    return (
        <div>
          <h1>Event Sequence</h1>
          <p>UUID: {props.uuid}</p>

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

function SequenceData() {
    const {loading, error, data} = useQuery(EVENT_SEQUENCE_QUERY);

    const foo = useQuery(EVENT_QUERY);

    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error!</p>;

    if (foo.loading) return <div/>;
    if (foo.error) return <div/>;

    return (
        <div>
          {data['EventSequence'].map((es: EventSequence) => <EventSequenceView key={es.uuid} {...es}/>)}

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

