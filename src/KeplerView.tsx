import React from 'react';
import './App.css';
import { connect } from 'react-redux';
import { FullStateTree, IncrementAction } from './interfaces';
import KeplerGl from 'kepler.gl';
import { addDataToMap } from 'kepler.gl/actions';
import actionCreators from './action-creators';
import singletons from './singletons';

function mapStateToProps(state: FullStateTree) {
    return {
        counter: state.app.counter
    };
}


// This needs an object full of action creators.
const mapDispatchToProps = {
    increment: actionCreators.increment,
    addDataToMap
};



const SAMPLE_ROWS = [
    ['2019-11-01 08:30:00 +00:00', -0.155861, 50.824926, -0.087816, 50.867578]
];

// Combined props from mapState & mapDispatch
interface AppProps {
    counter: number;
    increment: () => IncrementAction;
    addDataToMap: typeof addDataToMap;
}

// If you have two fields like SOMETHING_longitude, SOMETHING_latitude, kepler
// will combine it into a Point.

function makeData(rows: any) {
    return {
        fields: [
            { name: 'tpep_pickup_datetime', format: 'YYYY-M-D H:m:s', type: 'timestamp' },
            { name: 'start_longitude', format: '', type: 'real' },
            { name: 'start_latitude', format: '', type: 'real' },
            { name: 'end_longitude', format: '', type: 'real' },
            { name: 'end_latitude', format: '', type: 'real' }
        ],
        rows: SAMPLE_ROWS
    };
}


const myArc = {
    "id": "zslehy",
    "type": "arc",
    "config": {
        "dataId": "test_trip_data",
        "label": "DaveArc",
        "columns": {
            "lat0": "start_latitude",
            "lng0": "start_longitude",
            "lat1": "end_latitude",
            "lng1": "end_longitude"
        },
        "isVisible": true,
    }
};

const sampleConfig = {
    visState: {
        filters: [
        ],
        layers: [myArc]
    }
};


function makeKeplerData(rows: any) {
    return {
        datasets: [{
            info: {
                label: 'Dave Sample Data',
                id: 'test_trip_data'
            },
            data: makeData(rows)
        }],
        option: {
            centerMap: true,
            readOnly: true   // hide the left display panel
        },
        config: sampleConfig
    };
}


class KeplerView extends React.Component<AppProps> {
    activateLasers() {
        singletons.gateway.retrieveLocations().then(r => {


            const newRows = r.records.map(x => {
                return [
                    '2019-11-01 08:30:00 +00:00',
                    x.get('longitude'),
                    x.get('latitude'),
                    -0.087816, 50.867578
                ];
            });

            this.props.addDataToMap(makeKeplerData(newRows));
        });
    }

    render() {
        // Destructure the props which are now typed by the <T> above.
        // increment should now dispatch an increment action

        // MAKE SURE YOU USE THE VERSION FROM PROPS!
        // if you just call the action creator, then stuff will just silently die.
        const { counter, addDataToMap } = this.props;

        const token = process.env.REACT_APP_MAPBOX_API_ACCESS_TOKEN;
        console.log("token is %o", token);

        const width = 800;
        const height = 800;

        return (
            <div className="App">
                <header className="App-header">
                    <p>Counter value: {counter}</p>

                    <button onClick={() => this.activateLasers()}>Activate lasers</button>

                    <button onClick={(e) => addDataToMap(makeKeplerData(SAMPLE_ROWS))}>Increment</button>

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


export default connect(mapStateToProps, mapDispatchToProps)(KeplerView);

