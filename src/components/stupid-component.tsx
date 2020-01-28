import React from 'react';
import {Button} from 'kepler.gl/components';
import mockdata from '../mockdata';
import {addDataToMap} from 'kepler.gl/actions';


export class StupidComponent extends React.Component<any> {
    constructor(props: any) {
        super(props);
        console.log("I was instantiated with props %o", Object.keys(this.props));
        console.log("I was instantiated with props %o", this.props);
    }

    respond() {
        console.log("Button was clicked");
        this.props.addDataToMap(mockdata);
    }

    render() {
        return (<div>
                <h1>Tan blonde</h1>
                <Button onClick={this.respond.bind(this)}>Do a thing</Button>
                </div>);
    }
}
