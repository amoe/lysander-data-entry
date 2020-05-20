import React from 'react';
import {Input, Row, Form, Col} from 'antd';

export function SubjectPanel() {
    return (
        <Form layout="horizontal">
          <Row>
            <Col span={12}>
              <Form.Item label="Date" name="date"><Input/></Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Pilot Name" name="pilotName"><Input/></Form.Item>
            </Col>
          </Row>
        </Form>
    );
}

