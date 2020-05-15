import React from 'react';
import {Form, Input} from 'antd';

export function LocationAuthoringDemo() {
    const layout = {
        //labelCol: { span: 8 },
        //wrapperCol: { span: 16 },
    };

    return (
        <div>
          <h1>Location authoring demo</h1>

          <Form {...layout}>
            <Form.Item label="Username" name="username">
              <Input/>
            </Form.Item>
          </Form>

        </div>
    )
}
