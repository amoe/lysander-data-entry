import React, {useState, useEffect} from 'react';
import {ApolloClient,HttpLink, InMemoryCache, ApolloProvider, ApolloLink} from '@apollo/client';
import {FetchResult} from 'apollo-link';
import {useQuery, useMutation} from '@apollo/client';
import {DndProvider, useDrag, useDrop, DragSourceMonitor, DropTargetMonitor} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {cloneDeep} from 'lodash';
import {Modal, Button, notification} from 'antd';
import {parseISO, format} from 'date-fns';
import {EventInputForm} from './event-input-form-2';

import {
    EVENT_SEQUENCE_QUERY, ALL_PLANESORTIES_QUERY, SET_EVENT_DESCRIPTION,
    REDIRECT_EVENT_SEQUENCE, MOVE_EVENT, DELETE_EVENT,
    ADD_EVENT, ADD_SEQUENCE, ALL_LOCATIONS_QUERY, ADD_LOCATION
} from './graphql-operations';
import {strictFindIndex, arrayMove} from '../utility';
import './event-form.css'
import {GRAPHQL_URL} from '../configuration';
import {
    Event, PlaneSortie, EventSequence, DraggableType,
    DragObject, EventInputDetails, CardinalPoint, LocationInput,
    Location
} from './interfaces';
import {constructLink} from './construct-link';
import {
    convertMinuteOffsetToUserFacing,
    convertUserFacingToMinuteOffset,
    UserFacingTimeOffset
} from '../core/time-offset';
import {PositionView} from './position-view';
import {LocationInputForm} from './location-input-form';
import uuidv4 from 'uuid/v4';


import {variablesFromEventDetails} from './add-event';


// Need to get this deploy data specifically
const client = new ApolloClient({
    link: constructLink(GRAPHQL_URL),
    cache: new InMemoryCache()
});

//
function PlaneSortieSelector(
    props: {value: string | undefined, onChange: (x: string) => void}
) {
    const {loading, error, data} = useQuery(ALL_PLANESORTIES_QUERY);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error!</p>;

    return (
        <span>
          <select value={props.value === undefined ? "" : props.value}
                  onChange={e => props.onChange(e.target.value)}>
            <option value="" disabled>No association</option>            
            {data['PlaneSortie'].map((ps: PlaneSortie) => <option key={ps.name} value={ps.name}>{ps.name}</option>)}
          </select>
        </span>
    )
}

function TimeOffsetConversionWrapper(props: {nightOf: Date | undefined, offset: number | null}) {
    if (props.nightOf === undefined || props.offset === null) {
        return <i>Unknown/undefined chronological information</i>
    } else {
        return <TimeOffsetDisplay value={convertMinuteOffsetToUserFacing(props.nightOf, props.offset)}/>
    }
};

function TimeOffsetDisplay(props: {value: UserFacingTimeOffset}) {
    return (
        <div className="user-facing-time-offset">
          <span>Day ordinal: {props.value.dayOrdinal}</span>
          <span>Hour: {props.value.hour}</span>
          <span>Minute: {props.value.minute}</span>
        </div>
    );
}

function NightOfDisplay(props: {nightOf: Date | undefined}) {
    if (props.nightOf === undefined) {
        return (<p>Night of: (not set)</p>);
    } else {
        return (<p>Night of: {format(props.nightOf, 'yyyy-MM-dd')}</p>);
    }
}

function eventInputFromEvent(nightOf: Date, event: Event): EventInputDetails {
    var locationId, relativeDistance, relativeCardinal, relativeHeight;
    
    if (event.position === null) {
        locationId = undefined;
        relativeDistance = undefined;
        relativeCardinal = undefined;
        relativeHeight = undefined;
    } else {
        locationId = event.position.location.id;
    }

    var timeOffset;
    if (event.offset === null) {
        timeOffset = undefined;
    } else {
        timeOffset = convertMinuteOffsetToUserFacing(nightOf, event.offset);
    }
    
    const result: EventInputDetails = {
        description: event.description,
        reference: event.reference,
        quotation: event.quotation,
        notes: event.notes,
        locationId,
        relativeDistance,
        relativeCardinal,
        relativeHeight,
        timeOffset
    };

    return result;
}
//
function CloneAsNewEventButton(
    props: {
        nightOf: Date, value: Event, allLocations: Location[], eventSequenceId: string,
        planeSortieLocationId: string
    }
) {
    const [addEvent, addEventResult] = useMutation(
        ADD_EVENT, {refetchQueries: [{query: EVENT_SEQUENCE_QUERY}]}
    );
    const [modalVisibility, setModalVisibility] = useState(false);
    const [eventDetails, setEventDetails] = useState(undefined as EventInputDetails | undefined);
    
    function handleClick() {
        console.log("I would edit this event");
        setEventDetails(eventInputFromEvent(props.nightOf, props.value));
        setModalVisibility(true);
    }

    function handleOk() {
        if (eventDetails === undefined)
            throw new Error("can't happen");
        
        setModalVisibility(false);
        addEvent({variables: variablesFromEventDetails(eventDetails, props.nightOf, props.eventSequenceId)});
        setModalVisibility(false);
    }
    
    function handleCancel() {
        setModalVisibility(false);
    }

    const handleChange = (newValues: EventInputDetails) => {
        console.log("Parent: New values are %o", newValues);
        setEventDetails(newValues);
    };
    

    return (
        <div>
          <button onClick={handleClick}>Clone as new event</button>
          <Modal visible={modalVisibility} onOk={handleOk} onCancel={handleCancel}>
            <EventInputForm onChange={handleChange}
                            value={eventDetails!}
                            planeSortieLocationId={props.planeSortieLocationId}
                            availableLocations={props.allLocations}/>
          </Modal>
          
        </div>
    );
}


function EventView(
    props: {
        value: Event,
        nightOf: Date,
        eventSequenceId: string,
        allLocations: Location[],
        planeSortie: PlaneSortie,
        onRearrange: (sourceId: string, targetId: string) => void,
        onDelete: (eventId: string) => void
    }
) {
    const [setEventDescription, {data}] = useMutation(
        SET_EVENT_DESCRIPTION, {refetchQueries: [{query: EVENT_SEQUENCE_QUERY}]}
    );
    
    const onChange = (value: string) => {
        setEventDescription({variables: {uuid: props.value.uuid, description: value}});
    };

    const dragSpec = {
        item: {type: DraggableType.LIST_ITEM, id: props.value.uuid},
        collect: (monitor: DragSourceMonitor) => ({
            isDragging: !!monitor.isDragging()
        })
    };

    const [dragProps, dragSourceRef, dragPreviewRef] = useDrag(dragSpec);

    const dropSpec = {
        accept: DraggableType.LIST_ITEM,
        drop: (item: DragObject, monitor: any) => {
            // target is this id, item.id is source
            console.log("accepting a drop");
            console.log("target uuid is %o", props.value.uuid);
            console.log("source uuid is %o", item.id);
            props.onRearrange(item.id, props.value.uuid);
        },
        hover: (item: DragObject, monitor: DropTargetMonitor) => {
            //            console.log("testing droppability: %o", monitor.canDrop());
        },
    };
    const [dropProps, dropTargetRef] = useDrop(dropSpec);

    return (
        <div ref={dropTargetRef} className="event-drop-target">
          <div ref={dragSourceRef} className="event-drag-source">
            <input type="text"
                   value={props.value.description}
                   onChange={(e) => onChange(e.target.value)}/>


            <TimeOffsetConversionWrapper nightOf={props.nightOf}
                                         offset={props.value.offset}/>
            
            <button onClick={(e) => props.onDelete(props.value.uuid)}>Delete</button>

            <LocationView value={props.value}/>

            <CloneAsNewEventButton nightOf={props.nightOf}
                                   value={props.value}
                                   allLocations={props.allLocations}
                                   planeSortieLocationId={props.planeSortie.sortie.location.id}
                                   eventSequenceId={props.eventSequenceId}/>

            <div className="bodytext"><span className="bodytext-title">Reference</span> {props.value.reference}</div>
            <div className="bodytext"><span className="bodytext-title">Quotation</span> {props.value.quotation}</div>
            <div className="bodytext"><span className="bodytext-title">Notes</span> {props.value.notes}</div>
          </div>
        </div>
    )
}

function LocationView(props: {value: Event}) {
    if (props.value.position === null) {
        return (<i>No position defined</i>);
    } else {
        return (
            <div>
              Location: {props.value.position.location.id}
              <PositionView value={props.value.position}/>
            </div>
        );
    }
}

// XXX: Not totally clear that we should present the button here as well, but
// it works and avoids multiplying props, so whaddya gonna do?
function AddEventStuff(props: {
    eventSequenceId: string, nightOf: Date, allLocations: Location[],
    planeSortie: PlaneSortie
}) {
    const [addEvent, addEventResult] = useMutation(
        ADD_EVENT, {refetchQueries: [{query: EVENT_SEQUENCE_QUERY}]}
    );
    const [modalVisibility, setModalVisibility] = useState(false);

    const makeInitialState = (): EventInputDetails => (
        {
            description: "",
            reference: "",
            quotation: "",
            notes: "",
            relativeDistance: 0,
            relativeCardinal: CardinalPoint.NORTH,
            relativeHeight: 0,
            locationId: undefined,
            timeOffset: {dayOrdinal: 1, hour: 0, minute: 0}
        }
    );
    const [eventDetails, setEventDetails] = useState(makeInitialState());


    const handleShowModal = () => {
        setModalVisibility(true);
    };



    const handleCancel = (close: React.MouseEvent<HTMLElement>) => {
        setModalVisibility(false);
        setEventDetails(makeInitialState());
    }

    const handleOk = (close: React.MouseEvent<HTMLElement>) => {
        setModalVisibility(false);
        addEvent({variables: variablesFromEventDetails(eventDetails, props.nightOf, props.eventSequenceId)});
        setEventDetails(makeInitialState());
    }


    const handleChange = (newValues: EventInputDetails) => {
        console.log("Parent: New values are %o", newValues);
        setEventDetails(newValues);
    };
    
    return (
        <div>
          <button onClick={(e) => handleShowModal()}>Add event</button>
          <Modal visible={modalVisibility} onOk={handleOk} onCancel={handleCancel}>
            <EventInputForm onChange={handleChange}
                            value={eventDetails}
                            planeSortieLocationId={props.planeSortie.sortie.location.id}
                            availableLocations={props.allLocations}/>
          </Modal>
        </div>
    );
}

function makeBlankLocation(): LocationInput {
    return {
        id: uuidv4(),
        codename: "",
        description: "",
        latitude: 0,
        longitude: 0
    };
}


// View for an individual event sequence.
function EventSequenceView(props: EventSequence) {
    const locationsResult = useQuery(ALL_LOCATIONS_QUERY);

    
    const [modalVisibility, setModalVisibility] = useState(false);
    const [locationInput, setLocationInput] = useState(makeBlankLocation());

    const [addLocation, addLocationResult] = useMutation(
        ADD_LOCATION, {
            refetchQueries: [{query: ALL_LOCATIONS_QUERY}],
        }
    );

    const [redirectEventSequence, _] = useMutation(
        REDIRECT_EVENT_SEQUENCE, {refetchQueries: [{query: EVENT_SEQUENCE_QUERY}]}
    );

    const [moveEvent, moveEventResult] = useMutation(
        MOVE_EVENT, {refetchQueries: [{query: EVENT_SEQUENCE_QUERY}]}
    );
//
    const [deleteEvent, deleteEventResult] = useMutation(
        DELETE_EVENT, {refetchQueries: [{query: EVENT_SEQUENCE_QUERY}]}
    );

    if (locationsResult.loading) {
        return <div>Loading.</div>;
    }

    if (locationsResult.error) {
        return <div>Error.</div>;
    }
    const allLocations: Location[] = locationsResult.data['Location'];

    const handlePlaneSortieChange = (value: string) => {
        redirectEventSequence({variables: {esId: props.uuid, psName: value}});
    };

    const handleRearrange = (sourceId: string, targetId: string) => {
        console.log("handling rearrange: sourceId is %o, targetId is %o", sourceId, targetId);
        moveEvent({variables: {esId: props.uuid, sourceEvent: sourceId, targetEvent: targetId}});
    };

    const handleDelete = (eventId: string) => {
        console.log("deleting event");
        deleteEvent({variables: {esId: props.uuid, eventId}});
    };

    const handleCancel = (close: React.MouseEvent<HTMLElement>) => {
        setModalVisibility(false);
        // Reset the state
    };

    const handleOk = (close: React.MouseEvent<HTMLElement>) => {
        const variables = {location: locationInput};
        addLocation({variables}).then((foo: FetchResult) =>  {
            // no idea if this is the correct way to check for failure
            if (!foo.errors) {
                notification.success({
                    message: 'Success',
                    description: 'Location added successfully'
                });
            }
        });


        // Reset the location state
        setModalVisibility(false);
        setLocationInput(makeBlankLocation());
    }
    

    const handleAddLocation = () => {
        setModalVisibility(true);
    };

    // We have to do all sorts of machinations because an event sequence can exist in a state where
    // it has no planesortie attached.    Really the list should be factored out
    var planeSortieValue;
    var nightOf: Date | undefined;
    if (props.planeSortie === null) {
        planeSortieValue = undefined;
        nightOf = undefined;
    } else {
        planeSortieValue = props.planeSortie.name;
        nightOf = parseISO(props.planeSortie.sortie.nightOf);
    }

    function ensureValid(value: Date | undefined): Date {
        if (nightOf === undefined) {
            throw new Error("somehow got undefined nightof when displaying event, bad sign");
        }

        return nightOf;
    }


    return (
        <div className="event-sequence">
          <h1>Event Sequence</h1>
          <p>UUID: {props.uuid}</p>
          <p>Name: {props.name}</p>


          <button onClick={handleAddLocation}>Add location</button>
          <Modal visible={modalVisibility} onOk={handleOk} onCancel={handleCancel}>
            <LocationInputForm value={locationInput} onChange={setLocationInput}/>
          </Modal>
          
          <div>Referred-to PlaneSortie:
            <PlaneSortieSelector value={planeSortieValue}
                                 onChange={handlePlaneSortieChange}/>
          </div>

          <NightOfDisplay nightOf={nightOf}/>

          <p>Total items in event sequence: {props.events.length}</p>
          
          <div className="event-list">
            {props.events.map(({Event}) => <EventView key={Event.uuid}
                                                      value={Event}
                                                      nightOf={ensureValid(nightOf)}
                                                      onRearrange={handleRearrange}
                                                      allLocations={allLocations}
                                                      planeSortie={props.planeSortie!}
                                                      eventSequenceId={props.uuid}
                                                      onDelete={handleDelete}/>)}
          </div>


          {nightOf === undefined ? (<i>Please set the associated PlaneSortie before adding events</i>) :  <AddEventStuff eventSequenceId={props.uuid} nightOf={nightOf} allLocations={allLocations} planeSortie={props.planeSortie!}/>}
        </div>
    );
}


function AllSequencesView() {
    const [currentId, setCurrentId] = useState(undefined as string | undefined);
    const [isManuallySelected, setManuallySelected] = useState(false);
    const {loading, error, data} = useQuery(EVENT_SEQUENCE_QUERY);
    const [modalVisibility, setModalVisibility] = useState(false);

    useEffect(
        () => {
            if (!loading) {
                // This is probably a network error
                if (data === undefined) {
                    throw new Error("something bad happened");
                } else {
                    const sequences = data['EventSequence']
                    if (sequences.length > 0 && !isManuallySelected) {
                        setCurrentId(sequences[0].uuid);
                    } else {
                        // There's actually zero sequences defined, perhaps a blank DB
                    }
                }
            } else {
                console.log("effect called before loading completed");
            }
        }, [loading, data, isManuallySelected]
    );

    
    const [addSequence, addSequenceResult] = useMutation(
        ADD_SEQUENCE, {refetchQueries: [{query: EVENT_SEQUENCE_QUERY}]}
    );

    console.log("Value of currentId is %o", currentId);
    

    if (loading) return <p>Loading...</p>;
    if (error) {
        console.log("An error happened: %o", error.message);
        return <p>Error! {error.message} {JSON.stringify(error.graphQLErrors)} {JSON.stringify(error.networkError)}</p>;
    }

    const handleAdd = () => {
        const sequenceName = window.prompt("What name should the sequence have?");
        addSequence({variables: {name: sequenceName}});
    };

    const handleSwitch = (sequenceId: string) => {
        setCurrentId(sequenceId);
        setManuallySelected(true);
    };
    

    const sequences = data['EventSequence'];

    if (sequences.length === 0) {
        return <div>
          Zero sequences :(
          <button onClick={(e) => handleAdd()}>Add event sequence</button>
        </div>;
    } else {
        if (currentId) {
            const thisSequence = sequences.find((x: EventSequence) => x.uuid === currentId);
            console.log(sequences);
            
            return (
                <div>
                  <select onChange={e => handleSwitch(e.target.value)} value={currentId}>
                    {sequences.map((es: EventSequence) => <option key={es.uuid} value={es.uuid}>{es.name}</option>)}
                  </select>
                  <button onClick={(e) => handleAdd()}>Create new event sequence</button>
                  <EventSequenceView {...thisSequence}/>
                </div>
            );
        } else {
            return <div>Still not enough info to choose a sequence...</div>;
        }
    }
}

export function EventForm() {
    return (
        <DndProvider backend={HTML5Backend}>
          <ApolloProvider client={client}>
            <div>
              <AllSequencesView/>
            </div>
          </ApolloProvider>
        </DndProvider>
    );
}

