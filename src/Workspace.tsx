import React from 'react';
import { connect } from 'react-redux';
import actionCreators from './action-creators';
import { FullStateTree, IncrementAction } from './interfaces';
import { Formik, Form, Field, FormikProps } from 'formik';
import { TextField } from 'formik-material-ui';
import { MenuItem, Button } from '@material-ui/core';


function mapStateToProps(state: FullStateTree) {
    return {
        counter: state.app.counter
    };
}

const mapDispatchToProps = {
    increment: actionCreators.increment,
    demoQuery: actionCreators.demoQuery
};


interface AppProps {
    counter: number;
    increment: () => IncrementAction;
    demoQuery: () => typeof actionCreators.demoQuery;
}

const ranges = [
    {
        value: 'none',
        label: 'None',
    },
    {
        value: '0-20',
        label: '0 to 20',
    },
    {
        value: '21-50',
        label: '21 to 50',
    },
    {
        value: '51-100',
        label: '51 to 100',
    },
];

interface MyFormProps {
    select: string;
}

const MyFormComponent = (props: FormikProps<MyFormProps>) => {
    return (
        <Form>
            <Field type="text"
                name="select"
                label="With Select"
                select
                variant="standard"
                helperText="Please select Range"
                margin="normal"
                component={TextField}
                InputLabelProps={{
                    shrink: true,
                }}
            >
                {ranges.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </Field>

            <Button variant="contained"
                color="primary"
                onClick={props.submitForm}>
                Stumbit
            </Button>
        </Form>
    );
};


class MyComponent extends React.Component<AppProps> {
    componentDidMount() {
        console.log("component mounted");
    }

    render() {
        return (
            <div>
                <div>
                    <p>Counter value: {this.props.counter}</p>
                    <button onClick={(e) => this.props.increment()}>Increment</button>
                    <button onClick={(e) => this.props.demoQuery()}>Async increment</button>
                </div>

                <Formik initialValues={
                    { select: 'none' }
                } onSubmit={(values) => {
                    console.log("values are %o", values);
                }} component={MyFormComponent}>
                </Formik>

            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(MyComponent);

