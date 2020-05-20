import React from 'react';
import {Button, Layout, Select, Form, Row, Col} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {LoremIpsum} from './lorem-ipsum';
const { Header, Footer, Sider, Content } = Layout;

function Foo() {
    return (
        <Row>
          <Col span={12}>
            <Form.Item label="Theme">
              <Select>
                <Select.Option value="lt">Event</Select.Option>
                <Select.Option value="eq">Person</Select.Option>
                <Select.Option value="gt">Organization</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6} offset={3}>
            <Button icon={<PlusOutlined/>}></Button>
          </Col>
        </Row>
    )
        
}

function Bar() {
    return (
        <Row>
          <Col span={12}>
            <LoremIpsum/>
          </Col>
          <Col span={12}>
            <LoremIpsum/>
          </Col>
        </Row>
    );
}

export function ThemePanel() {
    return (
        <Layout>
          <Content>
            <Row>
              <Col span={12} offset={6}>
                <Foo />
              </Col>
            </Row>
          </Content>
        </Layout>
    );
}

