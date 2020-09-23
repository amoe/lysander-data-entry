import React, {useReducer, useState, useContext} from 'react';
import {DndProvider, useDrag, useDrop, DragSourceMonitor, DropTargetMonitor} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {cloneDeep, isEmpty} from 'lodash';
import uuidv4 from 'uuid/v4';
import './group-and-move.css';
import {reduceEventList} from './reducer';
import {
    ActionType, DragObject, DraggableType, EventItem, EventContent, 
    ListItemType, EventList, SplitHandler, Action, PageState
} from './interfaces';
import {randomPartial, MaybeDateCollection} from '../maybe-date-collection';
import {strictFindIndex} from '../utility';
import {PartialDate} from '../partial-date';
import {DateAuthoringComponent, DateInputs} from '../date-authoring-component';
import {Input, notification} from 'antd';

const DispatchContext = React.createContext<React.Dispatch<Action>>(undefined!!);

type DroppablePredicate = (sourceId: string, targetId: string) => boolean;

// not done yet!  Need to create a function in partialdate that trims a date to
// the correct range.  If one component is at the limits of that component
// (startofmonth, endofmonth, etc) just null it out.   will need tests

// function fullRange(dates: PartialDate[]): PartialDate {
//     var minSoFar: Date | undefined = undefined;
// 
//     dates.forEach(pd => {
//         const d = pd.toEarliestDate();
//         if (minSoFar === undefined || d < minSoFar) minSoFar = d;
//     });
// 
//     var maxSoFar: Date | undefined = undefined;
//     dates.forEach(pd => {
//         const d = pd.toLatestDate();
//         if (maxSoFar === undefined || d < maxSoFar) maxSoFar = d;
//     });
// 
//     throw new Error("but very unclear what we return here");
// }
// 
// function eventItemToPartialDate(item: EventItem): PartialDate {
//     switch (item.type) {
//         case ListItemType.SINGLE_EVENT:
//             return item.content.date;
//         case ListItemType.GROUP:
//             const foo = item.groupContent.map(x => x.date);
//             return fullRange(foo);
//         default:
//             throw new Error('no');
//     }
// }

function formatEventContentDate(value: EventContent) {
    if (value.date === undefined) {
        return "[UNCONSTRAINED DATE]";
    } else {
        return value.date.toString();
    }
}


function ContentDisplay(props: {value: EventContent}) {
    return (
        <span className="event-content-display">
          {props.value.description} - {formatEventContentDate(props.value)}
          <span className="event-content-id">(id is {props.value.id})</span>}
        </span>
    );
}

// How to ID the group members and how to move within a group?
function GroupMember(props: {x: EventContent, groupId: string, canDrop: DroppablePredicate}) {
    const dispatch = useContext(DispatchContext);

    const dragSpec = {
        item: {type: DraggableType.GROUP_ITEM, id: props.x.id},
        collect: (monitor: DragSourceMonitor) => ({
            // not currently used but can be used, no idea why the double bang
            isDragging: !!monitor.isDragging()
        })
    };
    const [dragProps, dragSourceRef, dragPreviewRef] = useDrag(dragSpec);

    const dropSpec = {
        accept: DraggableType.GROUP_ITEM,
        drop: (item: DragObject, monitor: any) => {
            const groupId = props.groupId;
            const sourceId = item.id;
            const targetId = props.x.id;
            dispatch({
                type: ActionType.MOVE_EVENT_WITHIN_GROUP_BY_ID,
                groupId, sourceId, targetId
            });
        },
        hover: (item: DragObject, monitor: DropTargetMonitor) => {
            //            console.log("testing droppability: %o", monitor.canDrop());

        },
        canDrop: (item: DragObject, monitor: DropTargetMonitor) => {
            const canDrop = props.canDrop(item.id, props.x.id);
            dispatch({type: ActionType.SET_CAN_MOVE_VALUE, newValue: canDrop});
            return canDrop;
        }
    };
    const [dropProps, dropTargetRef] = useDrop(dropSpec);

    return (
        <div ref={dropTargetRef}>
          <div ref={dragSourceRef} className="event-group-member">
            <ContentDisplay value={props.x}/>
          </div>
        </div>
    )
}

// useDrag needs to be called twice because it can't be passed as props.

function EventGroup(
    props: {
        id: string,
        members: EventContent[],
        onSplit: SplitHandler
    }
) {
    const dragSpec = {
        item: {type: DraggableType.LIST_ITEM, id: props.id},
        collect: (monitor: DragSourceMonitor) => ({
            // not currently used but can be used, no idea why the double bang
            isDragging: !!monitor.isDragging()
        })
    };
    const [dragProps, dragSourceRef, dragPreviewRef] = useDrag(dragSpec);

    const lastIndex = props.members.length - 1;

    // This is the easier one as it doesn't have to deal with groups itself.
    function canDrop(sourceId: string, targetId: string): boolean {
        const dates = props.members.map(x => x.date);
        const collection = MaybeDateCollection.fromArray(dates);
        const sourceIndex = strictFindIndex(props.members, x => x.id === sourceId);
        const targetIndex = strictFindIndex(props.members, x => x.id === targetId);
        const answer =  collection.canMove(sourceIndex, targetIndex);
        return answer;
    }
    //
    return (
        <div ref={dragSourceRef} className="event-group">
          Group of {props.members.length} items, contents:
          {
              props.members.map((x, i) => {
                  return (
                      <div key={x.id}>  {/* not sure if key here is right! */}
                        <GroupMember groupId={props.id} x={x} canDrop={canDrop}/>
                        {i < lastIndex && <button onClick={() => props.onSplit(i + 1)}>Split</button>}
                      </div>
                  );
              })
          }
        </div>
    );
}

function SingleEvent(props: {
    index: number,
    id: string,
    content: EventContent
}) {
    const dragSpec = {
        item: {type: DraggableType.LIST_ITEM, id: props.id},
        collect: (monitor: DragSourceMonitor) => ({
            isDragging: !!monitor.isDragging()
        })
    };

    const listPosition = props.index + 1;
    
    const [dragProps, dragSourceRef, dragPreviewRef] = useDrag(dragSpec);

    return (
        <div ref={dragSourceRef}
             className="top-level-event-list-item">{listPosition}. Single item: <ContentDisplay value={props.content}/></div>
    );
}

function EventItemInList(
    props: {
        item: EventItem,
        index: number,
        onSplit: SplitHandler,
        onSwap: Function,
        canDrop: DroppablePredicate
    })
{
    var result;

    const dropSpec = {
        accept: DraggableType.LIST_ITEM,
        drop: (item: any, monitor: any) => {
            props.onSwap(item.id, props.item.id);
        },
        hover: (item: DragObject, monitor: DropTargetMonitor) => {
            //            console.log("testing droppability: %o", monitor.canDrop());
        },
        canDrop: (item: DragObject, monitor: DropTargetMonitor) => {
            console.log("inside candrop");
            console.log("source is %o", item.id);
            console.log("target is %o", props.item.id);

            const sourceId = item.id;
            const targetId = props.item.id;
            return props.canDrop(sourceId, targetId);
        }
    };

    const [dropProps, dropTargetRef] = useDrop(dropSpec);

    switch (props.item.type) {
        case ListItemType.SINGLE_EVENT:
            result = <SingleEvent index={props.index}
                                  id={props.item.id}
                                  content={props.item.content}/>;
            break;
        case ListItemType.GROUP:
            result = <EventGroup id={props.item.id}
                                 onSplit={props.onSplit}
                                 members={props.item.groupContent}/>
            break;
         default:
            throw new Error("no");
    }

            return (
            <div ref={dropTargetRef} className="drop-wrapper">
              {result}
            </div>
            );
}

function ConnectButton(
    props: {onClick: (event: React.MouseEvent<HTMLButtonElement> ) => void}
) {

    return (
        <div>
          <button onClick={props.onClick}>Connect</button>
        </div>
    );
}

function makeDummyEvent(): EventContent {
    return {
        description: "foo",
        id: uuidv4(),
        date: randomPartial()
    };
}


function makeDummyEventWithDate(description: string, date: DateInputs): EventContent {
    var dateField;

    console.log(date);
    
    if (isEmpty(date)) {
        dateField = undefined;
    } else {
        dateField = new PartialDate(date);
        console.log(dateField.toString());
    }
        
    
    return {
        description,
        id: uuidv4(),
        date: dateField
    };
}

function makeEmptyState(): PageState {
    return {canMoveValue: false, eventList: []};
}

export function GroupAndMoveDemo() {
    const [state, dispatch] = useReducer(reduceEventList, makeEmptyState());

    console.log("x is %o", state.canMoveValue);
    
    const [sourcePosition, setSourcePosition] = useState<number>(0);
    const [targetPosition, setTargetPosition] = useState<number>(0);
    const [firstItemToConnect, setFirstItemToConnect] = useState<number>(0);

    const [splitItemIndex, setSplitItemIndex] = useState<number>(0);
    const [splitGroupOffset, setSplitGroupOffset] = useState<number>(0);

    const [mwgItemIndex, setMwgItemIndex] = useState<number>(0);
    const [mwgSourceGroupOffset, setMwgSourceGroupOffset] = useState<number>(0);
    const [mwgTargetGroupOffset, setMwgTargetGroupOffset] = useState<number>(0);


    const handleTargetPositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTargetPosition(parseInt(e.target.value));
    };

    const handleSourcePositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSourcePosition(parseInt(e.target.value));
    };

    const handleFirstItemToConnectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFirstItemToConnect(parseInt(e.target.value));
    };

    const handleSplitItemIndexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSplitItemIndex(parseInt(e.target.value));
    };

    
    const handleSplitGroupOffsetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSplitGroupOffset(parseInt(e.target.value));
    };

    const handleMwgItemIndexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMwgItemIndex(parseInt(e.target.value));
    };

    const handleMwgSourceGroupOffset = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMwgSourceGroupOffset(parseInt(e.target.value));
    };

    const handleMwgTargetGroupOffset = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMwgTargetGroupOffset(parseInt(e.target.value));
    };


    function handleSwap(sourceId: string, targetId: string) {
        console.log("a swap was requested");
        dispatch({type: ActionType.MOVE_BY_ID, sourceId, targetId});
    }

    function canDrop(sourceId: string, targetId: string): boolean {
        return true;
    }

    const lastIndex = state.eventList.length - 1;


    const [dateInputs, setDateInputs] = useState({year: 1940} as DateInputs);
    const [eventDescription, setEventDescription] = useState("");

    function addDate() {
        if (eventDescription === "") {
            notification.error({
                message: 'Error',
                description: 'Event description cannot be blank'
            });
        } else {
            dispatch(
                {type: ActionType.ADD_ITEM,
                 content: makeDummyEventWithDate(eventDescription, dateInputs)}
            )
        };
    }

    const [sequenceName, setSequenceName] = useState("Sequence 1");
    
    function download() {
        if (sequenceName === "") {
            notification.error({
                message: 'Error',
                description: 'Please set a name for the sequence'
            });
            return;
        }
        
        const content = JSON.stringify(state.eventList, null, 4);
        var data = new Blob([content], {type: 'application/json'});
        var csvURL = window.URL.createObjectURL(data);
        const tempLink = document.createElement('a');
        tempLink.href = csvURL;
        tempLink.setAttribute('download', sequenceName + '.json');
        setSequenceName("");
        tempLink.click();
    }

    return (
        <DispatchContext.Provider value={dispatch}>
          <DndProvider backend={HTML5Backend}>
            <div>
              <h1>Group and Move Demo</h1>

              <h2>Values</h2>

              <div>
                <label>Sequence name: <input type="text"
                                            value={sequenceName}
                                            onChange={(e) => setSequenceName(e.target.value)}/>
                </label>
              </div>
                  

              <p>Can move: {state.canMoveValue.toString()}</p>
              
              <p>Count: {state.eventList.length}</p>

              <button onClick={download}>Download</button>

              <div>
                {
                    state.eventList.map((x, i) => {
                        const handleSplit: SplitHandler = (groupOffset) => {
                            console.log("requested at %o", groupOffset);
                            dispatch(
                                {
                                    type: ActionType.SPLIT_GROUP_AT_INDEX,
                                    itemIndex: i,
                                    groupOffset
                                })
                        };


                        return (
                            <div key={x.id}>
                              <EventItemInList key={x.id}
                                               index={i} 
                                               item={x}
                                               onSplit={handleSplit}
                                               onSwap={handleSwap}
                                               canDrop={canDrop}/>
                              {i < lastIndex && <ConnectButton onClick={() => dispatch({type: ActionType.CONNECT_TO_ADJACENT_ITEM, firstItem: i})}/>}
                            </div>
                        )
                    })
                }
              </div>

              <h2>Author Dates</h2>

              <div>
                <label>Description
                  <input type="text" value={eventDescription} onChange={(e) => setEventDescription(e.target.value)}/></label>
                
                {JSON.stringify(dateInputs)}
                
                <DateAuthoringComponent value={dateInputs} onChange={setDateInputs}/>
                <button onClick={addDate}>Add item</button>
              </div>

              <h2>Actions</h2>

              <div>
                <button onClick={() => dispatch({type: ActionType.ADD_ITEM, content: makeDummyEvent()})}>Add item</button>
              </div>

              <div>
                <button onClick={() => dispatch({type: ActionType.ADD_ITEM_WITH_UNDEFINED_DATE})}>Add time-unconstrained item</button>
              </div>

              
              
              <div>
                <label>Source position
                  <input type="number"
                         value={sourcePosition}
                         onChange={handleSourcePositionChange}/>
                </label>

                <label>Target position
                  <input type="number"
                         value={targetPosition}
                         onChange={handleTargetPositionChange}/>
                </label>


                <button onClick={() => dispatch({type: ActionType.MOVE_ITEM, sourcePosition, targetPosition})}>Move item</button>
              </div>

              <div>
                <label>First item
                  <input type="number"
                         value={firstItemToConnect}
                         onChange={handleFirstItemToConnectChange}/>
                </label>
                <button onClick={() => dispatch({type: ActionType.CONNECT_TO_ADJACENT_ITEM, firstItem: firstItemToConnect})}>Connect to adjacent item</button>
              </div>

              <div>
                <label>Item index
                  <input type="number"
                         value={splitItemIndex} onChange={handleSplitItemIndexChange}/>
                </label>

                <label>Group offset
                  <input type="number"
                         value={splitGroupOffset} onChange={handleSplitGroupOffsetChange}/>
                </label>

                <button onClick={() => dispatch({type: ActionType.SPLIT_GROUP_AT_INDEX, itemIndex: splitItemIndex, groupOffset: splitGroupOffset})}>Split group</button>
              </div>

              <div>
                <label>Item index
                  <input type="number" value={mwgItemIndex} onChange={handleMwgItemIndexChange}/>
                </label>

                <label>Source group offset
                  <input type="number" value={mwgSourceGroupOffset} onChange={handleMwgSourceGroupOffset}/>
                </label>

                <label>Target group offset
                  <input type="number" value={mwgTargetGroupOffset} onChange={handleMwgTargetGroupOffset}/>
                </label>

                <button onClick={() => dispatch({type: ActionType.MOVE_EVENT_WITHIN_GROUP, itemIndex: mwgItemIndex, sourceGroupOffset: mwgSourceGroupOffset, targetGroupOffset: mwgTargetGroupOffset})}>Foo</button>

              </div>
            </div>
          </DndProvider>
        </DispatchContext.Provider>
    );
}

