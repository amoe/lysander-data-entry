import React from 'react';
import { connect } from 'react-redux';
import actionCreators from './action-creators';
import { FullStateTree, IncrementAction } from './interfaces';

import { Formik, FormikProps } from 'formik';
import { Form, Input, InputNumber, Checkbox, SubmitButton, Select } from "formik-antd";

function mapStateToProps(state: FullStateTree) {
    return {
        counter: state.app.counter
    };
}

const mapDispatchToProps = {
    increment: actionCreators.increment,
};


interface AppProps {
    counter: number;
    increment: () => IncrementAction;
}

interface MyFormFields {
    firstName: string;
}

const MyForm = (props: FormikProps<MyFormFields>) => {
    return (
        <Form>
            <Input name="firstName" placeholder="First Name" />

            <Select
                name="select1"
                showSearch
                style={{ width: "100%" }}
                placeholder="Simple select"
                onChange={value => {
                    // select allows adding an on change handler
                    // most components do not yet support this
                    console.log("select changed", value);
                }}
            >
                <Select.Option value={1}>item 1</Select.Option>
                <Select.Option value={2}>item 2</Select.Option>
                <Select.Option value={3}>item 3</Select.Option>
            </Select>

            <SubmitButton />
        </Form>
    );
};

// The codesandbox for formik/antd is available here

class MyComponent extends React.Component<AppProps> {
    render() {
        return (
            <div>
                <h2>Formik/Antd demo</h2>


                <Formik initialValues={{ firstName: "" }}
                    onSubmit={(values) => { console.log(values); }}
                    component={MyForm}
                />
            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(MyComponent);

