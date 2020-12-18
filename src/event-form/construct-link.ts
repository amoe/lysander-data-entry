import {HttpLink, ApolloLink} from '@apollo/client';
import { onError } from "@apollo/client/link/error";

export function constructLink(uri: string) {
    const link2 = onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors)
            graphQLErrors.map(
                ({ message, locations, path }) =>
                    console.log(
                        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
                    )
            );
        if (networkError) console.log(`[Network error]: ${networkError}`);
    });

    return ApolloLink.from([link2, new HttpLink({uri})]);
};
