import {destinationPoint} from './haversine';

it('works', () => {
    const start = {latitude: 50.824994, longitude: -0.155834};
    const result = destinationPoint(start, 0, 1000);   // 1km north
    
    expect(result.latitude).toBeCloseTo(50.83397715284119);
    expect(result.longitude).toBeCloseTo(-0.155834);
});

