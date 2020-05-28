import React, {useState} from 'react';
import {Form, Input, Button} from 'antd';
import {LeftOutlined} from '@ant-design/icons';


export function SequenceView(props: {allEvents: any[], onExpand: (index: number) => void}) {
    const [sequenceName, setSequenceName] = useState("Untitled sequence" as string | undefined);

    return (
        <div>
          <h1>Sequence</h1>

          <Form.Item label="Sequence name">
            <Input value={sequenceName} onChange={(e) => setSequenceName(e.target.value)}/>
          </Form.Item>

          <ul>
            {props.allEvents.map((x, i) => 
                <li key={i}>
                  <Button icon={<LeftOutlined/>}
                          onClick={(e) => props.onExpand(i)}></Button>
                  {JSON.stringify(x)}
                </li>)}
          </ul>
        </div>
    );
}


