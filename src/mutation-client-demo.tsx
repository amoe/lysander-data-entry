import React from 'react';
import {
    ApolloClient, InMemoryCache, ApolloProvider
} from '@apollo/client';
import { gql, useQuery } from '@apollo/client';

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


function SequenceData() {
    const {loading, error, data} = useQuery(EVENT_SEQUENCE_QUERY);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error!</p>;

    return (
        <div>{data['EventSequence'].map((es: EventSequence) => <EventSequenceView key={es.uuid} {...es}/>)}
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

