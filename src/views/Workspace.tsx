import React from 'react';
import { connect } from 'react-redux';
import actionCreators from '../action-creators';
import { FullStateTree } from '../interfaces';
import { Select } from 'antd';
import axios from 'axios';
import { Button } from 'antd';
import singletons from '../singletons';
import { notification } from 'antd';

function mapStateToProps(state: FullStateTree) {
    return {
    };
}

const mapDispatchToProps = {
};


interface AppProps {

}

interface AppState {
    tilletData: any;
    coordinates: any;
    selectedOption: string;
}

class MyComponent extends React.Component<AppProps, AppState> {
    constructor(props: AppProps) {
        super(props);
        this.state = { tilletData: [], coordinates: null, selectedOption: "" };
    }

    componentDidMount() {
        console.log("mount hook");
        axios.get("/sensitive/tillet_converted.json").then(r => {
            console.log("win", r.data);
            this.setState({ tilletData: r.data });
        }).catch(e => {
            console.log("lose");
        });;

        axios.get("/sensitive/parsed_sparse_coordinates.json").then(r => {
            console.log("got psc");
            this.setState({ coordinates: r.data });
        }).catch(e => {
            console.log("failed to get psc");
        });
    }

    handleClick() {
        console.log("click handling");

        const recordId = this.state.selectedOption;
        const val = this.state.coordinates[recordId];

        if (val === undefined) {
            notification.error({
                message: 'Unknown coordinates',
                description: 'This record was not able to be scanned for coordinates.'
            });
        }

        const long = val[0];
        const lat = val[1];

        singletons.gateway.addLocation(long, lat).then(r => {
            notification.success({
                message: 'Success',
                description: 'Added location to database.'
            });
        });
    }

    handleChange(value: string) {
        this.setState({ selectedOption: value });
    }




    render() {
        const derived = this.state.tilletData.map((r: any) => <Select.Option key={r.record_id} value={r.record_id}>{r.landing_zone.join(' - ')}</Select.Option>);

        return (
            <div>
                <Select style={{ width: 800 }}
                    value={this.state.selectedOption}
                    onChange={(value: string) => this.handleChange(value)}
                    showSearch>
                    {derived}
                </Select>

                <p>Selected option value: {this.state.selectedOption}</p>

                <Button onClick={() => this.handleClick()}>Create</Button>


            </div>
        );
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(MyComponent);

