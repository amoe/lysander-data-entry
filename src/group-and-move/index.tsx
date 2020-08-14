import React, {useReducer, useState} from 'react';
import {DndProvider, useDrag, useDrop, DragSourceMonitor, DropTargetMonitor} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import {cloneDeep} from 'lodash';
import uuidv4 from 'uuid/v4';
import './group-and-move-demo.css';
import {reduceEventList} from './reducer';
import {
    ActionType, DragObject, DraggableType, EventItem, EventContent, 
    ListItemType, EventList, SplitHandler
} from './interfaces';

function ContentDisplay(props: {value: EventContent}) {
    return (
        <span className="event-content-display">{props.value}</span>
    );
}


function GroupMember(props: {x: EventContent}) {
    return (
        <div className="event-group-member">
          <ContentDisplay value={props.x}/>
        </div>
    )
}

// Usedrag needs to be called twice because it can't be passed as props.

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
            isDragging: !!monitor.isDragging()
        })
    };
    const [dragProps, dragSourceRef, dragPreviewRef] = useDrag(dragSpec);

    const lastIndex = props.members.length - 1;

    return (
        <div ref={dragSourceRef} className="event-group">
          Group of {props.members.length} items, contents:
          {
              props.members.map((x, i) => {
                  return (
                      <div key={i}>  {/* not sure if key here is right! */}
                        <GroupMember x={x}/>
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
        onSwap: Function
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
            return true;
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
////
function ConnectButton(
    props: {onClick: (event: React.MouseEvent<HTMLButtonElement> ) => void}
) {

    return (
        <div>
          <button onClick={props.onClick}>Connect</button>
        </div>
    );
}



export function GroupAndMoveDemo() {
    const [state, dispatch] = useReducer(reduceEventList, []);
    const [sourcePosition, setSourcePosition] = useState<number>(0);
    const [targetPosition, setTargetPosition] = useState<number>(0);
    const [firstItemToConnect, setFirstItemToConnect] = useState<number>(0);

    const [splitItemIndex, setSplitItemIndex] = useState<number>(0);
    const [splitGroupOffset, setSplitGroupOffset] = useState<number>(0);

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

    function handleSwap(sourceId: string, targetId: string) {
        console.log("a swap was requested");
        dispatch({type: ActionType.MOVE_BY_ID, sourceId, targetId});
    }

    const lastIndex = state.length - 1;
    //
    return (
        <DndProvider backend={HTML5Backend}>
          <div>
            <h1>Group and Move Demo</h1>

            <h2>Values</h2>

            <p>Count: {state.length}</p>

            <div>
              {
                  state.map((x, i) => {
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
                                             onSwap={handleSwap}/>
                            {i < lastIndex && <ConnectButton onClick={() => dispatch({type: ActionType.CONNECT_TO_ADJACENT_ITEM, firstItem: i})}/>}
                          </div>
                      )
                  })
              }
            </div>

            <h2>Actions</h2>

            <div>
              <button onClick={() => dispatch({type: ActionType.ADD_ITEM, content: "foo " + Date.now()})}>Add item</button>
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
          </div>
        </DndProvider>
    );
}

