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

const availableOptions = [
    { value: "dog", label: "Tyrannosaurus Canis" },
    { value: "cat", label: "Feline" },
    { value: "mouse", label: "Rodent" },
];

const handleSearch = (value: string) => {
    console.log("a search was requested");
    // Here if we wanted to modify stuff we'd need to do some sort of state.
};

type FormProps = FormikProps<MyFormFields>

interface MyFormState {
    availableOptions: any;
}

class MyForm extends React.Component<FormProps, MyFormState> {
    constructor(props: FormProps) {
        super(props);
        this.state = {
            availableOptions: [
                { value: "dog", label: "Tyrannosaurus Canis" },
                { value: "cat", label: "Feline" },
                { value: "mouse", label: "Rodent" },
            ]
        };
    }

    render() {
        return (
            <Form>
                <Input name="firstName" placeholder="First Name" />

                <Select
                    name="select1"
                    showSearch
                    style={{ width: "100%" }}
                    placeholder="Simple select"
                    onSearch={handleSearch}
                    filterOption={true}
                    optionFilterProp="children"
                    onChange={value => {
                        // select allows adding an on change handler
                        // most components do not yet support this
                        console.log("select changed", value);
                    }}
                >
                    {this.state.availableOptions.map(
                        (x: any) => <Select.Option key={x.value} value={x.value}>{x.label}</Select.Option>
                    )}
                </Select>

                <SubmitButton>Stumbit</SubmitButton>
            </Form>
        );
    }
}

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

