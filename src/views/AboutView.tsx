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
                  <Paragraph>This project is generously funded by the <a href="http://holdsworthtrust.org/">Gerry Holdsworth Special Forces Charitable Trust</a>, and supported by the <a href="http://www.sussex.ac.uk/shl/">Sussex Humanities Lab</a>.</Paragraph>
                      </Col>
                      </Row>

                      </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(AboutView);

