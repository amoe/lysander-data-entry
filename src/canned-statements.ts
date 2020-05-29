// canned-statements

import log from 'loglevel';
import {CannedStatement} from './interfaces';

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
                  (pc)-[:HAS_ROLE {type: 'pilots'}]->()
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

export class GetDistinctLocations implements CannedStatement {
    getCypher(): string {
        const result = `
            MATCH (l:Location) RETURN l.id AS id, l.codename AS codename, l.description AS description
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


export class STPointsByLocations implements CannedStatement {
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



export class STPointsByOperations implements CannedStatement {
    operationNames: string[];

    constructor(operationNames: string[]) {
        this.operationNames = operationNames;
    }

    getCypher(): string {
        const result = `
            MATCH (o:Operation)-[:HAS_SORTIE]->(s:Sortie)-[:HAS_LANDING_ZONE]->(l:Location)
            WHERE o.name IN {operationNames}
            RETURN s.nightOf AS nightOf, l.latitude AS latitude, l.longitude AS longitude
        `;
        return result;
    }

    getParameters(): object {
        return {operationNames: this.operationNames};
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


export class STPointsByCriteria implements CannedStatement {
    clusterIds: string[];
    locationIds: string[];
    operationNames: string[];

    constructor(clusterIds: string[], locationIds: string[], operationNames: string[]) {
        this.clusterIds = clusterIds;
        this.locationIds = locationIds;
        this.operationNames = operationNames;
    }

    getCypher(): string {
        const result = `
            MATCH (s:Sortie)
            OPTIONAL MATCH (s)-[:HAS_PLANE_SORTIE]->(:PlaneSortie)<-[:HAS_ROLE {type: 'pilot'}]-(pc1:PersonCluster)
            OPTIONAL MATCH (s)<-[:HAS_ROLE {type: 'pilot'}]-(pc2:PersonCluster)
            WITH COALESCE(pc1, pc2) AS pc, s AS s
            WHERE size({clusterIds}) = 0 OR pc.id IN {clusterIds}
            MATCH (s)<-[:HAS_SORTIE]-(o:Operation), (s)-[:HAS_LANDING_ZONE]->(l:Location)
            WHERE 
                ({operationNames} = [] OR o.name IN {operationNames})
                AND
                ({locationIds} = [] OR l.id IN {locationIds})
            RETURN s.nightOf AS nightOf, l.latitude AS latitude, l.longitude AS longitude
            ORDER BY s.nightOf
        `;
        return result;
    }

    getParameters(): object {
        return {
            clusterIds: this.clusterIds,
            locationIds: this.locationIds,
            operationNames: this.operationNames
        }
    }
}


export class FlattenedPlaneSorties implements CannedStatement {
    constructor() {
    }

    getCypher() {
        const result = `
            MATCH (ps:PlaneSortie)<-[:HAS_PLANE_SORTIE]-(s:Sortie)
            OPTIONAL MATCH (pc1:PersonCluster)-[:HAS_ROLE {type: 'pilots'}]->(ps)
            RETURN ps.name, s.nightOf, COLLECT(pc1.lastNameTillet)
            ORDER BY s.nightOf
        `;
        return result;
    }

    getParameters(): object {
        return {};
    }
}
