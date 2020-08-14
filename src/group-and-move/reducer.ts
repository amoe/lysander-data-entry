function reduceEventList(state: EventList, action: Action): EventList {
    const newState = cloneDeep(state);

    switch (action.type) {
        case ActionType.ADD_ITEM:
            return [...state, {type: ListItemType.SINGLE_EVENT, content: action.content, id: uuidv4()}];
        case ActionType.MOVE_ITEM:
            // XXX: error handling
            const removed = newState.splice(action.sourcePosition, 1)[0];
            newState.splice(action.targetPosition, 0, removed);
            return newState;
        case ActionType.MOVE_BY_ID:
            const sourcePosition = state.findIndex(x => x.id === action.sourceId);
            const targetPosition = state.findIndex(x => x.id === action.targetId);
            if (sourcePosition === -1) throw new Error("bad source");
            if (targetPosition === -1) throw new Error("bad source");

            newState[targetPosition] = state[sourcePosition];
            newState[sourcePosition] = state[targetPosition];
            return newState;
        case ActionType.CONNECT_TO_ADJACENT_ITEM:
            return connectToAdjacentItem(cloneDeep(state), action.firstItem);
        case ActionType.SPLIT_GROUP_AT_INDEX:
            return splitGroupAtIndex(cloneDeep(state), action.itemIndex, action.groupOffset);
        default:
            throw new Error("no");
    }
}
