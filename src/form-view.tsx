import React from 'react';
import {Form, Button, Input} from 'antd';
import {FieldSpecification} from './schema';
import {Store} from 'antd/lib/form/interface';
import {FormInstance} from 'antd/lib/form';


function Field(props: FieldSpecification) {
    return <Form.Item label={props.label}
                      name={props.fieldName}><Input/></Form.Item>
}

export function FormView(
    props: {
        fields: FieldSpecification[],
        onFinish: (values: Store) => void,
        form: FormInstance
    }
) {
    return (
        <Form onFinish={props.onFinish} form={props.form}>
          {props.fields.map(x => <Field key={x.fieldName} {...x}/>)}
          
          <Button htmlType="submit">Submit</Button>
        </Form>
    );
}

