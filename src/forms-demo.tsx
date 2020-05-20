import React from 'react';
import {Form, Input, Select} from 'antd';


export function FormsDemo() {
    const layout = {
        labelCol: { span: 3 },
        //wrapperCol: { span: 16 },
    };

    return (
        <div>
          <h1>Forms demo</h1>
          <Form {...layout}>


            <Form.Item label="Notes" name="notes"><Input/></Form.Item>
            <Form.Item label="Quotes" name="quotes"><Input/></Form.Item>
            <Form.Item label="Source" name="source"><Input/></Form.Item>


            <Form.Item label="Measuring (N)" name="measuringN"><Input/></Form.Item>
            <Form.Item label="Relative Loc" name="relativeLoc"><Input/></Form.Item>
            <Form.Item label="Relation" name="relation">
              <Select>
                <Select.Option value="lt">Less than</Select.Option>
                <Select.Option value="eq">Equal to</Select.Option>
                <Select.Option value="gt">Greater than</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="Distance" name="distance"><Input/></Form.Item>
            <Form.Item label="Metric" name="metric"><Input/></Form.Item>
          </Form>
        </div>
    );
}
