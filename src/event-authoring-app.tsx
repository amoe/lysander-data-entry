import React from 'react';
import {Layout, Row, Col} from 'antd';
import {ThemePanel} from './theme-panel';
const { Header, Footer, Sider, Content } = Layout;

export function EventAuthoringApp() {
    return (
        <Layout>
          <Content>
            <Row>
              <Col span={12} offset={6}>
                <ThemePanel />
              </Col>
            </Row>
          </Content>
        </Layout>
    );
}

