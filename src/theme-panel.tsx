import React from 'react';
import {Button, Select, Form, Row, Col} from 'antd';
import {PlusOutlined, RightOutlined, SaveOutlined} from '@ant-design/icons';

export function ThemePanel() {
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
            <Button icon={<RightOutlined/>}></Button>
            <Button icon={<PlusOutlined/>}></Button>
            <Button icon={<SaveOutlined/>}></Button>
          </Col>
        </Row>
    )
        
}

