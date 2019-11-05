interface QueryRegistry {
    [key: string]: string;
};

const CREATE_ALIAS_CONTEXT = `
MATCH (p:Person {id: {personId}}),
      (a:Alias {id: {aliasId}}),
      (f:Flight {id: {flightId}})
CREATE (ac:AliasContext {id: {id}}),
       (p)-[:HAS_ALIAS_CONTEXT]->(ac),
       (ac)-[:POINTS_TO]->(a),
       (ac)-[:IN_CONTEXT]->(f);
`;

export const QUERY_DEFINITIONS: QueryRegistry = {
    createPerson: "CREATE (p:Person {name: {name}, id: {id}})",
    createFlight: "CREATE (f:Flight {date: {date}, names: {codenames}, id: {flightId}})",
    createAlias: "CREATE (a:Alias {alias: {alias}, id: {id}})",
    createAliasContext: CREATE_ALIAS_CONTEXT,
    createLocation: `
        MATCH (f:Flight {id: {flightId}})
        CREATE (l:Location {description: {description}}),
               (f)-[:ACTUAL_DESTINATION]->(l)
`,
    createEvent: `
        MATCH (f:Flight {id: {flightId}})
        CREATE (e:Event {description: {description}}),
               (f)-[:ACTUAL_DESTINATION]->(e)
`
};
