import React from 'react';
import {Button, Layout, Select, Form, Row, Col} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {LoremIpsum} from './lorem-ipsum';
const { Header, Footer, Sider, Content } = Layout;

function Foo() {
    return (
        <div>
        <Form.Item label="Theme">
          <Select>
            <Select.Option value="lt">Event</Select.Option>
            <Select.Option value="eq">Person</Select.Option>
            <Select.Option value="gt">Organization</Select.Option>
          </Select>
        </Form.Item>
        <Button icon={<PlusOutlined/>}></Button>
        </div>
    )
        
}

export function ThemePanel() {
    return (
        <Layout>
          <Content>
            <Row>
              <Col span={12} offset={6}>
                <LoremIpsum />
              </Col>
            </Row>
          </Content>
        </Layout>
    );
}

