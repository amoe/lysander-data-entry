
const DATASET_NAME = 'Lysander Flights';
const ARC_NAME = 'LysanderArc1';


const SAMPLE_ROWS = [
    ['2019-11-01 08:30:00 +00:00', -0.155861, 50.824926, -0.087816, 50.867578]
];

// If you have two fields like SOMETHING_longitude, SOMETHING_latitude, kepler
// will combine it into a Point.

function makeData(rows: any) {
    return {
        fields: [
            { name: 'flight_datetime', format: 'YYYY-M-D H:m:s', type: 'timestamp' },
            { name: 'start_longitude', format: '', type: 'real' },
            { name: 'start_latitude', format: '', type: 'real' },
            { name: 'end_longitude', format: '', type: 'real' },
            { name: 'end_latitude', format: '', type: 'real' }
        ],
        rows: rows
    };
}


const myArc = {
    id: "zslehy",
    type: "arc",
    config: {
        dataId: "test_trip_data",
        label: ARC_NAME,
        columns: {
            lat0: "start_latitude",
            lng0: "start_longitude",
            lat1: "end_latitude",
            lng1: "end_longitude"
        },
        isVisible: true,
    }
};

const sampleConfig = {
    visState: {
        filters: [
        ],
        layers: [myArc]
    }
};


export function makeKeplerData(rows: any) {
    return {
        datasets: [{
            info: {
                label: DATASET_NAME,
                id: 'test_trip_data'
            },
            data: makeData(rows)
        }],
        option: {
            centerMap: true,
        },
        config: sampleConfig
    };
}
