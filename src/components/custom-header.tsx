import React from 'react';
import { Button } from 'kepler.gl/components';

export class CustomHeader extends React.Component {
    handleClick() {
        console.log("It was clicked.");
    }
    
    render() {
        return (<div>
          My kepler.gl app
          <Button onClick={() => this.handleClick()}>Add Data</Button>
          Foo
        </div>);
    }	
};
