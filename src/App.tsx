import React from 'react';
import logo from './logo.svg';
import './App.css';
import { connect } from 'react-redux';
import { MyState, IncrementAction, INCREMENT } from './stuff';

function mapStateToProps(state: MyState) {
    return {
        counter: state.counter
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

// Explicitly typing the counter that is returned by the mapper.
interface AppProps {
    counter: number;
    increment: any;
}


class App2 extends React.Component<AppProps> {
    render() {
        // Destructure the props which are now typed by the <T> above.
        // increment should now dispatch an increment action
        const { counter, increment } = this.props;

        const incrementPrime = (e: any) => {
            console.log("increment event handler was called");
        };


        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />

                    <p>Counter value: {counter}</p>

                    <button onClick={increment}>Increment</button>

                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                </a>
                </header>
            </div>
        );
    }
}


export default connect(
    mapStateToProps, mapDispatchToProps
)(App2);
