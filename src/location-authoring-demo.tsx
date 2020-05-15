import React from 'react';
import {Form, Input, Select} from 'antd';

export function LocationAuthoringDemo() {
    const layout = {
        labelCol: { span: 3 },
        //wrapperCol: { span: 16 },
    };

    return (
        <div>
          <h1>Location authoring demo</h1>

          <Form {...layout}>
            <Form.Item label="Measuring (N)" name="measuringN">
              <Input/>
            </Form.Item>

            <Form.Item label="Relative Loc" name="measuring_n">
              <Input/>
            </Form.Item>

            <Form.Item label="Relation" name="relation">
              <Select>
                <Select.Option value="lt">Less than</Select.Option>
                <Select.Option value="eq">Equal to</Select.Option>
                <Select.Option value="gt">Greater than</Select.Option>
              </Select>
            </Form.Item>


            <Form.Item label="Distance" name="distance">
              <Input/>
            </Form.Item>

            <Form.Item label="Metric" name="metric">
              <Input/>
            </Form.Item>
          </Form>

        </div>
    )
}
