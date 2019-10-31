import React from 'react';
import './App.css';
import { connect, ConnectedProps } from 'react-redux';
import { FullStateTree, IncrementAction, INCREMENT } from './stuff';

function mapStateToProps(state: FullStateTree) {
    return {
        counter: state.app.counter
    };
}


function incrementActionCreator(): IncrementAction {
    return {
        type: INCREMENT
    };
}


// This needs an object full of action creators.
const mapDispatchToProps = {
    increment: incrementActionCreator
};


interface OtherProps {
}

const connector = connect(mapStateToProps, mapDispatchToProps);
type AppProps = ConnectedProps<typeof connector> & OtherProps;

class App2 extends React.Component<AppProps> {
    render() {
        // Destructure the props which are now typed by the <T> above.
        // increment should now dispatch an increment action
        const { counter, increment } = this.props;

        return (
            <div className="App">
                <header className="App-header">
                    <p>Counter value: {counter}</p>

                    <button onClick={increment}>Increment</button>
                </header>
            </div>
        );
    }
}


export default connector(App2);
