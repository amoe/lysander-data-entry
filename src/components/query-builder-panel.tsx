import React from 'react';
import { connect } from 'react-redux';
import { FullStateTree, IncrementAction } from '../interfaces';
import { addDataToMap } from 'kepler.gl/actions';
import { Button, SidebarFactory } from 'kepler.gl/components';
import actionCreators from '../action-creators';
import mockdata from '../mockdata';

function mapStateToProps(state: FullStateTree) {
    return {
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


function QueryBuilderPanelFactory(
    Sidebar: any
) {
    return connect(mapStateToProps, mapDispatchToProps)(
        class extends React.Component<any> {
            onClick() {
                this.props.addDataToMap(mockdata);
            }
            
            render() {
                return (
                    <div>
                      <Sidebar width={300}
                               isOpen={true}
                               minifiedWidth={0}>
                        <Button onClick={this.onClick.bind(this)}>Stumbit</Button>
                      </Sidebar>
                    </div>
                );
            }
        }
    );
}

QueryBuilderPanelFactory.deps = [
    SidebarFactory
];

export { QueryBuilderPanelFactory };
