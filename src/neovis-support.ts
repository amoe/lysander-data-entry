import { NEO4J_HOSTNAME, NEO4J_USERNAME, NEO4J_PASSWORD } from './configuration';


export function makeConfig(initialCypher: string) {
    return {
        container_id: "viz",
        server_url: "bolt://" + NEO4J_HOSTNAME,
        server_user: NEO4J_USERNAME,
        server_password: NEO4J_PASSWORD,
        labels: {
            "Character": {
                "caption": "name",
                "size": "pagerank",
                "community": "community"
            }
        },
        relationships: {
            // "HAS": {
            //     "thickness": 0,
            //     "caption": false
            // }
        },
        initial_cypher: initialCypher
    };
}

