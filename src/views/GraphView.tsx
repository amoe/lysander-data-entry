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

// GET YER ACTION CREATORS HERE
const mapDispatchToProps = {
};


interface AppProps {

}

const ENTIRE_GRAPH_QUERY = `MATCH (n) OPTIONAL MATCH (n)-[r]->() RETURN n, r`;

class MyComponent extends React.Component<AppProps> {
    componentDidMount() {
        console.log("neovis is %o", Neovis);

        const v = new Neovis(makeConfig(ENTIRE_GRAPH_QUERY));
        v.render();
    }


    render() {
        return (
            <div>
                <Title level={2}>Graph view</Title>


                <div id="viz"></div>
            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(MyComponent);

