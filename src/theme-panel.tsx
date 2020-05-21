import React from 'react';
import {Button, Select, Form, Row, Col} from 'antd';
import {PlusOutlined, RightOutlined, SaveOutlined} from '@ant-design/icons';
import {Entity} from './schema';
import {SelectValue} from 'antd/lib/select';

export function ThemePanel(
    props: {
        availableThemes: Entity[],
        onChange: (value: any) => void
    }
) {
    return (
        <Row>
          <Col span={12}>
            <Form.Item label="Theme">
              <Select onChange={props.onChange}>
                {props.availableThemes.map((x, i) => <Select.Option key={i} value={x}>{x}</Select.Option>)}
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

