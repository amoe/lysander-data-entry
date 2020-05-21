import React, {useState} from 'react';
import {Layout, Row, Col} from 'antd';
import {ThemePanel} from './theme-panel';
import {SubjectPanel} from './subject-panel';
import {SCHEMA, Entity, FieldSpecification} from './schema';
import {Form, Input} from 'antd';
const { Header, Footer, Sider, Content } = Layout;


function Field(props: FieldSpecification) {
    return <Form.Item label={props.label} name={props.fieldName}><Input/></Form.Item>
}

export function EventAuthoringApp() {
    const [selectedTheme, setSelectedTheme] = useState(Entity.PERSON);

    const fields: FieldSpecification[] = SCHEMA[selectedTheme];

    return (
        <Layout>
          <Content>
            <Row>
              <Col span={12} offset={6}>
                <ThemePanel />
                <SubjectPanel />

                {fields.map(x => <Field {...x}/>)}
              </Col>
            </Row>
          </Content>
        </Layout>
    );
}

