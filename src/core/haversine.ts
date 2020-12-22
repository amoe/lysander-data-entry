// This code adapted from <https://stackoverflow.com/questions/2637023/>

export interface SpatialPoint {
    latitude: number;
    longitude: number;
}

function degreesToRadians(x: number) {
    return x * Math.PI / 180;
}

function radiansToDegrees(x: number) {
    return x * 180 / Math.PI;
}

// Distance is specified in metres.
export function destinationPoint(point: SpatialPoint, bearing: number, distance: number) {
    distance = distance / (6371 * 1000);
    bearing = degreesToRadians(bearing);

    var lat1 = degreesToRadians(point.latitude)
    var lon1 = degreesToRadians(point.longitude)

    var lat2 = Math.asin(
        Math.sin(lat1) * Math.cos(distance)
        + Math.cos(lat1) * Math.sin(distance) * Math.cos(bearing)
    );

    var lon2 = lon1 + Math.atan2(
        Math.sin(bearing) * Math.sin(distance) * Math.cos(lat1), 
        Math.cos(distance) - Math.sin(lat1) * Math.sin(lat2)
    );

    if (isNaN(lat2) || isNaN(lon2))
        return null;

    return {
        latitude: radiansToDegrees(lat2),
        longitude: radiansToDegrees(lon2)
    }
}
