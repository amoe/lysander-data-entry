import React, { useState } from 'react';
import { Form, Input, Select, Button } from 'antd';
import {Store} from 'antd/lib/form/interface';

const { Option } = Select;

interface PriceValue {
    number?: number;
    currency?: 'rmb' | 'dollar';
}

interface PriceInputProps {
    value?: number;
    onChange?: (value: number) => void;
}

const PriceInput: React.FC<PriceInputProps> = ({ value = {}, onChange }) => {
    const [number, setNumber] = useState(0);

    const triggerChange = (changedValue: any) => {
        if (onChange) {
            onChange(changedValue);
        }
    };

    const onNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newNumber = parseInt(e.target.value, 10);
        if (Number.isNaN(number)) {
            return;
        }
        setNumber(newNumber);
        triggerChange(newNumber);
    };

    return (
        <span>
          <Input type="text"
                 value={number}
                 onChange={onNumberChange}
                 style={{ width: 100 }}
          />
        </span>
    );
};

export const CustomizedFormControls = () => {
    const onFinish = (values: Store) => {
        console.log('Received values from form: ', values);
    };

    return (
        <Form
            name="customized_form_controls"
            layout="inline"
            onFinish={onFinish}
            initialValues={{
                price: {
                    number: 0,
                    currency: 'rmb',
                },
            }}
        >
          <Form.Item name="price" label="Price">
            <PriceInput />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
    );
};
