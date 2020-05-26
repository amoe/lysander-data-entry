import React, {useState} from 'react';
import {Input, Row, Form, Col, AutoComplete} from 'antd';
import {EntityCache} from './interfaces2';

function toOptions(x: any): any {
    return x.map((y: any) => ({value: y.firstName + " " + y.lastName}));
}

export function SubjectPanel(
    props: {entityCache: EntityCache},
) {
    const availableDates = [
        {value: '1939-01-01'},
        {value: '1940-01-01'},
        {value: '1940-06-01'}
    ];

    const [selectedDate, setSelectedDate] = useState(undefined as string | undefined);
    const [selectedPilotName, setSelectedPilotName] = useState(undefined as string | undefined);

    const handlePilotNameChange = (data: string) => {
        setSelectedPilotName(data);
    }

    const handleChange = (data: string) => {
        console.log("selected is %o", data);
        setSelectedDate(data);
    };

    return (
        <Form layout="horizontal">
          <Row>
            <Col span={12}>
              <AutoComplete placeholder="Date" 
                            options={availableDates}
                            value={selectedDate}
                            onChange={handleChange}></AutoComplete>
            </Col>

            <Col span={12}>
              <AutoComplete placeholder="Pilot Name"
                            onChange={handlePilotNameChange}
                            value={selectedPilotName}
                            options={toOptions(props.entityCache.pilots)}></AutoComplete>
            </Col>
          </Row>
        </Form>
    );
}

