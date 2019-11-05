import React from 'react';
import { Neo4jGateway } from './neo4j-gateway';

interface AppProps {
}

class Workspace extends React.Component<AppProps> {
    componentDidMount() {
        console.log("component mounted");

        console.log(Neo4jGateway);
    }

    componentWillUnmount() {
        console.log("component unmounted");
    }

    render() {
        return (
            <div>
                <p>Counter value: 0</p>
            </div>
        );
    }
}

export default Workspace;
