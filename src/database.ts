export class Point {
  constructor(public x: number, public y: number) {}
}

export class Data {
  constructor(public value: -1 | 1, public point: Point) {}
}

export function getDataset(pointCount: number, lineSlope: number, lineOffset: number): Data[] {
  let dataset: Data[] = [];
  let value: -1 | 1;

  for (let i = 0; i < pointCount; i++) {
    let point = new Point(Math.random(), Math.random()); // normalized (0, 1]
    value = point.y + lineOffset > point.x * lineSlope ? -1 : 1;
    dataset.push(new Data(value, point));
  }
  
  return dataset
}