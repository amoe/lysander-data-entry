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


const App: React.FC = () => {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />

                <p>Something</p>

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

export default connect(
    mapStateToProps, mapDispatchToProps
)(App);
