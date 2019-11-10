import React from 'react';
import { connect } from 'react-redux';
import actionCreators from './action-creators';
import { FullStateTree, IncrementAction } from './interfaces';
import { Button, notification } from 'antd';
import { Formik, FormikProps } from 'formik';
import { KNOWN_LZ } from './known-lz';
import { Typography, Layout, Menu } from 'antd';
import singletons from './singletons';
import {
    Form, Input, InputNumber, Checkbox, SubmitButton, Select,
    AutoComplete
} from "formik-antd";

const { Header, Footer, Sider, Content } = Layout;


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
                <h2>LZ codename</h2>

                <AutoComplete name="lz0" dataSource={KNOWN_LZ}></AutoComplete>

                <h2>Coordinates</h2>

                <Input name="coordinates"></Input>

                <h2>Freetext search</h2>

                <Input name="freetextLocation"></Input>

                <SubmitButton>Stumbit</SubmitButton>
            </Form>
        );
    }
}

function addLocation() {
    console.log("I would add a location");

    singletons.gateway.addDummyLocation().then(r => {
        notification.open({
            message: 'Notification Title',
            description: 'This is the content of the notification.',
            onClick: () => {
                console.log('Notification Clicked!');
            }
        })
    });
}

// The codesandbox for formik/antd is available here

class MyComponent extends React.Component<AppProps> {
    render() {
        return (
            <div>
                <Layout className="layout">

                    <Header>
                        <div className="logo" />
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            defaultSelectedKeys={['2']}
                            style={{ lineHeight: '64px' }}
                        >
                            <Menu.Item key="1">nav 1</Menu.Item>
                            <Menu.Item key="2">nav 2</Menu.Item>
                            <Menu.Item key="3">nav 3</Menu.Item>
                        </Menu>
                    </Header>
                    <Content>
                        <Button onClick={addLocation}>Add a location</Button>

                        <Formik initialValues={{ firstName: "" }}
                            onSubmit={(values) => { console.log(values); }}
                            component={MyForm}
                        />
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>Lysander Project 2019</Footer>
                </Layout>
            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(MyComponent);

