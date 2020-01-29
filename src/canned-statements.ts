// canned-statements

import log from 'loglevel';

export interface CannedStatement {
    getCypher(): string;
    getParameters(): object;
}


export class FuzzySearchStatement implements CannedStatement {
    nodeLabel: string;
    nodeProperty: string;
    query: string;

    // XXX: VALIDATION!!!
    constructor(nodeLabel: string, nodeProperty: string, query: string) {
        this.nodeLabel = nodeLabel;
        this.nodeProperty = nodeProperty;
        this.query = query;
    }

    getCypher(): string {
        const result = `
            MATCH (n:${this.nodeLabel})
            WHERE apoc.text.fuzzyMatch(n.${this.nodeProperty}, {query})
            RETURN n.${this.nodeProperty} AS text, n.id AS id
        `;

        log.info(result);
        return result;
    }

    getParameters(): object {
        return { query: this.query };
    }
}

interface WantedPilot {
    firstName: string[],
    lastName: string[]
}

export class GetDistinctPilots implements CannedStatement {
    getCypher(): string {
        const result = `
            MATCH (pc)-[:HAS_ROLE {type: 'pilot'}]->(),
                  (pc)-[:HAS_PERSON]->(p)
            WITH DISTINCT p
            RETURN
                p.firstName AS firstName,
                p.lastName AS lastName
        `;
        return result;
    }

    getParameters(): object {
        return {};
    }
}

export class STPointsByPilot implements CannedStatement {
    pilot: WantedPilot;

    constructor(pilot: WantedPilot) {
        this.pilot = pilot;
    }

    getCypher(): string {
        const result = `
            MATCH (p:Person {firstName: {firstName}, lastName: {lastName}}),
                  (pc:PersonCluster)-[:HAS_PERSON]->(p),
                  (pc)-[:HAS_ROLE {type: 'pilot'}]->(s:Sortie),
                  (s)-[HAS_LANDING_ZONE]->(l:Location)
            RETURN
                s.nightOf AS nightOf,
                l.latitude AS latitude,
                l.longitude AS longitude
        `;
        return result;
    }

    getParameters(): object {
        return this.pilot;
    }
}
