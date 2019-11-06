const MODEL_CYPHER = `
CREAT (f:Flight {date: "1940-10-19",
                  names: ['Felix I', 'SIS no 1']}),
       (p:Person {name: "Philip Schneidau"}),
       (a:Alias {alias: "Felix"}),
       (ac:AliasContext),
       (p)-[:HAS_ALIAS_CONTEXT]->(ac),
       (ac)-[:POINTS_TO]->(a),
       (ac)-[:IN_CONTEXT]->(f),

       (p)-[:INVOLVED_IN {role: 'agent'}]->(f),

       (p2:Person {name: "WJ Farley"}),
       (p2)-[:INVOLVED_IN {role: 'pilot'}]->(f),

       (l:Location {coordinates: "48° 18’ 00’’ N – 02° 44’ 00’’ E"}),
       (f)-[:ACTUAL_DESTINATION]->(l),

       (e:Event {description: "Lysanser crashed near Oban (Scotland) due to very bad weather, tailplane &
compass damaged inducing fuel breakdown"}),
       (f)-[:HAS_SUB_EVENT]->(e);
`;
