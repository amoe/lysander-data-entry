import React from 'react';
import { connect } from 'react-redux';
import actionCreators from '../action-creators';
import { FullStateTree, IncrementAction } from '../interfaces';
import { Button, notification } from 'antd';
import { Formik, FormikProps } from 'formik';
import { KNOWN_LZ } from '../known-lz';
import { Typography, Layout, Menu } from 'antd';
import singletons from '../singletons';
import axios from 'axios';
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

interface MyComponentState {
    tilletData: object[],
    coordinates: any
}

class MyComponent extends React.Component<AppProps, MyComponentState> {
    constructor(props: AppProps) {
        super(props);
        this.state = { tilletData: [], coordinates: null };
    }

    componentDidMount() {
        console.log("mount hook");
        axios.get("/sensitive/tillet_converted.json").then(r => {
            console.log("win", r.data);
            this.setState({ tilletData: r.data });
        }).catch(e => {
            console.log("lose");
        });;

        axios.get("/sensitive/parsed_sparse_coordinates.json").then(r => {
            console.log("got psc");
            this.setState({ coordinates: r.data });
        }).catch(e => {
            console.log("failed to get psc");
        });
    }


    render() {
        return (
            <div>
                <Button onClick={addLocation}>Add a location</Button>

                <Formik initialValues={{ firstName: "" }}
                    onSubmit={(values) => { console.log(JSON.stringify(values)); }}
                    component={MyForm}
                />
            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(MyComponent);

