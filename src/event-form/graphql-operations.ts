import { gql } from '@apollo/client';

export const ALL_PLANESORTIES_QUERY = gql`
    query {
        PlaneSortie {
            name
        }
    }
`;

export const EVENT_SEQUENCE_QUERY = gql`
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

export const SET_EVENT_DESCRIPTION = gql`
    mutation SetEventDescription($uuid: ID!, $description: String!) {
        UpdateEvent(uuid: $uuid, description: $description) {
            uuid
            description
        }
    }
`;

export const REDIRECT_EVENT_SEQUENCE = gql`
    mutation RedirectEventSequence($esId: ID!, $psName: String!) {
	redirectEventSequence(esId: $esId, psName: $psName) {
            name
        }
    }
`
