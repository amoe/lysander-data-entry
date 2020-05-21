import React, {useState} from 'react';
import {Input, Row, Form, Col, AutoComplete} from 'antd';

export function SubjectPanel() {
    const availableDates = [
        {value: '1939-01-01'},
        {value: '1940-01-01'},
        {value: '1940-06-01'}
    ];
    const [selectedDate, setSelectedDate] = useState(undefined as string | undefined);

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
              <Form.Item label="Pilot Name" name="pilotName"><Input/></Form.Item>
            </Col>
          </Row>
        </Form>
    );
}

