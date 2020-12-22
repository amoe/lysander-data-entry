import React from 'react';
import {destinationPoint} from '../core/haversine';
import {cardinalToBearing} from './functions';
import {RelativePosition} from './interfaces';

export function PositionView(props: {value: RelativePosition}) {
    const {location, distance, cardinal} = props.value;

    console.log("value of position is %o", props.value);
    
    const result = destinationPoint(location, cardinalToBearing(cardinal), distance);
    
    return <div>Position: {result.latitude}, {result.longitude}</div>;
}
