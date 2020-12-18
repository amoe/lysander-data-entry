import {HttpLink, ApolloLink} from '@apollo/client';
import { onError } from "@apollo/client/link/error";
import { GraphQLError } from 'graphql';
import { notification } from 'antd';

function reportError(error: GraphQLError) {
    const {message, locations, path} = error;
    const description = `Message: ${message}, Location: ${locations}, Path: ${path}`;
    notification.error({message: 'GraphQL error', description, duration: 10});
}

export function constructLink(uri: string) {
    const link2 = onError(({graphQLErrors, networkError}) => {
        if (graphQLErrors) {
            graphQLErrors.forEach(reportError);
        }
        if (networkError) console.log(`[Network error]: ${networkError}`);
    });

    return ApolloLink.from([link2, new HttpLink({uri})]);
};
