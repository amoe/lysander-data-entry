import React from 'react';
import {Form, Input} from 'antd';

export function LocationAuthoringDemo() {
    return (
        <div>
          <h1>Location authoring demo</h1>

          <Form>
          <Form.Item label="Username" name="username">
            <Input/>
          </Form.Item>
          </Form>

        </div>
    )
}
