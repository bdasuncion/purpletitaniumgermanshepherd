import { Point, Shape, Type } from './shape.model'
import { Circle } from './circle.model'
import { Line } from './line.model'

export class Rect implements Shape {
  readonly center: Point;
  readonly width: number;
  readonly height: number;
  readonly type: Type;

  constructor(x: number, y: number, width: number, height: number) {
    this.center = <Point>{ x, y };
    this.type = Type.RECT;
    this.width = width;
    this.height = height;
  }

  collides(other: Shape): boolean {
    switch (other.type) {
      case Type.CIRCLE:
        const circle: Circle = Circle.fromShape(other);
        return this.collideWithCircle(circle);
      case Type.RECT:
          const rectangle: Rect = Rect.fromShape(other);
          return this.collideWithRect(rectangle);
      case Type.LINE:
        const line:Line = Line.fromShape(other);
        return this.collideWithLine(line);
      default:
        throw new Error(`Invalid shape type!`);
    }
  }

  collideWithCircle(circle:Circle):boolean {
    return circle.collideWithRect(this);
  }

  collideWithRect(rect:Rect):boolean {
    const rectangleCenter: Point = rect.center;
    const xDist: number = Math.abs(this.center.x - rectangleCenter.x)
    const yDist: number = Math.abs(this.center.y - rectangleCenter.y)
    
    return (xDist <= (this.width/2 + rect.width/2)) && 
        (yDist <= (this.height/2 + rect.height/2))
  }

  collideWithLine(line:Line):boolean {
    return line.collidesWithRectangle(this);
  }

  getAllSides():Line[] {
    var sides:Line[] = [];
    sides.push(new Line(this.center.x - this.width/2, this.center.y + this.height/2, 
      this.center.x + this.width/2, this.center.y + this.height/2));
  
    sides.push(new Line(this.center.x - this.width/2, this.center.y - this.height/2, 
      this.center.x + this.width/2, this.center.y - this.height/2));

    sides.push(new Line(this.center.x - this.width/2, this.center.y + this.height/2, 
      this.center.x - this.width/2, this.center.y  - this.height/2));

    sides.push(new Line(this.center.x + this.width/2, this.center.y + this.height/2, 
      this.center.x + this.width/2, this.center.y  - this.height/2));

    return sides;
  }
  /**
   * Typecasts a Shape object into this Shape type
   * @param other the Shape object
   * @returns a Rect object
   */
  static fromShape(other: Shape): Rect {
    const polymorph = <any>other;
    if (!polymorph.width || !polymorph.height) {
      throw new Error('Shape is invalid! Cannot convert to a Rectangle');
    }

    return new Rect(
      polymorph.center.x,
      polymorph.center.y,
      polymorph.width,
      polymorph.height,
    );
  }
}
