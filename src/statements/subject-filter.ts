import {CannedStatement} from '../interfaces';

// For subject filter
export class FlightEventDates implements CannedStatement {
    getCypher(): string {
        const result = `
            MATCH (s:Sortie)-[:HAS_PLANE_SORTIE]->(ps:PlaneSortie)
            RETURN DISTINCT s.nightOf AS nightOf, COLLECT(ps.name) AS planeSortieNames 
            ORDER BY s.nightOf
        `;
        return result;
    }

    getParameters(): object {
        return {};
    }
}


// For subject filter
export class FlightEventPilotNames implements CannedStatement {
    getCypher(): string {
        const result = `
            MATCH (pc:PersonCluster)-[:HAS_PERSON]->(p:Person),
                  (pc)-[:HAS_ROLE {type: 'pilots'}]->(ps:PlaneSortie)
            WITH pc AS pc, p AS p, ps AS ps
            ORDER BY pc.id, p.id    
            WITH pc AS pc, COLLECT(p)[0] AS firstPerson, COLLECT(DISTINCT ps.name) AS planeSortieNames
            RETURN firstPerson.firstName AS firstName, 
                   firstPerson.lastName AS lastName,
                   planeSortieNames AS planeSortieNames
        `;
        return result;
    }

    getParameters(): object {
        return {};
    }
}
