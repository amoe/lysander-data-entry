import React from 'react';
import logo from './logo.svg';
import './App.css';
import { connect } from 'react-redux';

interface MyState {
    counter: number;
}


function mapStateToProps(state: MyState) {
    return {
        counter: state.counter
    };
}

const mapDispatchToProps = {
}

interface AppProps {
}


class App2 extends React.Component {
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />

                    <p>Something 2</p>

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
