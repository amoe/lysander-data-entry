import React from 'react';
import { connect } from 'react-redux';
import { notification } from 'antd';
import { addDataToMap } from 'kepler.gl/actions';
import { identity } from '../utility';
import { Record } from 'neo4j-driver/types/v1/index';

import { 
    SidebarFactory,
    Button,
    ItemSelector,
    PanelLabel,
    SidePanelSection
} from 'kepler.gl/components';

import { FullStateTree, IncrementAction } from '../interfaces';
import actionCreators from '../action-creators';
import mockdata from '../mockdata';
import singletons from '../singletons';
import {
    STPointsByPilotCluster,
    GetDistinctPilots,
    GetDistinctLocations
} from '../canned-statements';
import { makeKeplerData } from '../munge-for-kepler';

interface Pilot {
    clusterId: string;
    firstName: string[];
    lastName: string[];
}

interface PilotIndex {
    [key: string]: Pilot;
}


function mapStateToProps(state: FullStateTree) {
    return {
        counter: state.app.counter
    };
}

interface AppProps {
    counter: number;
    increment: () => IncrementAction;
    addDataToMap: typeof addDataToMap;
}

const mapDispatchToProps = {
    increment: actionCreators.increment,
    addDataToMap
};


const TANGMERE_LONGITUDE = -0.7063888888888888;
const TANGMERE_LATITUDE = 50.84583333333333;

// Filter the available flights so there's only one.
const WANTED_PILOT = {
    firstName: ['john', 'xavier'],
    lastName: ['doe']
};

interface Location {
    code: string;
    description: string;
}

interface AppState {
    selectedPilots: string[];
    availablePilots: PilotIndex;
    availableLocations: Location[]
}

function indexPilots(records: Record[]): PilotIndex {
    const result: PilotIndex = {};

    for (let record of records) {
        const clusterId = record.get('clusterId');
        result[clusterId] = record.toObject() as Pilot;
        
    }
    return result;
}

function QueryBuilderPanelFactory(
    Sidebar: any
) {
    return connect(mapStateToProps, mapDispatchToProps)(
        class QueryBuilderPanel extends React.Component<any, AppState> {
            constructor(props: any) {
                super(props);
                this.state = {
                    selectedPilots: [],
                    availablePilots: {},
                    availableLocations: []
                }
            }

            componentDidMount() {
                singletons.gateway.search(new GetDistinctPilots()).then(
                    ({records}) => {
                        this.setState({availablePilots: indexPilots(records)});
                    }
                );
                /* singletons.gateway.search(new GetDistinctLocations()).then(
                 *     ({records}) => {

                 *         const locations = records.map(x => {
                 *             return x.toObject() as Location
                 *         });

                 *         this.setState({availableLocations: locations});
                 *     }
                 * );*/
            }

            onClick() {
                /* const pilotCluster = this.state.selectedPilots[0];*/
                const pilotCluster: any = this.state.selectedPilots;

                console.log("I would search for cluster %o", pilotCluster);

                singletons.gateway.search(new STPointsByPilotCluster(pilotCluster)).then(r => {
                    console.log("record count is ", r.records.length);
                    const count = r.records.length;
                    if (count === 0) {
                        notification.error({
                            message: 'Error',
                            description: 'No STPoints found.'
                        });
                    }
                    const newRows = r.records.map(x => {
                        return [
                            x.get('nightOf'),
                            TANGMERE_LONGITUDE,
                            TANGMERE_LATITUDE,
                            x.get('longitude'),
                            x.get('latitude')
                        ];
                    });
                    console.log("row values are %o", newRows);
                    const kdata = makeKeplerData(newRows);
                    this.props.addDataToMap(kdata);
                });
            }
            
            onSelectPilot(newItems: any) {
                console.log("new items are: %o", newItems);
                this.setState({selectedPilots: newItems});
            }

            // This does not work well.  We want to get passed the c
            
            getPilotLabel(clusterId: string) {
                const separator = ' ';
                const thisCluster = this.state.availablePilots[clusterId];
                const joinedFirstName = thisCluster.firstName.join(separator);
                const joinedLastName = thisCluster.lastName.join(separator);
                return `${joinedFirstName} ${joinedLastName}`;
            }

            render() {
                return (
                    <div>
                      <Sidebar width={300}
                               isOpen={true}
                               minifiedWidth={0}>


                        <SidePanelSection>
                          <PanelLabel>Select Pilots</PanelLabel>
                          <ItemSelector 
                              options={Object.keys(this.state.availablePilots)}
                              selectedItems={this.state.selectedPilots} 
                              multiSelect={false}
                              displayOption={this.getPilotLabel.bind(this)}
                              getOptionValue={identity}
                              onChange={this.onSelectPilot.bind(this)}></ItemSelector>
                        </SidePanelSection>

                        <Button onClick={this.onClick.bind(this)}>Query</Button>

                      </Sidebar>
                    </div>
                );
            }
        }
    );
}

QueryBuilderPanelFactory.deps = [
    SidebarFactory
];

export { QueryBuilderPanelFactory };
