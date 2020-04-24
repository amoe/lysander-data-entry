import React from 'react';
import { connect } from 'react-redux';
import actionCreators from '../action-creators';
import { FullStateTree } from '../interfaces';
import { Button, notification, Typography, List } from 'antd';
import singletons from '../singletons';

const { Title, Paragraph } = Typography;

function mapStateToProps(state: FullStateTree) {
    return {

    };
}

const mapDispatchToProps = {
};


interface AppProps {

}

interface AppState {
    groupLinkages: any[];
}

class AdvancedView extends React.Component<AppProps, AppState> {
    constructor(props: any) {
        super(props);
        this.state = {
            groupLinkages: []
        };
    }


    componentDidMount() {
        singletons.gateway.getGroupLinkages().then(r => {
            this.setState({groupLinkages: r.records.map(r => r.toObject())})
        });
    }

    handleClick(): void {
        singletons.gateway.clearGraph().then(r => {
            notification.success({
                message: 'Success',
                description: 'Deleted everything.'
            });
        });
    }

    render() {
        console.log("advanced view");

        return (
            <div>
              <Title level={2}>Advanced tools</Title>

              <Paragraph>
                Number of group linkages: {this.state.groupLinkages.length}
              </Paragraph>


              <List dataSource={this.state.groupLinkages}
                    renderItem={r => (
                        <List.Item>{r.n1.properties.lastNameTillet} -> {r.n2.properties.name}</List.Item>
                    )}
              />,


            <Paragraph>These buttons allow direct manipulation of the graph.</Paragraph>

            <Button disabled onClick={() => this.handleClick()}>Clear graph</Button>
            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(AdvancedView);

