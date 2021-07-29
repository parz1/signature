export default class Point {
  x: number
  y: number
  time: Date
  constructor(x: number, y: number, time: Date) {
    this.x = x;
    this.y = y;
    this.time = time || Date.now();
  }
  distanceTo(start: Point) {
    return Math.sqrt(Math.pow(this.x - start.x, 2) + Math.pow(this.y - start.y, 2));
  }
  equals(other: Point) {
    return this.x === other.x && this.y === other.y && this.time === other.time;
  }
  velocityFrom(start: Point) {
    return (this.time !== start.time) ? this.distanceTo(start) / (this.time.getTime() - start.time.getTime()) : 0;
  }
}