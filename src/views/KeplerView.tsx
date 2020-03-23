import React from 'react';
import { connect } from 'react-redux';
import { FullStateTree, IncrementAction } from '../interfaces';
import {
    injectComponents, SidePanelFactory, TimeRangeSliderFactory, KeplerGlFactory
} from 'kepler.gl/components';

import { addDataToMap } from 'kepler.gl/actions';
import actionCreators from '../action-creators';
import singletons from '../singletons';
import { Button, notification, Row, Col, Divider } from 'antd';

import {
    QueryBuilderPanelFactory,
} from '../components/query-builder-panel';
//import { CustomTimeRangeSliderFactory } from '../components/custom-time-range-slider';
//import { SimpleHistogramUserFactory } from '../components/simple-histogram-user';
//import { RangeBrushUserFactory } from '../components/range-brush-user';

import mockdata from '../mockdata';


const KeplerGl = injectComponents([
    [SidePanelFactory, QueryBuilderPanelFactory],
    //    [TimeRangeSliderFactory, CustomTimeRangeSliderFactory]
//    [TimeRangeSliderFactory, SimpleHistogramUserFactory],
//    [KeplerGlFactory, RangeBrushUserFactory]
]);

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

// Combined props from mapState & mapDispatch
interface AppProps {
    counter: number;
    increment: () => IncrementAction;
    addDataToMap: typeof addDataToMap;
}

const TANGMERE_LONGITUDE = -0.7063888888888888;
const TANGMERE_LATITUDE = 50.84583333333333;

class KeplerView extends React.Component<AppProps> {
    render() {
        // Destructure the props which are now typed by the <T> above.
        // increment should now dispatch an increment action

        // MAKE SURE YOU USE THE VERSION FROM PROPS!
        // if you just call the action creator that's imported, then stuff will
        // just silently die.
        const { counter, addDataToMap } = this.props;
        addDataToMap(mockdata);

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
                <p>If only the control pane displays below, and the map itself does not
                display, check your internet connection.</p>

                <p>Current counter value is {counter}</p>
                <Button onClick={this.props.increment}>Increment counter</Button>
                <Button disabled onClick={() => this.props.addDataToMap(mockdata)}>Add mock data</Button>

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

