import { Injectable } from '@nestjs/common'
import { Circle } from './models/circle.model'
import { Rect } from './models/rect.model'
import { Line } from './models/line.model'
import {
  CollideShapesRequest,
  CollideShapesResponse
} from './plentina.controller'

@Injectable()
export class PlentinaService {
  /**
   * Simple health check
   * @returns the applicant's name
   */
  healthCheck(): string {
    //throw new Error('Make this function return your name');
    return "BRYAN DAVID ASUNCION"
  }

  doShapesCollide(request: CollideShapesRequest): CollideShapesResponse {
    let result = false;
    if (request.firstShape.radius || request.secondShape.radius) {
      result = this.doesCircleAndCircleCollide(
        request.firstShape.x,
        request.firstShape.y,
        request.firstShape.radius,
        request.secondShape.x,
        request.secondShape.y,
        request.secondShape.radius,
      );
    } else if (
      request.firstShape.radius ||
      (request.secondShape.width && request.secondShape.height)
    ) {
      result = this.doesCircleAndRectCollide(
        request.firstShape.x,
        request.firstShape.y,
        request.firstShape.radius,
        request.secondShape.x,
        request.secondShape.y,
        request.secondShape.width,
        request.secondShape.height,
      );
    } else if (
      (request.firstShape.width && request.firstShape.height) ||
      request.secondShape.radius
    ) {
      result = this.doesCircleAndRectCollide(
        request.secondShape.x,
        request.secondShape.y,
        request.secondShape.radius,
        request.firstShape.x,
        request.firstShape.y,
        request.firstShape.width,
        request.firstShape.height,
      );
    } else if (
      (request.firstShape.width && request.firstShape.height) ||
      (request.secondShape.width && request.secondShape.height)
    ) {
      result = this.doesRectAndRectCollide(
        request.firstShape.x,
        request.firstShape.y,
        request.firstShape.width,
        request.firstShape.height,
        request.secondShape.x,
        request.secondShape.y,
        request.secondShape.width,
        request.secondShape.height,
      );
    } else if (
      (request.firstShape.endX && request.firstShape.endY ) ||
      (request.secondShape.endX && request.secondShape.endY)
    ) {
      result = this.doesLineAndLineCollide(
        request.firstShape.x,
        request.firstShape.y,
        request.firstShape.endX,
        request.firstShape.endY,
        request.secondShape.x,
        request.secondShape.y,
        request.secondShape.endX,
        request.secondShape.endY,
      );
    } else if (
      (request.firstShape.endX && request.firstShape.endY ) ||
      (request.secondShape.radius)
    ) {
      result = this.doesCircleAndLineCollide(
        request.secondShape.x,
        request.secondShape.y,
        request.secondShape.radius,
        request.firstShape.x,
        request.firstShape.y,
        request.firstShape.endX,
        request.firstShape.endY,
      );
    } else if (
      (request.firstShape.radius ) ||
      (request.secondShape.endX && request.secondShape.endY)
    ) {
      result = this.doesCircleAndLineCollide(
        request.firstShape.x,
        request.firstShape.y,
        request.firstShape.radius,
        request.secondShape.x,
        request.secondShape.y,
        request.secondShape.endX,
        request.secondShape.endY,
      );
    } else if (
      (request.firstShape.width && request.firstShape.height ) ||
      (request.secondShape.endX && request.secondShape.endY)
    ) {
      result = this.doesRectAndLineCollide(
        request.firstShape.x,
        request.firstShape.y,
        request.firstShape.width,
        request.firstShape.height,
        request.secondShape.x,
        request.secondShape.y,
        request.secondShape.endX,
        request.secondShape.endY,
      );
    }  else if (
      (request.secondShape.width && request.secondShape.height ) ||
      (request.firstShape.endX && request.firstShape.endY)
    ) {
      result = this.doesRectAndLineCollide(
        request.secondShape.x,
        request.secondShape.y,
        request.secondShape.width,
        request.secondShape.height,
        request.firstShape.x,
        request.firstShape.y,
        request.firstShape.endX,
        request.firstShape.endY,
      );
    } else {
      throw new Error('Invalid shapes!');
    }

    return <CollideShapesResponse>{
      collides: result,
      firstShape: request.firstShape,
      secondShape: request.secondShape,
    };
  }

  /**
   * Checks if a circle and a rectangle collide
   * @param x1 x-coordinate of the circle
   * @param y1 y-coordinate of the circle
   * @param r radius of the circle
   * @param x2 x-coordinate of the rectangle
   * @param y2 y-coordinate of the rectangle
   * @param w width of the rectangle
   * @param h height of the rectangle
   * @returns a boolean if they collide or not
   */
  doesCircleAndRectCollide(
    x1: number,
    y1: number,
    r: number,
    x2: number,
    y2: number,
    w: number,
    h: number,
  ): boolean {
    const circle = new Circle(x1, y1, r);
    const rect = new Rect(x2, y2, w, h);

    return rect.collides(circle);
  }

  /**
   * Checks if a circle and another circle collide
   * @param x1 x-coordinate of the circle
   * @param y1 y-coordinate of the circle
   * @param r1 radius of the circle
   * @param x2 x-coordinate of the second circle
   * @param y2 y-coordinate of the second circle
   * @param r2 radius of the second circle
   * @returns a boolean if they collide or not
   */
  doesCircleAndCircleCollide(
    x1: number,
    y1: number,
    r1: number,
    x2: number,
    y2: number,
    r2: number,
  ): boolean {
    const circle1 = new Circle(x1, y1, r1);
    const circle2 = new Circle(x2, y2, r2);

    return circle1.collides(circle2);
  }

  /**
   * Checks if a rectangle and a second rectangle collide
   * @param x1 x-coordinate of the rectangle
   * @param y1 y-coordinate of the rectangle
   * @param w1 width of the rectangle
   * @param h1 height of the rectangle
   * @param x2 x-coordinate of the second rectangle
   * @param y2 y-coordinate of the second rectangle
   * @param w2 width of the second rectangle
   * @param h2 height of the second rectangle
   * @returns a boolean if they collide or not
   */
  doesRectAndRectCollide(
    x1: number,
    y1: number,
    w1: number,
    h1: number,
    x2: number,
    y2: number,
    w2: number,
    h2: number,
  ): boolean {
    const rect1 = new Rect(x1, y1, w1, h1);
    const rect2 = new Rect(x2, y2, w2, h2);

    return rect1.collides(rect2);
  }

  doesRectAndLineCollide(
    x1: number,
    y1: number,
    w1: number,
    h1: number,
    x2: number,
    y2: number,
    x2end: number,
    y2end: number,
  ): boolean {
    const rect1 = new Rect(x1, y1, w1, h1);
    const line1 = new Rect(x2, y2, x2end, y2end);

    return rect1.collides(line1);
  }

  doesLineAndLineCollide(
    x1: number,
    y1: number,
    x1end: number,
    y1end: number,
    x2: number,
    y2: number,
    x2end: number,
    y2end: number,
  ): boolean {
    const line1 = new Line(x1, y1, x1end, y1end);
    const line2 = new Line(x2, y2, x2end, y2end);

    return line2.collides(line1);
  }

  doesCircleAndLineCollide(
    x1: number,
    y1: number,
    r1: number,
    x2: number,
    y2: number,
    x2end: number,
    y2end: number,
  ): boolean {
    const circle1 = new Circle(x1, y1, r1);
    const line1 = new Line(x2, y2, x2end, y2end);

    return circle1.collides(line1);
  }
}
