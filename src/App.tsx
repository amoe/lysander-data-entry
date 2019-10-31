import React from 'react';
import './App.css';
import { connect } from 'react-redux';
import { FullStateTree, IncrementAction, INCREMENT } from './stuff';
import KeplerGl from 'kepler.gl';


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



// Combined props from mapState & mapDispatch
interface AppProps {
    counter: number;
    increment: () => IncrementAction;
}

/*

   <KeplerGl id="foo"
   mapboxApiAccessToken="pk.eyJ1IjoiYW0wZSIsImEiOiJjamd0N2FqaDMwNG9lMndvN3ppMG92bnEwIn0.FKOnniCcTHaq-aRa5eXXFg"
   width="640"
   height="480" />


 */

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


export default connect(mapStateToProps, mapDispatchToProps)(App2);

