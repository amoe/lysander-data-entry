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
            MATCH (pc:PersonCluster)-[:HAS_PERSON]->(p:Person),
                  (pc)-[:HAS_ROLE {type: 'pilot'}]->()
            WITH pc AS pc, p AS p
            ORDER BY pc.id, p.id    
            WITH pc AS pc, COLLECT(p)[0] AS firstPerson
            RETURN pc.id AS clusterId,
                   firstPerson.firstName AS firstName, 
                   firstPerson.lastName AS lastName
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
                  (pc)-[:HAS_ROLE {type: 'pilot'}]->(s:Sortie)
            WITH DISTINCT s AS s
            MATCH (s)-[HAS_LANDING_ZONE]->(l:Location)
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

export class STPointsByMultiplePilotClusters implements CannedStatement {
    clusters: string[];

    constructor(clusters: string[]) {
        this.clusters = clusters;
    }

    getCypher(): string {
        const result = `
            MATCH (pc:PersonCluster)-[:HAS_ROLE {type: 'pilot'}]->()
            WHERE pc.id IN {clusters}
            WITH DISTINCT pc AS pc
            OPTIONAL MATCH (pc)-[:HAS_ROLE {type: 'pilot'}]->(:PlaneSortie)<-[:HAS_PLANE_SORTIE]-(s1:Sortie)-[:HAS_LANDING_ZONE]->(l1:Location)
            OPTIONAL MATCH (pc)-[:HAS_ROLE {type: 'pilot'}]->(s2:Sortie)-[:HAS_LANDING_ZONE]->(l2:Location)
            WITH COALESCE(l1, l2) AS l, COALESCE(s1, s2) AS s
            RETURN s.nightOf AS nightOf, l.latitude AS latitude, l.longitude AS longitude
        `;
        return result;
    }

    getParameters(): object {
        return {clusters: this.clusters};
    }
}

export class STPointsBySinglePilotCluster implements CannedStatement {
    clusterId: string;

    constructor(clusterId: string) {
        this.clusterId = clusterId;
    }

    getCypher(): string {
        const result = `
            MATCH (pc {id: {clusterId}})-[:HAS_ROLE {type: 'pilot'}]->()
            WITH DISTINCT pc AS pc
            OPTIONAL MATCH (pc)-[:HAS_ROLE {type: 'pilot'}]->(:PlaneSortie)<-[:HAS_PLANE_SORTIE]-(s1:Sortie)-[:HAS_LANDING_ZONE]->(l1:Location)
            OPTIONAL MATCH (pc)-[:HAS_ROLE {type: 'pilot'}]->(s2:Sortie)-[:HAS_LANDING_ZONE]->(l2:Location)
            WITH COALESCE(l1, l2) AS l, COALESCE(s1, s2) AS s
            RETURN s.nightOf AS nightOf, l.latitude AS latitude, l.longitude AS longitude
        `;
        return result;
    }

    getParameters(): object {
        return {clusterId: this.clusterId};
    }
}

export class GetDistinctLocations implements CannedStatement {
    getCypher(): string {
        const result = `
            MATCH (l:Location) RETURN l.code AS code, l.description AS description
        `;
        return result;
    }

    getParameters(): object {
        return {};
    }
}

export class GetDistinctOperations implements CannedStatement {
    getCypher(): string {
        const result = `
            MATCH (o:Operation) RETURN o.name AS name
        `;
        return result;
    }

    getParameters(): object {
        return {};
    }
}


export class STPointsByLocation implements CannedStatement {
    locationCodes: string[];

    constructor(locationCodes: string[]) {
        this.locationCodes = locationCodes;
    }

    getCypher(): string {
        const result = `
            MATCH (l:Location)<-[:HAS_LANDING_ZONE]-(s:Sortie)
            WHERE l.code IN {locationCodes}
            RETURN s.nightOf AS nightOf, l.latitude AS latitude, l.longitude AS longitude
        `;
        return result;
    }

    getParameters(): object {
        return {locationCodes: this.locationCodes};
    }
}

