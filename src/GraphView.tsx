import React from 'react';
import { connect } from 'react-redux';
import actionCreators from './action-creators';
import { FullStateTree } from './interfaces';
import Neovis from 'neovis.js';
import { makeConfig } from './neovis-support';

import './GraphView.css';

function mapStateToProps(state: FullStateTree) {
    return {
    };
}

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
                <h1>Graph view</h1>

                <div id="viz"></div>
            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(MyComponent);

