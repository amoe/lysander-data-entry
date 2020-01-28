import React from 'react';
import { Button, PanelHeaderFactory } from 'kepler.gl/components';
import { connect } from 'react-redux';
import { FullStateTree, IncrementAction } from '../interfaces';
import { addDataToMap } from 'kepler.gl/actions';
import actionCreators from '../action-creators';


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



// This needs an object full of action creators.
const mapDispatchToProps = {
    increment: actionCreators.increment,
    addDataToMap
};


class CustomHeaderPrimePrime extends React.Component<AppProps> {
    constructor(props: AppProps) {
        super(props);
        console.log("Props are %o", this.props);
    }

    handleClick() {
        console.log("It was clicked.");
    }
    
    render() {
        console.log("Rendering connected header component.");
        return (<div>
          My kepler.gl app

          <Button onClick={() => this.handleClick()}>Add Data</Button>
          
          <Button onClick={this.props.increment}>Increment</Button>
          Foo
        </div>);
    }	
};

const ConnectedCustomHeaderPrimePrime = connect(mapStateToProps, mapDispatchToProps)(CustomHeaderPrimePrime);

function CustomSidePanelFactory(
    PanelHeader: any
) {
    console.log("Inside connected custom header factory");
    return ConnectedCustomHeaderPrimePrime;
}
        
CustomSidePanelFactory.deps = [
    PanelHeaderFactory
];

export { CustomSidePanelFactory };
