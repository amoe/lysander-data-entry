import React from 'react';
import {Button, Select, Form, Row, Col, Tooltip} from 'antd';
import {PlusOutlined, RightOutlined, SaveOutlined} from '@ant-design/icons';
import {EventTheme} from './schema';
import {SelectValue} from 'antd/lib/select';
import {Neo4jGateway} from './neo4j-gateway';

export function ThemePanel(
    props: {
        availableThemes: EventTheme[],
        onChange: (value: any) => void,
        onCollapse: () => void,
        collapseEnabled: boolean,
        onSave: () => void,
        newEventEnabled: boolean,
        onNewEvent: () => void
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
            <Tooltip title="Collapse">
              <Button icon={<RightOutlined/>}
                      disabled={!props.collapseEnabled}
                      onClick={props.onCollapse}></Button>
            </Tooltip>

            <Tooltip title="New Event">
              <Button disabled={!props.newEventEnabled}
                      onClick={props.onNewEvent}
                      icon={<PlusOutlined/>}></Button>
            </Tooltip>
            <Tooltip title="Save">
              <Button onClick={props.onSave}
                      icon={<SaveOutlined/>}></Button>
            </Tooltip>
          </Col>
        </Row>
    )
        
}

