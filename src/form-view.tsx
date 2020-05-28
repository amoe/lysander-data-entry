import React from 'react';
import {Form, Button, Input, Select} from 'antd';
import {FieldSpecification, FieldType} from './schema';
import {Store} from 'antd/lib/form/interface';
import {FormInstance} from 'antd/lib/form';
import {PlusOutlined} from '@ant-design/icons';

function FieldWidget(props: FieldSpecification) {
    console.log("field type is %o", props.typeSpec.fieldType);
    switch (props.typeSpec.fieldType) {
        case FieldType.INPUT:
            return (<Input/>);
        case FieldType.SELECT:
            return (<Select style={{width: '100%'}} 
                            options={props.typeSpec.options.map(x => ({value: x}))}/>);
        default:
            throw new Error("not implemented");
    }
}


function Field(props: FieldSpecification) {
    return <Form.Item label={props.label}
                      name={props.fieldName}><FieldWidget {...props}/></Form.Item>
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

