import React, {useState, useEffect} from 'react';
import {ApolloClient,HttpLink, InMemoryCache, ApolloProvider, ApolloLink} from '@apollo/client';
import {useQuery, useMutation} from '@apollo/client';
import {DndProvider, useDrag, useDrop, DragSourceMonitor, DropTargetMonitor} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {cloneDeep} from 'lodash';
import {Modal, Button} from 'antd';
import {parseISO, format} from 'date-fns';

//import {EventInputForm} from './event-input-form';
import {EventInputForm} from './event-input-form-2';
//
import {
    EVENT_SEQUENCE_QUERY, ALL_PLANESORTIES_QUERY, SET_EVENT_DESCRIPTION,
    REDIRECT_EVENT_SEQUENCE, MOVE_EVENT, DELETE_EVENT,
    ADD_EVENT, ADD_SEQUENCE
} from './graphql-operations';
import {strictFindIndex, arrayMove} from '../utility';
import './event-form.css'
import {GRAPHQL_URL} from '../configuration';
import {
    Event, PlaneSortie, InSequenceRelationship, EventSequence, DraggableType,
    DragObject, EventInputDetails
} from './interfaces';
// abstraction violation
import {
    DateInputs
} from '../date-authoring-component';
import {constructLink} from './construct-link';
import {
    convertMinuteOffsetToUserFacing,
    convertUserFacingToMinuteOffset,
    UserFacingTimeOffset
} from '../core/time-offset';



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

function TimeOffsetDisplay(props: {value: UserFacingTimeOffset}) {
    return (
        <div className="user-facing-time-offset">
          <span>Day ordinal: {props.value.dayOrdinal}</span>
          <span>Hour: {props.value.hour}</span>
          <span>Minute: {props.value.minute}</span>
        </div>
    );
}

function EventView(
    props: {
        value: Event,
        nightOf: Date,
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

    const formattedDate = format(props.nightOf, 'yyyy-MM-dd');

    return (
        <div ref={dropTargetRef} className="event-drop-target">
          <div ref={dragSourceRef} className="event-drag-source">
            <input type="text"
                   value={props.value.description}
                   onChange={(e) => onChange(e.target.value)}/>

            <p>Night of: {formattedDate}</p>

            <TimeOffsetDisplay
                value={convertMinuteOffsetToUserFacing(props.nightOf, props.value.offset)}/>

            <button onClick={(e) => props.onDelete(props.value.uuid)}>Delete</button>
          </div>
        </div>
    )
}

// XXX: Not totally clear that we should present the button here as well, but
// it works and avoids multiplying props, so whaddya gonna do?
function AddEventStuff(props: {eventSequenceId: string, nightOf: Date}) {
    const [addEvent, addEventResult] = useMutation(
        ADD_EVENT, {refetchQueries: [{query: EVENT_SEQUENCE_QUERY}]}
    );
    const [modalVisibility, setModalVisibility] = useState(false);

    const handleShowModal = () => {
        setModalVisibility(true);
    };


    const makeInitialState = (): EventInputDetails => (
        {
            description: "",
            timeOffset: {dayOrdinal: 1, hour: 0, minute: 0}
        }
    );
    const [eventDetails, setEventDetails] = useState(makeInitialState());

    const handleCancel = (close: React.MouseEvent<HTMLElement>) => {
        setModalVisibility(false);
        setEventDetails(makeInitialState());
    }

    const handleOk = (close: React.MouseEvent<HTMLElement>) => {
        console.log("value of close is %o", close);
        setModalVisibility(false);
        console.log("event details are %o", eventDetails);

        const payload = {
            description: eventDetails.description,
            offset: convertUserFacingToMinuteOffset(props.nightOf, eventDetails.timeOffset)
        };

        console.log("I will send payload %o", payload);
        
        addEvent(
            {variables: {
                esId: props.eventSequenceId,
                event: payload
            }});
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
            <EventInputForm onChange={handleChange} value={eventDetails}/>
          </Modal>
        </div>
    );
}


// View for an individual event sequence.
function EventSequenceView(props: EventSequence) {
    const [redirectEventSequence, _] = useMutation(
        REDIRECT_EVENT_SEQUENCE, {refetchQueries: [{query: EVENT_SEQUENCE_QUERY}]}
    );

    const [moveEvent, moveEventResult] = useMutation(
        MOVE_EVENT, {refetchQueries: [{query: EVENT_SEQUENCE_QUERY}]}
    );

    const [deleteEvent, deleteEventResult] = useMutation(
        DELETE_EVENT, {refetchQueries: [{query: EVENT_SEQUENCE_QUERY}]}
    );

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

    var planeSortieValue;
    if (props.planeSortie === null) {
        planeSortieValue = undefined;
    } else {
        planeSortieValue = props.planeSortie.name;
    }

    const nightOf = parseISO(props.planeSortie.sortie.nightOf);
    return (
        <div className="event-sequence">
          <h1>Event Sequence</h1>
          <p>UUID: {props.uuid}</p>
          <p>Name: {props.name}</p>
          
          <div>Referred-to PlaneSortie:
            <PlaneSortieSelector value={planeSortieValue}
                                 onChange={handlePlaneSortieChange}/>
          </div>

          <p>Total items in event sequence: {props.events.length}</p>
          
          <div className="event-list">
            {props.events.map(({Event}) => <EventView key={Event.uuid}
                                                      value={Event}
                                                      nightOf={nightOf}
                                                      onRearrange={handleRearrange}
                                                      onDelete={handleDelete}/>)}
          </div>
          <AddEventStuff eventSequenceId={props.uuid} nightOf={nightOf}/>
        </div>
    );
}


function AllSequencesView() {
    const [currentId, setCurrentId] = useState(undefined as string | undefined);
    const [isManuallySelected, setManuallySelected] = useState(false);
    const {loading, error, data} = useQuery(EVENT_SEQUENCE_QUERY);

    useEffect(
        () => {
            if (!loading) {
                const sequences = data['EventSequence']
                if (sequences.length > 0 && !isManuallySelected) {
                    setCurrentId(sequences[0].uuid);
                } else {
                    // There's actually zero sequences defined, perhaps a blank DB
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

