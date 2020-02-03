import React from 'react';
import { connect } from 'react-redux';
import { addDataToMap } from 'kepler.gl/actions';
import { FullStateTree, IncrementAction } from '../interfaces';
import actionCreators from '../action-creators';
import { SidebarFactory, Histogram, RangeBrush } from 'kepler.gl/components';

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


function SimpleHistogramUserFactory(
    Sidebar: any
) {
    return connect(mapStateToProps, mapDispatchToProps)(
        class SimpleHistogramUser extends React.Component<any, any> {
            constructor(props: any) {
                super(props);
                console.log("inside constructor");
            }

            componentDidMount() {
            }

            
            render() {
                const { histogram, value } = this.props;


                const chartMargin = {top: 8, bottom: 0, left: 0, right: 0};

                const brushComponent = () => (
                    <div>
                      <h1>RangeBrush would normally go here</h1>
                    </div>
                )

                console.log("Histogram is %o", histogram);
                console.log("Value is %o", value);
                console.log("Brushcomponent is %o", brushComponent);

                
                return (
                    <div>
                      <h1>SimpleHistogramUser</h1>
                      
                      <Histogram histogram={histogram}
                                 value={value}
                                 width={704}
                                 height={52}
                                 brushComponent={brushComponent}
                                 margin={chartMargin}>
                      </Histogram>
                    </div>
                );
            }
        }
    );
}

SimpleHistogramUserFactory.deps = [
    SidebarFactory
];

export { SimpleHistogramUserFactory };
