import React from 'react';
import { connect } from 'react-redux';
import actionCreators from '../action-creators';
import { FullStateTree } from '../interfaces';
import { Typography, Divider, Row, Col } from 'antd';
const { Title, Paragraph, Text } = Typography;

function mapStateToProps(state: FullStateTree) {
    return {
    };
}

const mapDispatchToProps = {
};


interface AppProps {
}

class AboutView extends React.Component<AppProps> {
    render() {
        return (
            <div>
                <Title level={2}>About the <cite>Flights of the Lysander</cite> project</Title>

                <Row>
                    <Col span={10}>
                        <Paragraph>Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit. Aliquam in ante ante. Aliquam ultrices mi consequat eros
                          pulvinar, porta ornare odio consequat. Quisque lectus felis,
                          ultricies nec nibh in, blandit ullamcorper enim. Nam vel neque
                          non enim rutrum varius. Suspendisse tempor massa elit, ut
                          tincidunt neque euismod sit amet. Sed fringilla auctor
                          venenatis. Vestibulum eu consectetur quam. Aenean lorem purus,
                    hendrerit ac odio vel, posuere placerat enim.</Paragraph>
                    </Col>
                </Row>

            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(AboutView);

