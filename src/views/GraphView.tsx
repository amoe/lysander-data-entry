import React from 'react';
import { connect } from 'react-redux';
import { FullStateTree } from '../interfaces';
import Neovis from 'neovis.js';
import { makeConfig } from '../neovis-support';
import { Typography, Divider, Row, Col } from 'antd';
import './GraphView.css';

const { Title, Paragraph, Text } = Typography;


function mapStateToProps(state: FullStateTree) {
    return {
    };
}

const mapDispatchToProps = {
};


interface AppProps {

}

const ENTIRE_GRAPH_QUERY = `
MATCH (n) OPTIONAL MATCH (n)-[r]->() RETURN n, r
LIMIT 100
`;

class GraphView extends React.Component<AppProps> {
    componentDidMount() {
        console.log("neovis is %o", Neovis);

        const v = new Neovis(makeConfig(ENTIRE_GRAPH_QUERY));
        v.render();
    }


    render() {
        return (
            <div>
                <Title level={2}>Graph view</Title>

                <Paragraph>This view displays a visual representation of the
                nodes and relationships currently stored in the graph database.</Paragraph>

                <div id="viz"></div>
            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(GraphView);

