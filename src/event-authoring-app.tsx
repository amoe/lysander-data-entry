import React, {useState, useReducer, useEffect} from 'react';
import {Layout, Row, Col} from 'antd';
import {ThemePanel} from './theme-panel';
import {SubjectPanel} from './subject-panel';
import {SCHEMA, EventTheme, FieldSpecification} from './schema';
import {Form, Input, Button, notification} from 'antd';
import {Store} from 'antd/lib/form/interface';
import {FormInstance} from 'antd/lib/form';
import {EventBlob, EntityCache, SubjectData} from './interfaces2';
import singletons from './singletons';
import {reducer, ActionType} from './reducer';
import {LeftOutlined} from '@ant-design/icons';
import {SmartSubjectPicker} from './smart-subject-picker';
import {FormView} from './form-view';

import {
    GetDistinctPilots, GetDistinctLocations, GetDistinctOperations
} from './canned-statements';
import {FilterConfiguration, SubjectPanelData} from './subject-panel/interfaces';
import {FlightEventDates, FlightEventPilotNames} from './statements/subject-filter';
const { Header, Footer, Sider, Content } = Layout;

const AVAILABLE_THEMES = [
    EventTheme.PERSON, EventTheme.FLIGHT, EventTheme.ORGANIZATION
];


function SequenceView(props: {allEvents: any[], onExpand: (index: number) => void}) {
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



export function EventAuthoringApp() {
    const [state, dispatch] = useReducer(reducer, {
        allEvents: [],
        entityCache: emptyCache(),
        subjectPanelData: {byDate: [], byPilot: []}
    });
    const [selectedTheme, setSelectedTheme] = useState(EventTheme.PERSON);
    const [event, setEvent] = useState({});
    const [viewState, setViewState] = useState(ViewState.FORM);
    const [form] = Form.useForm();
    const [subject, setSubject] = useState({date: undefined, pilotName: undefined} as SubjectData);

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

    const fields: FieldSpecification[] = SCHEMA[selectedTheme];

    // FIXME type should be Store but not sure where defined?
    // Store is just string->any map anyway.
    function handleFinish(values: Store) {
        console.log("values are %o", values);
        setEvent(values);
        dispatch({type: ActionType.ADD_EVENT, event: values});
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
                description: 'Added event to database.'
            });
        });
        ;
    }

    function handleSubjectChange(newValue: SubjectData) {
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


    return (
        <Layout>
          <Content>
            <Row>
              <Col span={12} offset={6}>
                <ThemePanel onChange={handleThemeChange} 
                            onCollapse={handleCollapse}
                            onSave={handleSave}
                            availableThemes={AVAILABLE_THEMES}
                            collapseEnabled={viewState === ViewState.FORM}/>
                <SmartSubjectPicker configuration={subjectPanelConfiguration}/>

                {viewState === ViewState.FORM
                 ? <FormView fields={fields} onFinish={handleFinish} form={form}/>
                 : <SequenceView allEvents={state.allEvents} onExpand={handleExpand}/>}
              </Col>
            </Row>
          </Content>
        </Layout>
    );
}

