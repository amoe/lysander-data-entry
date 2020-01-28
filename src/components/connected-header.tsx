import React from 'react';
import { Button } from 'kepler.gl/components';
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


export class CustomHeaderPrime extends React.Component<AppProps> {
    handleClick() {
        console.log("It was clicked.");
    }
    
    render() {
        console.log("Rendering connected header component.");
        console.log("Props are %o", this.props.increment);
        return (<div>
          My kepler.gl app

          <Button onClick={() => this.handleClick()}>Add Data</Button>
          
          <Button onClick={this.props.increment}>Increment</Button>
          Foo
        </div>);
    }	
};


export default connect(mapStateToProps, mapDispatchToProps)(CustomHeaderPrime);
