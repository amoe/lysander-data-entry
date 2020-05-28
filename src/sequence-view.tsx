import React, {useState} from 'react';
import {Form, Input, Button} from 'antd';
import {LeftOutlined} from '@ant-design/icons';
import {EventDatum} from './interfaces2';


export function SequenceView(
    props: {allEvents: EventDatum[],
            onExpand: (index: number) => void}) {
    const [sequenceName, setSequenceName] = useState("Untitled sequence" as string | undefined);

    return (
        <div>
          <h1>Sequence</h1>

          <Form.Item label="Sequence name">
            <Input value={sequenceName} onChange={(e) => setSequenceName(e.target.value)}/>
          </Form.Item>

          <ul>
            {props.allEvents.map((event, i) => 
                <li key={i}>
                  <Button icon={<LeftOutlined/>}
                          onClick={(e) => props.onExpand(i)}></Button>
                  
                  <span>2012-01-01</span>
                  <span>{JSON.stringify(event)}</span>
                </li>)}
          </ul>
        </div>
    );
}


