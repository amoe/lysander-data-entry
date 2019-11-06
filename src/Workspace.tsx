import React from 'react';
import { connect } from 'react-redux';
import actionCreators from './action-creators';
import { FullStateTree, IncrementAction } from './interfaces';
import { DatePicker, Select } from 'antd';

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

class MyComponent extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = { secondsElapsed: 0 };
    }

    componentDidMount() {
        window.setInterval(() => this.setState({ secondsElapsed: this.state.secondsElapsed + 1 }), 1000);
    }

    render() {
        return (
            <div>
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

