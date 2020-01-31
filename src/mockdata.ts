export default {
    "datasets": [
        {
            "info": {
                "label": "Lysander Flights",
                "id": "test_trip_data"
            },
            "data": {
                "fields": [
                    {
                        "name": "flight_datetime",
                        "format": "YYYY-M-D H:m:s",
                        "type": "timestamp"
                    },
                    {
                        "name": "start_longitude",
                        "format": "",
                        "type": "real"
                    },
                    {
                        "name": "start_latitude",
                        "format": "",
                        "type": "real"
                    },
                    {
                        "name": "end_longitude",
                        "format": "",
                        "type": "real"
                    },
                    {
                        "name": "end_latitude",
                        "format": "",
                        "type": "real"
                    }
                ],
                "rows": [
                    [
                        "1940-01-01 08:30:00 +00:00",
                        -0.7063888888888888,
                        50.84583333333333,
                        2.661111111111111,
                        50.33222222222222
                    ],
                    [
                        "1941-02-03 21:30:00 +00:00",
                        -0.7063888888888888,
                        50.84583333333333,
                        1.6366666666666667,
                        49.305277777777775
                    ]
                ]
            }
        }
    ],
    "option": {
        "centerMap": true
    },
    "config": {
        "visState": {
            "filters": [],
            "layers": [
                {
                    "id": "zslehy",
                    "type": "arc",
                    "config": {
                        "dataId": "test_trip_data",
                        "label": "LysanderArc1",
                        "columns": {
                            "lat0": "start_latitude",
                            "lng0": "start_longitude",
                            "lat1": "end_latitude",
                            "lng1": "end_longitude"
                        },
                        "isVisible": true
                    }
                }
            ]
        }
    }
}
