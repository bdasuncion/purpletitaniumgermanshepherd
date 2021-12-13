export interface Point {
  readonly x: number;
  readonly y: number;
}

export enum Type {
  CIRCLE = 'CIRCLE',
  RECT = 'RECT',
  LINE = 'LINE',
}

export interface Shape {
  readonly center: Point;
  readonly type: Type;

  /**
   * Checks if this shape collides with the other shape
   * @param other The other shape of any type
   */
  collides(other: Shape): boolean;
}

/**
 * Gets the distance between two points using distance formula
 * @param start The starting point
 * @param terminal The terminal point
 * @returns The distance between the two points
 */
export function distanceBetween(start: Point, terminal: Point): number {
  return Math.sqrt(
    Math.pow(start.x - terminal.x, 2) + Math.pow(start.y - terminal.y, 2),
  );
}
