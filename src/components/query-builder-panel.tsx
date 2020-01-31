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
    STPointsByMultiplePilotClusters,
    STPointsByLocation,
    GetDistinctPilots,
    GetDistinctLocations,
    GetDistinctOperations
} from '../canned-statements';
import { makeKeplerData } from '../munge-for-kepler';

interface Pilot {
    clusterId: string;
    firstName: string[];
    lastName: string[];
}

interface Location {
    code: string;
    description: string;
}

interface Operation {
    name: string;
}

interface LocationIndex {
    [key: string]: Location;
}


interface PilotIndex {
    [key: string]: Pilot;
}

interface OperationIndex {
    [key: string]: Operation;
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

interface AppState {
    selectedPilots: string[];
    selectedLocations: string[];
    selectedOperations: string[];
    availablePilots: PilotIndex;
    availableLocations: LocationIndex;
    availableOperations: OperationIndex;
}

function indexPilots(records: Record[]): PilotIndex {
    const result: PilotIndex = {};

    for (let record of records) {
        const id = record.get('clusterId');
        result[id] = record.toObject() as Pilot;
        
    }
    return result;
}

function indexLocations(records: Record[]): LocationIndex {
    const result: LocationIndex = {};

    for (let record of records) {
        const id = record.get('code');
        result[id] = record.toObject() as Location;
        
    }
    return result;
}

function indexOperations(records: Record[]): OperationIndex {
    const result: OperationIndex = {};

    for (let record of records) {
        const id = record.get('name');
        result[id] = record.toObject() as Operation;
        
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
                    availableLocations: {},
                    selectedLocations: [],
                    availableOperations: {},
                    selectedOperations: []
                }
            }

            componentDidMount() {
                singletons.gateway.search(new GetDistinctPilots()).then(
                    ({records}) => {
                        this.setState({availablePilots: indexPilots(records)});
                    }
                );
                singletons.gateway.search(new GetDistinctLocations()).then(
                    ({records}) => {
                        this.setState({availableLocations: indexLocations(records)});
                    }
                );
                singletons.gateway.search(new GetDistinctOperations()).then(
                    ({records}) => {
                        this.setState({availableOperations: indexOperations(records)});
                    }
                );

            }

            onClick() {
                const wantedClusters = this.state.selectedPilots;

                singletons.gateway.search(new STPointsByMultiplePilotClusters(wantedClusters)).then(r => {
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

            doLocationQuery() {
                const wantedLocations = this.state.selectedLocations;

                singletons.gateway.search(new STPointsByLocation(wantedLocations)).then(r => {
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

            onSelectLocation(newItems: any) {
                console.log("new items are: %o", newItems);
                this.setState({selectedLocations: newItems});
            }
            onSelectOperation(newItems: any) {
                console.log("new items are: %o", newItems);
                this.setState({selectedOperations: newItems});
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
                              multiSelect={true}
                              displayOption={this.getPilotLabel.bind(this)}
                              getOptionValue={identity}
                              onChange={this.onSelectPilot.bind(this)}></ItemSelector>
                        </SidePanelSection>

                        <SidePanelSection>
                          <PanelLabel>Select Locations</PanelLabel>
                          <ItemSelector 
                              options={Object.keys(this.state.availableLocations)}
                              selectedItems={this.state.selectedLocations} 
                              multiSelect={true}
                              displayOption={(x: string) => this.state.availableLocations[x].description}
                              getOptionValue={identity}
                              onChange={this.onSelectLocation.bind(this)}></ItemSelector>
                        </SidePanelSection>

                        <SidePanelSection>
                          <PanelLabel>Select Operations</PanelLabel>
                          <ItemSelector 
                              options={Object.keys(this.state.availableOperations)}
                              selectedItems={this.state.selectedOperations} 
                              multiSelect={true}
                              displayOption={(x: string) => this.state.availableOperations[x].name}
                              getOptionValue={identity}
                              onChange={this.onSelectOperation.bind(this)}></ItemSelector>
                        </SidePanelSection>

                        <Button onClick={this.doLocationQuery.bind(this)}>Query</Button>
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
