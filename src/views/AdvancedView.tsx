import React from 'react';
import { connect } from 'react-redux';
import actionCreators from '../action-creators';
import { FullStateTree } from '../interfaces';
import { Button, notification } from 'antd';
import singletons from '../singletons';

function mapStateToProps(state: FullStateTree) {
    return {

    };
}

const mapDispatchToProps = {
};


interface AppProps {

}

class AdvancedView extends React.Component<AppProps> {
    handleClick(): void {
        singletons.gateway.clearGraph().then(r => {
            notification.success({
                message: 'Success',
                description: 'Deleted everything.'
            });
        });
    }

    render() {
        return (
            <div>
                <Button onClick={() => this.handleClick()}>Clear graph</Button>
            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(AdvancedView);

