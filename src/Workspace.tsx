import React from 'react';
import { connect } from 'react-redux';
import actionCreators from './action-creators';
import { FullStateTree, IncrementAction } from './interfaces';


function mapStateToProps(state: FullStateTree) {
    return {
        counter: state.app.counter
    };
}

const mapDispatchToProps = {
    increment: actionCreators.increment,
    demoQuery: actionCreators.demoQuery
};


interface AppProps {
    counter: number;
    increment: () => IncrementAction;
    demoQuery: () => typeof actionCreators.demoQuery;
}

class MyComponent extends React.Component<AppProps> {
    componentDidMount() {
        console.log("component mounted");
    }

    render() {
        return (
            <div>
                <p>Counter value: {this.props.counter}</p>
                <button onClick={(e) => this.props.increment()}>Increment</button>
                <button onClick={(e) => this.props.demoQuery()}>Async increment</button>
            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(MyComponent);

