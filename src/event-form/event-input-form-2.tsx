import React, {useState} from 'react';
import {
    EventInputDetails, Location, CardinalPoint, RelativePosition
} from './interfaces';
import {UserFacingTimeOffset} from '../core/time-offset';
import {
    InputNumber, TimePicker, Input, Select
} from 'antd';
import moment from 'moment';
import {PositionView} from './position-view';
import {strictFind} from '../utility';

interface CompassAliasMap {
    [key: string]: string;
}

const SHORT_COMPASS_ALIAS: CompassAliasMap = {
    [CardinalPoint.NORTH]: 'N',
    [CardinalPoint.NORTH_NORTH_EAST]: 'NNE',
    [CardinalPoint.NORTH_EAST]: 'NE',
    [CardinalPoint.EAST_NORTH_EAST]: 'ENE',
    [CardinalPoint.EAST]: 'E',
    [CardinalPoint.EAST_SOUTH_EAST]: 'ESE',
    [CardinalPoint.SOUTH_EAST]: 'SE',
    [CardinalPoint.SOUTH_SOUTH_EAST]: 'SSE',
    [CardinalPoint.SOUTH]: 'S',
    [CardinalPoint.SOUTH_SOUTH_WEST]: 'SSW',
    [CardinalPoint.SOUTH_WEST]: 'SW',
    [CardinalPoint.WEST_SOUTH_WEST]: 'WSW',
    [CardinalPoint.WEST]: 'W',
    [CardinalPoint.WEST_NORTH_WEST]: 'WNW',
    [CardinalPoint.NORTH_WEST]: 'NW',
    [CardinalPoint.NORTH_NORTH_WEST]: 'NNW'
};



export function EventInputForm(
    props: {
        value: EventInputDetails,
        onChange: (v: EventInputDetails) => void,
        availableLocations: Location[]
    }) {
    const handleChange = (e: React.ChangeEvent<any>) => {
        const target = e.currentTarget;
        const value = target.value;
        console.log("child: propagating change with value %o", value);
        props.onChange({...props.value, [target.name]: value});
    };

    const f = (val: string | number | undefined) => {
        if (typeof val === 'string') throw new Error("string");
        if (val === undefined) throw new Error("undefined");
        
        props.onChange(
            {...props.value, timeOffset: {...props.value.timeOffset, dayOrdinal: val}}
        );
    };

    const g = (chosenTime: moment.Moment | null, timeString: string) => {
        if (chosenTime === null) throw new Error("cannot unset time");
        
        console.log("setting value");
        console.log("chosen time is %o");

        props.onChange(
            {
                ...props.value,
                timeOffset: {
                    ...props.value.timeOffset,
                    hour: chosenTime.hour(),
                    minute: chosenTime.minute()
                }
            }
                 
        );
    };

    // We only care about the first value
    function handleLocationChange(locationId: string) {
        props.onChange(
            {...props.value, locationId}
        );
    }

    // TS hack to convert cardinals
    function handleCardinalChange(x: string) {
        props.onChange(
            {...props.value,
             relativeCardinal: CardinalPoint[x as keyof typeof CardinalPoint]}
        );
    }


    function toMoment(offset: UserFacingTimeOffset) {
        return moment({hour: offset.hour, minute: offset.minute});
    }

    const format = 'HH:mm';

    const defaultValue = moment('12:08', format);

    console.log("available locations are %o", props.availableLocations);


    function makeNumericHandler(fieldName: string) {
        return (val: string | number | undefined) => {
            props.onChange({...props.value, [fieldName]: val});
        };
    }

    function getRelativePosition(): RelativePosition | undefined {
        if (props.value.locationId === undefined) {
            return undefined;
        } else {
            console.log("locationid is %o", props.value.locationId);
            
            return {
                height: props.value.relativeHeight,
                distance: props.value.relativeDistance,
                cardinal: props.value.relativeCardinal,
                location: strictFind(
                    props.availableLocations,
                    x => x.id === props.value.locationId
                )
            };
        }
    }

    const rp = getRelativePosition();
    
    return (
        <div>
          <div>

            <div>
              <span>Description:</span>
              <input type="text"
                     name="description"
                     value={props.value.description}
                     onChange={handleChange}/>
            </div>

            
            <div>
              <span>Day:</span>
              <InputNumber value={props.value.timeOffset.dayOrdinal}
                           min={1}
                           onChange={f}/>
            </div>


            <div>
              <span>Time:</span>
              <TimePicker defaultValue={defaultValue}
                          format={format}
                          value={toMoment(props.value.timeOffset)}
                          onChange={g}/>
            </div>

            
            <span>Location:</span>
            <Select onChange={handleLocationChange} showSearch={true} filterOption={true} optionFilterProp="children" style={{width: 120}}>
              {props.availableLocations.map(x => <Select.Option key={x.id} value={x.id}>{x.codename}</Select.Option>)}
            </Select>
          </div>

          <div>
            <span>Cardinal point:</span>
            <Select onChange={handleCardinalChange} style={{width: 120}}>
              {Object.keys(CardinalPoint).map(x => <Select.Option key={x} value={x}>{SHORT_COMPASS_ALIAS[x]}</Select.Option>)}
            </Select>
          </div>

          <div>
            <span>Relative height:</span>
            <InputNumber value={props.value.relativeHeight}
                         min={0}
                         onChange={makeNumericHandler('relativeHeight')}/>
          </div>

          <div>
            <span>Relative distance:</span>
            <InputNumber value={props.value.relativeDistance}
                         min={0}
                         onChange={makeNumericHandler('relativeDistance')}/>
          </div>

          
          

          <div>
            <span>Reference:</span>
            <Input.TextArea name="reference"
                            maxLength={256}
                            value={props.value.reference}
                            onChange={handleChange}/>
            <span>Quotation:</span>
            <Input.TextArea name="quotation"
                            maxLength={256}
                            value={props.value.quotation}
                            onChange={handleChange}/>
            <span>Notes:</span>
            <Input.TextArea name="notes"
                            maxLength={256}
                            value={props.value.notes}
                            onChange={handleChange}/>
          </div>

          {rp !== undefined && <PositionView value={rp}/>}
        </div>
    );
}
