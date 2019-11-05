import React from 'react';
import singletons from './singletons';

interface AppProps {
}

class Workspace extends React.Component<AppProps> {
    componentDidMount() {
        console.log("component mounted");
        singletons.gateway.basicDemo().then(r => {
            console.log(r.records[0].get('x'));
        });
    }

    componentWillUnmount() {
        console.log("component unmounted");
    }

    render() {
        return (
            <div>
                <p>Counter value: 0</p>
            </div>
        );
    }
}

export default Workspace;
