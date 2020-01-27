import React from 'react';
import { connect } from 'react-redux';
import { FullStateTree, IncrementAction } from '../interfaces';
//import KeplerGl from 'kepler.gl';
import { injectComponents, PanelHeaderFactory } from 'kepler.gl/components';
import { addDataToMap } from 'kepler.gl/actions';
import actionCreators from '../action-creators';
import singletons from '../singletons';
import { Button, notification, Row, Col, Divider } from 'antd';

const CustomHeader = () => (<div>My kepler.gl app</div>);

const myCustomHeaderFactory = () => CustomHeader;


const KeplerGl = injectComponents([
    [PanelHeaderFactory, myCustomHeaderFactory]
]);


const DATASET_NAME = 'Lysander Flights';
const ARC_NAME = 'LysanderArc1';

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
            { name: 'flight_datetime', format: 'YYYY-M-D H:m:s', type: 'timestamp' },
            { name: 'start_longitude', format: '', type: 'real' },
            { name: 'start_latitude', format: '', type: 'real' },
            { name: 'end_longitude', format: '', type: 'real' },
            { name: 'end_latitude', format: '', type: 'real' }
        ],
        rows: rows
    };
}


const myArc = {
    "id": "zslehy",
    "type": "arc",
    "config": {
        "dataId": "test_trip_data",
        "label": ARC_NAME,
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
                label: DATASET_NAME,
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


const TANGMERE_LONGITUDE = -0.7063888888888888;
const TANGMERE_LATITUDE = 50.84583333333333;


class KeplerView extends React.Component<AppProps> {
    renderLocations() {
        singletons.gateway.retrieveLocations().then(r => {
            console.log("record count is ", r.records.length);
            const count = r.records.length;

            if (count === 0) {
                notification.error({
                    message: 'Error',
                    description: 'No locations found.'
                });
            }

            const newRows = r.records.map(x => {
                return [
                    '1940-01-01 08:30:00 +00:00',
                    TANGMERE_LONGITUDE,
                    TANGMERE_LATITUDE,
                    x.get('longitude'),
                    x.get('latitude')
                ];
            });

            console.log("row values are %o", newRows);

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

        const width = 1280;
        const height = 720;

        const keplerConfig = {
            appName: "LYSANDER"
            // Can't use the light theme at present because it causes
            // the map tiles to break.
//            theme: "light"
        };

        // I am about to press TAB.
        // Why did it move here?
        // oh I see, it has a lisp-style indentation strategy.

        return (
            <div>
                <p>If only the control pane displays below, and the map does not
                display, check your internet connection.</p>

                <Button onClick={() => this.renderLocations()}>Render locations</Button>

                <Divider />


                <Row>
                    <Col span={10} offset={2}>
                        <KeplerGl id="foo"
                                  mapboxApiAccessToken={token}
                                  appName="LYSANDER"
                                  width={width}
                                  height={height}
                                  {...keplerConfig}/>
                    </Col>
                </Row>
            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(KeplerView);

