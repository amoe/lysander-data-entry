import React from 'react';
import { connect } from 'react-redux';
import { notification } from 'antd';
import { addDataToMap } from 'kepler.gl/actions';
import { startCase } from 'lodash';
import { identity } from '../utility';
import { Record } from 'neo4j-driver/types/v1/index';

import { 
    SidebarFactory,
    Button,
    ItemSelector,
    PanelLabel,
    SidePanelSection,
    PanelTitleFactory,
    FilterManagerFactory
} from 'kepler.gl/components';

import { FullStateTree, IncrementAction } from '../interfaces';
import actionCreators from '../action-creators';
import mockdata from '../mockdata';
import singletons from '../singletons';
import {
    STPointsByMultiplePilotClusters,
    STPointsByLocations,
    STPointsByOperations,
    STPointsByCriteria,
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
    id: string;
    code: string;
    description: string;
    codename: string;
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
        const id = record.get('id');
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
    Sidebar: any,
    PanelTitle: any,
    FilterManager: any
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
                        console.log("Pilots loaded: %o", records.length);
                        this.setState({availablePilots: indexPilots(records)});
                    }
                );
                singletons.gateway.search(new GetDistinctLocations()).then(
                    ({records}) => {
                        console.log("Discovered %o locations", records.length);
                        this.setState({availableLocations: indexLocations(records)});
                    }
                );
                singletons.gateway.search(new GetDistinctOperations()).then(
                    ({records}) => {
                        this.setState({availableOperations: indexOperations(records)});
                    }
                );

            }

            doQuery() {
                const query = new STPointsByCriteria(
                    this.state.selectedPilots,
                    this.state.selectedLocations,
                    this.state.selectedOperations
                );

                singletons.gateway.search(query).then(r => {
                    console.log("record count is ", r.records.length);
                    const count = r.records.length;
                    if (count === 0) {
                        notification.error({
                            message: 'Error',
                            description: 'No STPoints found.'
                        });

                        return;
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

            doPilotQuery() {
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

                singletons.gateway.search(new STPointsByLocations(wantedLocations)).then(r => {
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

            doOperationQuery() {
                const wantedOperations = this.state.selectedOperations;

                singletons.gateway.search(new STPointsByOperations(wantedOperations)).then(r => {
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

            getPilotLabel(clusterId: string) {
                const separator = ' ';
                const thisCluster = this.state.availablePilots[clusterId];
                const joinedFirstName = thisCluster.firstName.join(separator);
                const joinedLastName = thisCluster.lastName.join(separator);
                return startCase(`${joinedFirstName} ${joinedLastName}`);
            }

            getLocationLabel(locationId: string): string {
                const theLocation = this.state.availableLocations[locationId];
                return theLocation.codename || theLocation.id;
            }
            
            clearCriteria(): void {
                this.setState({
                    selectedOperations: [],
                    selectedPilots: [],
                    selectedLocations: []
                });
            }

            render() {
                const { visStateActions, datasets, filters } = this.props;

                const filterManagerActions = {
                    addFilter: visStateActions.addFilter,
                    removeFilter: visStateActions.removeFilter,
                    setFilter: visStateActions.setFilter,
//                    showDatasetTable: this._showDatasetTable,
//                    showAddDataModal: this._showAddDataModal,
                    toggleAnimation: visStateActions.toggleFilterAnimation,
                    enlargeFilter: visStateActions.enlargeFilter
                };

                console.log("visstateactions = %o", this.props.visStateActions);

                const operationsSorted = Object.keys(this.state.availableOperations);
                operationsSorted.sort((a, b) => a.localeCompare(b));

                const pilotsSorted = Object.keys(this.state.availablePilots);
                // check out lodash sortBy
                pilotsSorted.sort((a, b) => {
                    return this.getPilotLabel(a).localeCompare(this.getPilotLabel(b));
                });

                const locationsSorted = Object.keys(this.state.availableLocations);
                locationsSorted.sort((a, b) => {
                    return this.getLocationLabel(a).localeCompare(this.getLocationLabel(b));
                })

                const hadDataset = Object.keys(datasets).length;

                return (
                    <div>
                      <Sidebar width={300}
                               isOpen={true}
                               minifiedWidth={0}>

                        <PanelTitle className="side-panel__content__title">
                          Query Builder
                        </PanelTitle>

                        {hadDataset && <FilterManager {...filterManagerActions}
                                                      datasets={datasets}
                                                      filters={filters} />}

                        <SidePanelSection>
                          <PanelLabel>Select Pilots</PanelLabel>
                          <ItemSelector 
                              options={pilotsSorted}
                              selectedItems={this.state.selectedPilots} 
                              multiSelect={true}
                              displayOption={this.getPilotLabel.bind(this)}
                              getOptionValue={identity}
                              onChange={this.onSelectPilot.bind(this)}></ItemSelector>
                        </SidePanelSection>

                        <SidePanelSection>
                          <PanelLabel>Select Locations</PanelLabel>
                          <ItemSelector 
                              options={locationsSorted}
                              selectedItems={this.state.selectedLocations} 
                              multiSelect={true}
                              displayOption={this.getLocationLabel.bind(this)}
                              getOptionValue={identity}
                              onChange={this.onSelectLocation.bind(this)}></ItemSelector>
                        </SidePanelSection>

                        <SidePanelSection>
                          <PanelLabel>Select Operations</PanelLabel>
                          <ItemSelector 
                              options={operationsSorted}
                              selectedItems={this.state.selectedOperations} 
                              multiSelect={true}
                              displayOption={(x: string) => this.state.availableOperations[x].name}
                              getOptionValue={identity}
                              onChange={this.onSelectOperation.bind(this)}></ItemSelector>
                        </SidePanelSection>

                        <Button onClick={this.doQuery.bind(this)}>Query</Button>
                        <Button onClick={this.clearCriteria.bind(this)} secondary>Clear Criteria</Button>
                      </Sidebar>
                    </div>
                );
            }
        }
    );
}

QueryBuilderPanelFactory.deps = [
    SidebarFactory,
    PanelTitleFactory,
    FilterManagerFactory
];

export { QueryBuilderPanelFactory };
