import { distanceBetween, Point, Shape, Type } from './shape.model'
import { Circle } from './circle.model';
import { Rect } from './rect.model';

export class Line implements Shape {
    readonly center: Point;
    readonly endpoint: Point;
    readonly type: Type;
  
    constructor(startX: number, startY: number, endX: number, endY: number) {
      this.center = <Point>{ x:startX, y:startY };
      this.endpoint = <Point>{x: endX, y:endY};
      this.type = Type.LINE;
    }

    collides(other: Shape): boolean {
        switch (other.type) {
            case Type.CIRCLE:
                const circle:Circle = Circle.fromShape(other);
                return this.collideWithCircle(circle);
            case Type.RECT:
                const rectangle:Rect = Rect.fromShape(other);
                return this.collidesWithRectangle(rectangle);
            case Type.LINE:
                const line:Line = Line.fromShape(other);
                return this.collidedWithLine(line);
            default:
                throw new Error(`Invalid shape type!`);
          }
    }

    getPoints():Point[] {
        var points:Point[] = [];
        const xDiff = this.center.x - this.endpoint.x;
        const yDiff = this.center.y - this.endpoint.y; 
        const countPoints = Math.max(Math.abs(xDiff), Math.abs(yDiff))
        for (var i = 0; i < countPoints; ++i) {
            points.push(<Point>{x: this.center.x - xDiff/countPoints, y:this.center.y - yDiff/countPoints})
        }
        return points;
    }

    collideWithCircle(circle:Circle): boolean {
        if (distanceBetween(circle.center, this.center) <= circle.radius) {
            return true;
        }

        if (distanceBetween(circle.center, this.endpoint) <= circle.radius) {
            return true;
        }

        var vectorLine:Point = <Point>{ x: this.endpoint.x - this.center.x, 
            y:this.endpoint.y - this.center.y};
        var vectorCenterToStart = <Point>{x: this.center.x - circle.center.x, 
            y: this.center.y - circle.center.y};
        
        var a:number = this.dotProduct(vectorLine, vectorLine);
        var b:number = 2*this.dotProduct(vectorCenterToStart, vectorLine);
        var c:number = this.dotProduct(vectorCenterToStart, vectorCenterToStart) - (circle.radius*circle.radius);

        var discriminant:number = b*b-4*a*c;
        if( discriminant < 0 ) {
            return false;
        } else {
            discriminant = Math.sqrt(discriminant);

            var t1:number = (-b - discriminant)/(2*a);
            var t2:number = (-b + discriminant)/(2*a);

            if( t1 >= 0 && t1 <= 1 ) {
                // t1 is the intersection, and it's closer than t2
                // (since t1 uses -b - discriminant)
                // Impale, Poke
                return true ;
            }

            // here t1 didn't intersect so we are either started
            // inside the sphere or completely past it
            if( t2 >= 0 && t2 <= 1 ) {
                // ExitWound
                return true ;
            }
        }
        return false;
    }

    collidesWithRectangle(rect:Rect):boolean {

        var xDiff:number = Math.abs(rect.center.x - this.center.x);
        var yDiff:number = Math.abs(rect.center.y - this.center.y);
        if (xDiff <= rect.width/2 && yDiff <= rect.height/2) {
            return true;
        }

        xDiff = Math.abs(rect.center.x - this.endpoint.x);
        yDiff = Math.abs(rect.center.y - this.endpoint.y);

        if (xDiff <= rect.width/2 && yDiff <= rect.height/2) {
            return true;
        }

        var sides:Line[] = rect.getAllSides();

        for (var i = 0; i < sides.length; ++i) {
            if (sides[i].collidedWithLine(this)) {
                return true;
            }
        }
        return false;
    }

    collidedWithLine(line:Line):boolean {
        var r:Point = this.subtractPoints(this.endpoint, this.center);
        var s:Point = this.subtractPoints(line.endpoint, line.center);
        var uNumerator:number = this.crossProduct(this.subtractPoints(line.center, this.center), r);
        var denominator:number = this.crossProduct(r, s);

        if (uNumerator == 0 && denominator == 0) {
            // They are coLlinear
		
		    // Do they touch? (Are any of the points equal?)
            if (this.equalPoints(this.center, line.center) || this.equalPoints(this.center, line.endpoint) || 
               this.equalPoints(this.endpoint, line.center) || this.equalPoints(this.endpoint, line.endpoint)) {
                return true
            }

            // Do they overlap? (Are all the point differences in either direction the same sign)
            return !this.allEqual(
				(line.center.x - this.center.x < 0),
				(line.center.x - this.endpoint.x < 0),
				(line.endpoint.x - this.center.x < 0),
				(line.endpoint.x - this.endpoint.x < 0)) ||
			!this.allEqual(
				(line.center.y - this.center.y < 0),
				(line.center.y - this.endpoint.y < 0),
				(line.endpoint.y - this.center.y < 0),
				(line.endpoint.y - this.endpoint.y < 0));
        }

        if (denominator == 0) {
            // lines are paralell
            return false;
        }

        var u:number = uNumerator / denominator;
	    var t:number = this.crossProduct(this.subtractPoints(line.center, this.center), s) / denominator;

	    return (t >= 0) && (t <= 1) && (u >= 0) && (u <= 1);
    }

    subtractPoints(point1:Point, point2:Point) : Point {
        let result:Point = <Point>{x: point1.x - point2.x, y:point1.y - point2.y };
        return result;
    }

    crossProduct(point1:Point, point2:Point) : number {
        return point1.x * point2.y - point1.y * point2.x;
    }
    
    equalPoints(point1:Point, point2:Point) : boolean {
        return (point1.x == point2.x) && (point1.y == point2.y)
    }

    dotProduct(point1:Point, point2:Point):number {
        return point1.x*point2.x + point1.y*point2.y;
    }

    allEqual(...args: boolean[]) :boolean {
        var firstValue = args[0],
            i;
        for (i = 1; i < args.length; i += 1) {
            if (args[i] != firstValue) {
                return false;
            }
        }
        return true;
    }

    static fromShape(other: Shape): Line {
        const polymorph = <any>other;
        if (!polymorph.endpoint) {
          throw new Error('Shape is invalid! Cannot convert to a Line');
        }
    
        return new Line(
          polymorph.center.x,
          polymorph.center.y,
          polymorph.endpoint.x,
          polymorph.endpoint.y,
        );
      }
} 