import React from 'react';
import './App.css';
import { connect } from 'react-redux';
import { FullStateTree, IncrementAction, INCREMENT } from './stuff';
import KeplerGl from 'kepler.gl';
import { addDataToMap } from 'kepler.gl/actions';


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
    increment: incrementActionCreator,
    addDataToMap
};



// Combined props from mapState & mapDispatch
interface AppProps {
    counter: number;
    increment: () => IncrementAction;
    addDataToMap: typeof addDataToMap;
}



const sampleTripData = {
    fields: [
        { name: 'tpep_pickup_datetime', format: 'YYYY-M-D H:m:s', type: 'timestamp' },
        { name: 'pickup_longitude', format: '', type: 'real' },
        { name: 'pickup_latitude', format: '', type: 'real' }
    ],
    rows: [
        ['2015-01-15 19:05:39 +00:00', -73.99389648, 40.75011063],
        ['2015-01-15 19:05:39 +00:00', -73.97642517, 40.73981094],
        ['2015-01-15 19:05:40 +00:00', -73.96870422, 40.75424576]
    ]
};



const sampleConfig = {
    visState: {
        filters: [
            {
                id: 'me',
                dataId: 'test_trip_data',
                name: 'tpep_pickup_datetime',
                type: 'timeRange',
                enlarged: true
            }
        ]
    }
};

const shite = {
    datasets: {
        info: {
            label: 'Sample Taxi Trips in New York City',
            id: 'test_trip_data'
        },
        data: sampleTripData
    },
    option: {
        centerMap: true,
        readOnly: false
    },
    config: sampleConfig
};


class App2 extends React.Component<AppProps> {
    render() {
        // Destructure the props which are now typed by the <T> above.
        // increment should now dispatch an increment action

        // MAKE SURE YOU USE THE VERSION FROM PROPS!
        // if you just call the action creator, then stuff will just silently die.
        const { counter, increment, addDataToMap } = this.props;

        const token = process.env.REACT_APP_MAPBOX_API_ACCESS_TOKEN;
        console.log("token is %o", token);

        const width = 800;
        const height = 800;

        return (
            <div className="App">
                <header className="App-header">
                    <p>Counter value: {counter}</p>

                    <button onClick={(e) => addDataToMap(shite)}>Increment</button>

                    {token}

                    <KeplerGl id="foo"
                        mapboxApiAccessToken={token}
                        width={width}
                        height={height} />


                </header>
            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(App2);

