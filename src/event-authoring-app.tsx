import React, {useState, useReducer, useEffect} from 'react';
import {ThemePanel} from './theme-panel';
import {SmartSubjectPicker} from './smart-subject-picker';
import {FormView} from './form-view';
import {EventTheme, SCHEMA, FieldSpecification} from './schema';
import {Store} from 'antd/lib/form/interface';
import {
    EventBlob, EntityCache, SubjectData, EventDatum, FlattenedPlaneSortieDatum
} from './interfaces2';
import singletons from './singletons';
import {reducer, ActionType} from './reducer';
import {
    GetDistinctPilots, GetDistinctLocations, GetDistinctOperations, FlattenedPlaneSorties
} from './canned-statements';
import {FilterConfiguration, SubjectPanelData} from './subject-panel/interfaces';
import {FlightEventDates, FlightEventPilotNames} from './statements/subject-filter';
import {SequenceView} from './sequence-view';
import {Select, Layout, Row, Col, Form, notification} from 'antd';

const { Header, Footer, Sider, Content } = Layout;

const AVAILABLE_THEMES = [
    EventTheme.PERSON, EventTheme.FLIGHT, EventTheme.ORGANIZATION
];

enum ViewState {
    FORM = 'form',
    SEQUENCE = 'sequence'
};


function emptyCache(): EntityCache {
    return {
        pilots: [],
        locations: [],
        operations: []
    }
}

const CACHE_FILLERS = [
    {key: 'pilots',
     statement: GetDistinctPilots},
    {key: 'locations',
     statement: GetDistinctLocations},
    {key: 'operations',
     statement: GetDistinctOperations}
];

const mockDates = [
    {nightOf: '1940', planeSortieNames: ['A', 'B']},
    {nightOf: '1941', planeSortieNames: ['C', 'D']},
    {nightOf: '1942', planeSortieNames: ['E', 'F']}
];

const mockPilots = [
    {name: 'Murray', planeSortieNames: ['A', 'D']},
    {name: 'Grimm', planeSortieNames: ['F', 'B']}
];

const mockEvent: EventDatum = {
}

function getLabel(datum: FlattenedPlaneSortieDatum) {
    return `${datum.planeSortieName} — ${datum.nightOf} — ${datum.lastNameTillet}`;
}

function DumbSubjectPicker(props: {
    data: FlattenedPlaneSortieDatum[],
    value: string | undefined,
    onChange: (newValue: string) => void
}) {

    const options = props.data.map(datum => ({
        label: getLabel(datum),
        value: datum.planeSortieName
    }));

    //    const options = [{value: 'fry', label: 'Fry'}];

    return (
        <div>
          <Select options={options} 
                  style={{width: '100%'}} 
                  onChange={props.onChange}/>
        </div>
    );
}


export function EventAuthoringApp() {
    const [state, dispatch] = useReducer(reducer, {
        allEvents: [mockEvent],
        entityCache: emptyCache(),
        subjectPanelData: {byDate: [], byPilot: []},
        flattenedPlaneSortieData: []
    });
    const [selectedTheme, setSelectedTheme] = useState(EventTheme.FLIGHT);
    const [event, setEvent] = useState({});
    const [viewState, setViewState] = useState(ViewState.FORM);
    const [form] = Form.useForm();
    const [subject, setSubject] = useState(undefined as string | undefined);

    useEffect(() => {
        CACHE_FILLERS.forEach(({key, statement}) => {
            singletons.gateway.search(new statement()).then(
                ({records}) => {
                    console.log("callback for %o", key);
                    dispatch({type: ActionType.SET_ENTITY_CACHE,
                              entityType: key,
                              payload: records.map(x => x.toObject())});
                }
            );
        });
    }, []);

    useEffect(() => {
        singletons.gateway.search(new FlightEventDates()).then(
            ({records}) => {
                console.log("inside flightevents callback");
                dispatch({type: ActionType.SET_SUBJECT_PANEL_DATA, key: 'byDate', payload: records.map(x => x.toObject())});
            }
        );

        singletons.gateway.search(new FlightEventPilotNames()).then(
            ({records}) => {
                console.log("inside flightevents callback");
                dispatch({type: ActionType.SET_SUBJECT_PANEL_DATA, key: 'byPilot', payload: records.map(x => x.toObject())});
            }
        );

    }, []);


    useEffect(() => {
        singletons.gateway.search(new FlattenedPlaneSorties()).then(
            ({records}) => {
                console.log("inside flattened callback");
                const payload = records.map(x => x.toObject() as FlattenedPlaneSortieDatum);
                dispatch({type: ActionType.SET_FLATTENED_PLANE_SORTIE_DATA, payload});
            }
        );
    }, []);

    const fields: FieldSpecification[] = SCHEMA[selectedTheme];

    // FIXME type should be Store but not sure where defined?
    // Store is just string->any map anyway.
    function handleFinish(values: Store) {
        console.log("values are %o", values);
        setEvent(values);
        dispatch({type: ActionType.ADD_EVENT, event: values});

        notification.success({
            message: 'Success',
            description: 'Added event to sequence..'
        });
    }

    function handleThemeChange(value: any) {
        setSelectedTheme(value);
    }

    function handleCollapse() {
        if (viewState !== ViewState.FORM)
            throw new Error("bad transition");
            
        setViewState(ViewState.SEQUENCE);
    }

    function handleSave() {
        console.log("saving");


        const values = {} as EventBlob;
        for (let x of fields) {
            const {fieldName} = x;
            const y = form.getFieldValue(fieldName);
            console.log(y);
            values[fieldName] = y;
        }

        singletons.gateway.saveEvent(values).then(r => {
            notification.success({
                message: 'Success',
                description: 'Wrote event sequence to database.'
            });
        });
        ;
    }

    function handleSubjectChange(newValue: any) {
        console.log("subject change requested");
        setSubject(newValue);
    }

    const handleExpand = (index: number) => {
        console.log("expand requested");
        form.setFieldsValue(state.allEvents[index]);
        setViewState(ViewState.FORM);
    }


    const subjectPanelConfiguration: FilterConfiguration = {
        targetField: 'planeSortieNames',
        filters: [
            {name: 'date',
             key: 'nightOf',
             data: state.subjectPanelData.byDate},
            {name: 'pilot',
             key: 'name',
             data: state.subjectPanelData.byPilot}
        ]
    };

    const handleNewEvent = () => {
        console.log("new event was clicked");
        form.resetFields();
        setViewState(ViewState.FORM);
    }

    return (
        <Layout>
          <Content>
            <Row>
              <Col span={12} offset={6}>
                <ThemePanel onChange={handleThemeChange} 
                            onCollapse={handleCollapse}
                            onSave={handleSave}
                            availableThemes={AVAILABLE_THEMES}
                            collapseEnabled={viewState === ViewState.FORM}
                            newEventEnabled={viewState === ViewState.SEQUENCE}
                            onNewEvent={handleNewEvent}
                            selectedThemeValue={selectedTheme}/>

                {subject}

                {<DumbSubjectPicker data={state.flattenedPlaneSortieData} 
                                    value={subject}
                                    onChange={handleSubjectChange}/>}

                {/*<SmartSubjectPicker enabled={viewState === ViewState.FORM} configuration={subjectPanelConfiguration}/>*/}

                {viewState === ViewState.FORM
                 ? <FormView fields={fields} onFinish={handleFinish} form={form}/>
                 : <SequenceView allEvents={state.allEvents} onExpand={handleExpand}/>}
              </Col>
            </Row>
          </Content>
        </Layout>
    );
}

