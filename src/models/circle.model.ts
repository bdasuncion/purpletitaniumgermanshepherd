import { Rect } from './rect.model'
import { Line } from './line.model'
import { distanceBetween, Point, Shape, Type } from './shape.model'

export class Circle implements Shape {
  readonly center: Point;
  readonly radius: number;
  readonly type: Type;

  constructor(x: number, y: number, radius: number) {
    this.center = <Point>{ x, y };
    this.type = Type.CIRCLE;
    this.radius = radius;
  }

  collides(other: Shape): boolean {
    switch (other.type) {
      case Type.CIRCLE:
        const _other = <Circle>(<any>other);
        return this.collideWithCircle(_other);
      case Type.RECT:
        const rect: Rect = Rect.fromShape(other);
        return this.collideWithRect(rect);
      case Type.LINE:
        const line: Line = Line.fromShape(other);
        return this.collideWithLine(line);
      default:
        throw new Error(`Invalid shape type!`);
    }
  }

  collideWithRect(rect:Rect): boolean {
   
    const target: Point = rect.center;
    const pointDistance: Point = <Point>{
      x: Math.abs(this.center.x - target.x),
      y: Math.abs(this.center.y - target.y),
    };

    if (pointDistance.x > rect.width / 2 + this.radius) {
      return false;
    } else if (pointDistance.y > rect.height / 2 + this.radius) {
      return false;
    } else if (pointDistance.x <= rect.width / 2) {
      return true;
    } else if (pointDistance.y <= rect.height / 2) {
      return true;
    }

    const circleToRectDistance =
      Math.pow(pointDistance.x - rect.width / 2, 2) +
      Math.pow(pointDistance.y - rect.height / 2, 2);

    return circleToRectDistance <= Math.pow(this.radius, 2);
  }

  collideWithCircle(circle:Circle):boolean {
    const distance = distanceBetween(this.center, circle.center);

    return distance <= this.radius + circle.radius;
  }

  collideWithLine(line:Line):boolean {
    return line.collideWithCircle(this);
  }

  /**
   * Typecasts a Shape object into this Shape type
   * @param other the Shape object
   * @returns a Circle object
   */
  static fromShape(other: Shape): Circle {
    const polymorph = <any>other;
    if (!polymorph.radius) {
      throw new Error('Shape is invalid! Cannot convert to a Circle');
    }

    return new Circle(polymorph.center.x, polymorph.center.y, polymorph.radius);
  }
}
