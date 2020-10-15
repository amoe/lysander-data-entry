import React, {useState} from 'react';
import {
    ApolloClient, InMemoryCache, ApolloProvider
} from '@apollo/client';
import {
    useQuery, useMutation
} from '@apollo/client';
import {
    EVENT_SEQUENCE_QUERY, ALL_PLANESORTIES_QUERY, SET_EVENT_DESCRIPTION,
    REDIRECT_EVENT_SEQUENCE, MOVE_EVENT, DELETE_EVENT
} from './graphql-operations';
import {strictFindIndex, arrayMove} from '../utility';

import {DndProvider, useDrag, useDrop, DragSourceMonitor, DropTargetMonitor} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {cloneDeep} from 'lodash';
import './event-form.css'

const client = new ApolloClient({
    uri: 'http://localhost:4000', cache: new InMemoryCache()
});

interface Event {
    uuid: string;
    description: string;
}

interface PlaneSortie {
    name: string;
}

interface InSequenceRelationship {
    position: number;
    Event: Event;
}

interface EventSequence {
    name: string;
    uuid: string;
    events: InSequenceRelationship[];
    planeSortie: PlaneSortie
}

enum DraggableType {
    LIST_ITEM = 'listItem',
}

export interface DragObject {
    type: DraggableType,
    id: string
}

function PlaneSortieSelector(props: {value: string, onChange: (x: string) => void}) {
    const {loading, error, data} = useQuery(ALL_PLANESORTIES_QUERY);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error!</p>;

    return (
        <span>
          <select value={props.value}
                  onChange={e => props.onChange(e.target.value)}>
            {data['PlaneSortie'].map((ps: PlaneSortie) => <option key={ps.name} value={ps.name}>{ps.name}</option>)}
          </select>
        </span>
    )
}

function EventView(
    props: {
        value: Event,
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

            <button onClick={(e) => props.onDelete(props.value.uuid)}>Delete</button>
          </div>
        </div>
    )
}
//

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
        console.log("handling rearrange");
        moveEvent({variables: {esId: props.uuid, sourceEvent: sourceId, targetEvent: targetId}});
    };

    const handleDelete = (eventId: string) => {
        console.log("deleting event");
        deleteEvent({variables: {esId: props.uuid, eventId}});
    };
    
    return (
        <div>
          <h1>Event Sequence</h1>
          <p>UUID: {props.uuid}</p>
          <p>Name: {props.name}</p>
          
          <div>Referred-to PlaneSortie:
            <PlaneSortieSelector value={props.planeSortie.name}
                                 onChange={handlePlaneSortieChange}/>
          </div>

          <p>Total items in event sequence: {props.events.length}</p>
          
          <div className="event-list">
            {props.events.map(({Event}) => <EventView key={Event.uuid} value={Event} onRearrange={handleRearrange} onDelete={handleDelete}/>)}
          </div>
        </div>
    );
}


function AllSequencesView() {
    const [currentId, setCurrentId] = useState("00000000-0000-4000-8000-000000000000");
    const {loading, error, data} = useQuery(EVENT_SEQUENCE_QUERY);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error!</p>;

    const sequences = data['EventSequence'];
    const thisSequence = sequences.find((x: EventSequence) => x.uuid === currentId);

    return (
        <div>
          <select onChange={e => setCurrentId(e.target.value)} value={currentId}>
            {sequences.map((es: EventSequence) => <option key={es.uuid} value={es.uuid}>{es.uuid}</option>)}
          </select>

          <EventSequenceView {...thisSequence}/>
        </div>
    );
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

