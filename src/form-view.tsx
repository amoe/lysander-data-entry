import React from 'react';
import {Form, Button, Input, Select} from 'antd';
import {FieldSpecification, FieldType} from './schema';
import {Store} from 'antd/lib/form/interface';
import {FormInstance} from 'antd/lib/form';
import {PlusOutlined} from '@ant-design/icons';

function FieldWidget(props: {
    spec: FieldSpecification, value?: any, onChange?: (newValue: any) => void
}) {
    switch (props.spec.typeSpec.fieldType) {
        case FieldType.INPUT:
            return (
                <Input value={props.value}
                       onChange={e => props.onChange && props.onChange(e.target.value)}/>
            );
        case FieldType.SELECT:
            // select has different api and onchange event uses the actual value instead.
            return (<Select style={{width: '100%'}} 
                     value={props.value}
                     onChange={(v) => props.onChange && props.onChange(v)}
                     options={props.spec.typeSpec.options.map(x => ({value: x}))}/>);
        default:
            throw new Error("foo");
    }
}
            

function SomeFieldWidget() {
    return (<Input/>);
}

function Field(props: FieldSpecification) {
    return (
        <Form.Item label={props.label}
                   name={props.fieldName}>
          <FieldWidget spec={props}/>
        </Form.Item>
    );
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
          
          <Button htmlType="submit" icon={<PlusOutlined/>}></Button>
        </Form>
    );
}

