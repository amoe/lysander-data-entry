import { Neo4jGateway } from './neo4j-gateway';
import { NEO4J_HOSTNAME, NEO4J_USERNAME, NEO4J_PASSWORD } from './configuration';

const gateway = new Neo4jGateway(
    NEO4J_HOSTNAME, NEO4J_USERNAME, NEO4J_PASSWORD
);
gateway.initialize();

export default { gateway };
