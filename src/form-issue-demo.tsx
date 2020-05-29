import React from 'react';
import {Form, Input, Button} from 'antd';
import {Store} from 'antd/lib/form/interface';

function Widget1() {
    return <Input/>;
}

function Widget2() {
    return <Input/>;
}

export function FormIssueDemo() {
    const [form] = Form.useForm();

    const handleFinish = (values: Store) => {
        alert("Status value 1 is " + values.status1);
        alert("Status value 2 is " + values.status2);
    };

    return (
        <div>
          <Form form={form} onFinish={handleFinish}>
            <Form.Item label="Status1" name="status1">
              <Input/>
            </Form.Item>

            <Form.Item label="Status2" name="status2">
              <Widget1/>
            </Form.Item>

            <Button htmlType="submit">Submit</Button>
          </Form>
        </div>

    );
}

