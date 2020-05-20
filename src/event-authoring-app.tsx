import React from 'react';
import {Layout, Row, Col} from 'antd';
import {ThemePanel} from './theme-panel';
import {SubjectPanel} from './subject-panel';
const { Header, Footer, Sider, Content } = Layout;

export function EventAuthoringApp() {
    return (
        <Layout>
          <Content>
            <Row>
              <Col span={12} offset={6}>
                <ThemePanel />
                <SubjectPanel />
              </Col>
            </Row>
          </Content>
        </Layout>
    );
}

