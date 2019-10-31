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




class App2 extends React.Component<AppProps> {
    render() {
        // Destructure the props which are now typed by the <T> above.
        // increment should now dispatch an increment action
        const { counter, increment } = this.props;

        const token = process.env.REACT_APP_MAPBOX_API_ACCESS_TOKEN;
        console.log("token is %o", token);

        return (
            <div className="App">
                <header className="App-header">
                    <p>Counter value: {counter}</p>

                    <button onClick={increment}>Increment</button>

                    {token}

                    <KeplerGl id="foo"
                        mapboxApiAccessToken={token}
                        width="640"
                        height="480" />


                </header>
            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(App2);

