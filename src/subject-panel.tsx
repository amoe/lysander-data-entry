import React, {useState} from 'react';
import {Input, Row, Form, Col, AutoComplete} from 'antd';
import {EntityCache, SubjectData} from './interfaces2';

function toOptions(x: any): any {
    return x.map((y: any) => ({value: y.firstName + " " + y.lastName}));
}

export function SubjectPanel(
    props: {entityCache: EntityCache, onChange: Function, value: SubjectData},
) {
    const availableDates = [
        {value: '1939-01-01'},
        {value: '1940-01-01'},
        {value: '1940-06-01'}
    ];

    return (
        <Form layout="horizontal">
          <Row>
            <Col span={12}>
              <Form.Item label="Date">
              <AutoComplete style={{width: '100%'}}
                            options={availableDates}
                            value={props.value.date}
                            onChange={x => props.onChange({...props.value, date: x})}></AutoComplete>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Pilot Name">
              <AutoComplete onChange={x => props.onChange({...props.value, pilotName: x})}
                            value={props.value.pilotName}
                            options={toOptions(props.entityCache.pilots)}></AutoComplete>
              </Form.Item>
            </Col>
          </Row>
        </Form>
    );
}

