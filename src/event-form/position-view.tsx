import React from 'react';
import {destinationPoint} from '../core/haversine';
import {cardinalToBearing} from './functions';
import {RelativePosition} from './interfaces';

export function PositionView(props: {value: RelativePosition}) {
    const {location, distance, cardinal} = props.value;

    if (location.latitude === null || location.longitude === null) {
        return <i>Invalid latitude/longitude for this location</i>
    } else {
        // tsc isn't smart enough to figure this one out
        const latitude = location.latitude;
        const longitude = location.longitude;
        const result = destinationPoint(
            {latitude, longitude}, cardinalToBearing(cardinal), distance
        );
        return <div>
          <div>Position: {result.latitude.toFixed(6)}, {result.longitude.toFixed(6)}</div>
        </div>;
    }
}
