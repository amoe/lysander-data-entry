import React from 'react';
import { connect } from 'react-redux';
import actionCreators from './action-creators';
import { FullStateTree, IncrementAction } from './interfaces';
import { DatePicker } from 'antd';

function mapStateToProps(state: FullStateTree) {
    return {
        counter: state.app.counter
    };
}

const mapDispatchToProps = {
    increment: actionCreators.increment,
};


interface AppProps {
    counter: number;
    increment: () => IncrementAction;
}

class MyComponent extends React.Component<AppProps> {
    render() {
        return (
            <div>
                <p>Counter value: {this.props.counter}</p>
                <button onClick={(e) => this.props.increment()}>Increment</button>


                <DatePicker></DatePicker>
            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(MyComponent);

