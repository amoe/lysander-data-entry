import React from 'react';
import {Button} from 'antd';
import {PlusOutlined} from '@ant-design/icons';

export function ThemePanel() {
    return (
        <div>
          <h1>My Component</h1>

          <Button icon={<PlusOutlined/>}></Button>
        </div>
    );
}

