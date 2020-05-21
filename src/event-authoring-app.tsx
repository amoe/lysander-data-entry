import React, {useState} from 'react';
import {Layout, Row, Col} from 'antd';
import {ThemePanel} from './theme-panel';
import {SubjectPanel} from './subject-panel';
import {SCHEMA, Entity, FieldSpecification} from './schema';
import {Form, Input, Button} from 'antd';
import {Store} from 'antd/lib/form/interface';

const { Header, Footer, Sider, Content } = Layout;

function Field(props: FieldSpecification) {
    return <Form.Item label={props.label}
                      name={props.fieldName}><Input/></Form.Item>
}

const AVAILABLE_THEMES = [Entity.PERSON];



export function EventAuthoringApp() {
    const [selectedTheme, setSelectedTheme] = useState(Entity.PERSON);
    const [event, setEvent] = useState({});

    const fields: FieldSpecification[] = SCHEMA[selectedTheme];

    // FIXME type should be Store but not sure where defined?
    // Store is just string->any map anyway.
    function handleFinish(values: Store) {
        console.log("values are %o", values);
        setEvent(values);
    }

    return (
        <Layout>
          <Content>
            <Row>
              <Col span={12} offset={6}>
                <ThemePanel availableThemes={AVAILABLE_THEMES}/>
                <SubjectPanel />

                <Form onFinish={handleFinish}>
                {fields.map(x => <Field key={x.fieldName} {...x}/>)}
                  
                    <Button htmlType="submit">Submit</Button>
                </Form>
              </Col>
            </Row>
          </Content>
        </Layout>
    );
}

