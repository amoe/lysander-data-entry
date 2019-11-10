import React from 'react';

import { connect } from 'react-redux';
import actionCreators from './action-creators';
import { FullStateTree, IncrementAction } from './interfaces';

import {
    DatePicker,
    Select,
    AutoComplete
} from 'antd';

function mapStateToProps(state: FullStateTree) {
    return {
        counter: state.app.counter
    };
}

const mapDispatchToProps = {
    increment: actionCreators.increment,
};


interface AppProps {
    counter: number;
    increment: () => IncrementAction;
}



function handleSearch(value: string): void {
    console.log("handling a search for value %o", value);
}

interface AppState {
    secondsElapsed: number;
}

const SOME_VALUES = ['fry', 'bender', 'leela'];

class MyComponent extends React.Component<AppProps, AppState> {
    timer: any;

    constructor(props: AppProps) {
        super(props);
        this.state = { secondsElapsed: 0 };
    }

    componentDidMount() {
        const handler = () => this.setState({ secondsElapsed: this.state.secondsElapsed + 1 });
        this.timer = window.setInterval(handler, 1000);
    }

    componentWillUnmount() {
        window.clearInterval(this.timer);
    }

    render() {
        return (
            <div>
                <h1>Antd components</h1>

                <p>These are vanilla antd components, not enhanced ones.</p>

                <p>Autocomplete using array as data source</p>

                <AutoComplete dataSource={SOME_VALUES}></AutoComplete>

                <p>Counter value: {this.props.counter}</p>
                <button onClick={(e) => this.props.increment()}>Increment</button>

                <p>{this.state.secondsElapsed} seconds have elapsed.</p>

                <DatePicker></DatePicker>

                <Select style={{ width: 300 }}
                    showSearch
                    onSearch={handleSearch} >
                    <Select.Option value="jack">Jack</Select.Option>
                    <Select.Option value="lucy">Lucy</Select.Option>
                    <Select.Option value="tom">Tom</Select.Option>
                </Select>
            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(MyComponent);

