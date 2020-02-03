import React from 'react';
import { connect } from 'react-redux';
import { addDataToMap } from 'kepler.gl/actions';
import { FullStateTree, IncrementAction } from '../interfaces';
import actionCreators from '../action-creators';
import { SidebarFactory, RangeSlider, TimeSliderMarker } from 'kepler.gl/components';
import throttle from 'lodash.throttle';

function mapStateToProps(state: FullStateTree) {
    return {
        counter: state.app.counter
    };
}

interface AppProps {
    counter: number;
    increment: () => IncrementAction;
    addDataToMap: typeof addDataToMap;
}

const mapDispatchToProps = {
    increment: actionCreators.increment,
    addDataToMap
};


function CustomTimeRangeSliderFactory(
    Sidebar: any
) {
    return connect(mapStateToProps, mapDispatchToProps)(
        class CustomTimeRangeSlider extends React.Component<any, any> {
            _sliderThrottle: any;

            _sliderUpdate = (args: any) => {
                this._sliderThrottle.cancel();
                this._sliderThrottle(args);
            };

            constructor(props: any) {
                super(props);
                console.log("inside constructor");
                this._sliderThrottle = throttle(
                    (...value: any[]) => this.props.onChange(...value),
                    20
                );

            }

            componentDidMount() {
            }

            
            render() {
                const { domain, value, isEnlarged } = this.props;

                return (
                    <div>
                    <h1>CustomTimeRangeSliderFactory</h1>

                    <RangeSlider range={domain}
                                 value0={value[0]}
                                 value1={value[1]}
                                 histogram={this.props.histogram}
                                 lineChart={this.props.lineChart}
                                 plotType={this.props.plotType}
                                 isEnlarged={isEnlarged}
                                 showInput={false}
                                 step={this.props.step}
                                 onChange={this._sliderUpdate}
                                 xAxis={TimeSliderMarker}
                    />
                    </div>
                );
            }
        }
    );
}

CustomTimeRangeSliderFactory.deps = [
    SidebarFactory
];

export { CustomTimeRangeSliderFactory };
