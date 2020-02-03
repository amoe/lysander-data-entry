import React from 'react';
import { connect } from 'react-redux';
import { addDataToMap } from 'kepler.gl/actions';
import { FullStateTree, IncrementAction } from '../interfaces';
import actionCreators from '../action-creators';
import { SidebarFactory, Histogram, RangeBrush, RangeSlider, RangePlot } from 'kepler.gl/components';

//import { RangePlot } from 'kepler.gl/components/common/range-plot';

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


function RangeBrushUserFactory(
    Sidebar: any
) {
    return connect(mapStateToProps, mapDispatchToProps)(
        class RangeBrushUserFactory extends React.Component<any, any> {
            constructor(props: any) {
                super(props);
                console.log("inside constructor");
                console.log("The value of Histogram is %o", Histogram);
                console.log("The value of RangeBrush is %o", RangeBrush);
                console.log("The value of RangePlot is %o", RangePlot);
                console.log("The value of RangeSlider is %o", RangeSlider);
                console.log("The value of SidebarFactory is %o", SidebarFactory);
            }

            componentDidMount() {
            }

            
            render() {
                return (
                    <div>
                      <h1>RangeBrushUserFactory</h1>
                    </div>
                );
            }
        }
    );
}

RangeBrushUserFactory.deps = [
    SidebarFactory
];

export { RangeBrushUserFactory };
