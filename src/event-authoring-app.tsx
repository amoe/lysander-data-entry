import React, {useState, useReducer} from 'react';
import {Layout, Row, Col} from 'antd';
import {ThemePanel} from './theme-panel';
import {SubjectPanel} from './subject-panel';
import {SCHEMA, EventTheme, FieldSpecification} from './schema';
import {Form, Input, Button} from 'antd';
import {Store} from 'antd/lib/form/interface';

const { Header, Footer, Sider, Content } = Layout;

function Field(props: FieldSpecification) {
    return <Form.Item label={props.label}
                      name={props.fieldName}><Input/></Form.Item>
}

const AVAILABLE_THEMES = [
    EventTheme.PERSON, EventTheme.FLIGHT, EventTheme.ORGANIZATION
];

interface AppState {
    allEvents: any[];
}

enum ActionType {
    ADD_EVENT = 'addEvent'
};


type Action = {type: ActionType.ADD_EVENT, event: any};

function reducer(state: AppState, action: Action): AppState {
    switch (action.type) {
        case ActionType.ADD_EVENT:
            return {...state, allEvents: [...state.allEvents, action.event]};
        default:
            throw new Error("no");
    }
}


export function EventAuthoringApp() {
    const [state, dispatch] = useReducer(reducer, {allEvents: []});
    const [selectedTheme, setSelectedTheme] = useState(EventTheme.PERSON);
    const [event, setEvent] = useState({});

    const fields: FieldSpecification[] = SCHEMA[selectedTheme];

    // FIXME type should be Store but not sure where defined?
    // Store is just string->any map anyway.
    function handleFinish(values: Store) {
        console.log("values are %o", values);
        setEvent(values);
        dispatch({type: ActionType.ADD_EVENT, event: values});
    }

    function handleThemeChange(value: any) {
        setSelectedTheme(value);
    }

    return (
        <Layout>
          <Content>
            <Row>
              <Col span={12} offset={6}>
                <ThemePanel onChange={handleThemeChange} 
                            availableThemes={AVAILABLE_THEMES}/>
                <SubjectPanel />

                <Form onFinish={handleFinish}>
                {fields.map(x => <Field key={x.fieldName} {...x}/>)}
                  
                    <Button htmlType="submit">Submit</Button>
                </Form>

                <ul>
                  {state.allEvents.map((x, i) => <li key={i}>{JSON.stringify(x)}</li>)}
                </ul>
              </Col>
            </Row>
          </Content>
        </Layout>
    );
}

