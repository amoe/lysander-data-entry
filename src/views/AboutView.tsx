import React from 'react';
import { connect } from 'react-redux';
import actionCreators from '../action-creators';
import { FullStateTree } from '../interfaces';

function mapStateToProps(state: FullStateTree) {
    return {
    };
}

const mapDispatchToProps = {
};


interface AppProps {
}

class AboutView extends React.Component<AppProps> {
    render() {
        return (
            <div>
                <h1>About Lysander</h1>
            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(AboutView);

