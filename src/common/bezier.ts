import Point from './point';
// interface Point {}

export default class Bezier {
  startPoint: Point
  control1: Point
  control2: Point
  endPoint: Point
  startWidth: Point
  endWidth: Point
  constructor(startPoint: Point, control2: Point, control1: Point, endPoint: Point, startWidth: Point, endWidth: Point) {
    this.startPoint = startPoint;
    this.control2 = control2;
    this.control1 = control1;
    this.endPoint = endPoint;
    this.startWidth = startWidth;
    this.endWidth = endWidth;
  }
  static fromPoints(points: Point[], widths: { start: Point, end: Point}) {
    const c2 = this.calculateControlPoints(points[0], points[1], points[2]).c2;
    const c3 = this.calculateControlPoints(points[1], points[2], points[3]).c1;
    return new Bezier(points[1], c2, c3, points[2], widths.start, widths.end);
  }
  static calculateControlPoints(s1: Point, s2: Point, s3: Point) {
    const dx1 = s1.x - s2.x;
    const dy1 = s1.y - s2.y;
    const dx2 = s2.x - s3.x;
    const dy2 = s2.y - s3.y;
    const m1 = { x: (s1.x + s2.x) / 2.0, y: (s1.y + s2.y) / 2.0 };
    const m2 = { x: (s2.x + s3.x) / 2.0, y: (s2.y + s3.y) / 2.0 };
    const l1 = Math.sqrt((dx1 * dx1) + (dy1 * dy1));
    const l2 = Math.sqrt((dx2 * dx2) + (dy2 * dy2));
    const dxm = (m1.x - m2.x);
    const dym = (m1.y - m2.y);
    const k = l2 / (l1 + l2);
    const cm = { x: m2.x + (dxm * k), y: m2.y + (dym * k) };
    const tx = s2.x - cm.x;
    const ty = s2.y - cm.y;
    return {
      c1: new Point(m1.x + tx, m1.y + ty, new Date()),
      c2: new Point(m2.x + tx, m2.y + ty, new Date()),
    };
  }
  length() {
    const steps = 10;
    let length = 0;
    let px = 0;
    let py = 0;
    for (let i = 0; i <= steps; i += 1) {
      const t = i / steps;
      const cx = this.point(t, this.startPoint.x, this.control1.x, this.control2.x, this.endPoint.x);
      const cy = this.point(t, this.startPoint.y, this.control1.y, this.control2.y, this.endPoint.y);
      if (i > 0) {
        const xdiff = cx - px;
        const ydiff = cy - py;
        length += Math.sqrt((xdiff * xdiff) + (ydiff * ydiff));
      }
      px = cx;
      py = cy;
    }
    return length;
  }
  point(t: number, start: number, c1: number, c2: number, end: number) {
    return (start * (1.0 - t) * (1.0 - t) * (1.0 - t))
      + (3.0 * c1 * (1.0 - t) * (1.0 - t) * t)
      + (3.0 * c2 * (1.0 - t) * t * t)
      + (end * t * t * t);
  }
}