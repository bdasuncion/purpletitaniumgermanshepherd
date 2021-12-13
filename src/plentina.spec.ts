import { Test, TestingModule } from '@nestjs/testing'
import { Circle } from './models/circle.model'
import { Rect } from './models/rect.model'
import { Line } from './models/line.model'
import { PlentinaController } from './plentina.controller'
import { PlentinaService } from './plentina.service'
import { Response } from 'express'

describe('PlentinaController', () => {
  let plentinaController: PlentinaController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PlentinaController],
      providers: [PlentinaService],
    }).compile();

    plentinaController = app.get<PlentinaController>(PlentinaController);
  });

  describe('root', () => {
    it('should return "BRYAN DAVID ASUNCION"', () => {
      var res:Response = <any>{
        json: jest.fn(),
        status: jest.fn(),
      };
      expect(plentinaController.healthCheck(res)).toStrictEqual({"name":"BRYAN DAVID ASUNCION"});
    });
  });
});

describe('PlentinaService', () => {
  let plentinaService: PlentinaService;

  beforeEach(async () => {
    plentinaService = new PlentinaService();
  });

  describe('doesCircleAndRectCollide', () => {
    const circle = new Circle(10, 10, 2);

    describe('a colliding circle and rectangle', () => {
      const rectangle = new Rect(9, 9, 1, 1);

      it('should return true', () => {
        expect(circle.collides(rectangle)).toEqual(true);
      });

      it('should return true', () => {
        expect(rectangle.collides(circle)).toEqual(true);
      });
    });

    describe('a non-colliding circle and rectangle', () => {
      const rectangle = new Rect(5, 5, 2, 2);

      it('should return false', () => {
        expect(circle.collides(rectangle)).toEqual(false);
      });

      it('should return false', () => {
        expect(rectangle.collides(circle)).toEqual(false);
      });
    });

    describe('a circle inside rectangle', () => {
      const rectangle = new Rect(10, 10, 1, 1);

      it('should return true', () => {
        expect(circle.collides(rectangle)).toEqual(true);
      });

      it('should return true', () => {
        expect(rectangle.collides(circle)).toEqual(true);
      });
    });

    describe('a rectangle inside circle', () => {
      const rectangle = new Rect(10, 10, 5, 5);

      it('should return true', () => {
        expect(circle.collides(rectangle)).toEqual(true);
      });

      it('should return true', () => {
        expect(rectangle.collides(circle)).toEqual(true);
      });
    });
  });

  describe('doesCircleAndCircleCollide', () => {
    const circle1 = new Circle(10, 10, 1);

    describe('two colliding circles', () => {
      [
        new Circle(12, 10, 1),
        new Circle(10, 12, 1),
        new Circle(11, 11, 1),
      ].forEach((circle2) => {
        it(`should return true for ${JSON.stringify(circle2)}`, () => {
          expect(circle1.collides(circle2)).toEqual(true);
        });

        it(`should return true for ${JSON.stringify(circle2)}`, () => {
          expect(circle2.collides(circle1)).toEqual(true);
        });
      });
    });

    describe('two non-colliding circles', () => {
      const circle2 = new Circle(5, 5, 1);

      it(`should return false for ${JSON.stringify(circle2)}`, () => {
        expect(circle1.collides(circle2)).toEqual(false);
      });

      it(`should return false for ${JSON.stringify(circle2)}`, () => {
        expect(circle2.collides(circle1)).toEqual(false);
      });
    });

    describe('circle inside a circle', () => {
      const circle2 = new Circle(11, 10, 3);

      it(`should return false for ${JSON.stringify(circle2)}`, () => {
        expect(circle1.collides(circle2)).toEqual(true);
      });

      it(`should return false for ${JSON.stringify(circle2)}`, () => {
        expect(circle2.collides(circle1)).toEqual(true);
      });
    });
  });

  describe('doesRectAndRectCollide', () => {
    const rectangle1 = new Rect(9, 9, 1, 1);

    describe('two colliding rectangles', () => {
      const rectangle2 = new Rect(10, 10, 2, 2);
      it('should return true', () => {
        expect(rectangle1.collides(rectangle2)).toEqual(true);
      });

      it('should return true', () => {
        expect(rectangle2.collides(rectangle1)).toEqual(true);
      });
    });

    describe('two non-colliding rectangles', () => {
      const rectangle2 = new Rect(4, 4, 2, 2);
      it('should return false', () => {
        expect(rectangle1.collides(rectangle2)).toEqual(false);
      });

      it('should return false', () => {
        expect(rectangle2.collides(rectangle1)).toEqual(false);
      });
    });

    describe('rectangle inside a rectangle', () => {
      const rectangle2 = new Rect(10, 10, 4, 4);
      it('should return true', () => {
        expect(rectangle1.collides(rectangle2)).toEqual(true);
      });

      it('should return true', () => {
        expect(rectangle2.collides(rectangle1)).toEqual(true);
      });
    });
  });

  describe('doesLineAndRectCollide', () => {
    const line1 = new Line(1, 1, 10, 1);
    describe('A colliding line and rectangle', () => {
      const rectangle1 = new Rect(4, 4, 6, 6)
      it('should return true', () => {
        expect(line1.collides(rectangle1)).toEqual(true);
      })

      it('should return true', () => {
        expect(rectangle1.collides(line1)).toEqual(true);
      })
    });

    describe('A non-colliding line and rectangle', () => {
      const rectangle1 = new Rect(4, 4, 6, 4)
      it('should return false', () => {
        expect(line1.collides(rectangle1)).toEqual(false);
      })

      it('should return false', () => {
        expect(rectangle1.collides(line1)).toEqual(false);
      })
    });

    describe('A line inside rectangle', () => {
      const rectangle1 = new Rect(12, 2, 4, 2)
      it('should return false', () => {
        expect(line1.collides(rectangle1)).toEqual(true);
      })

      it('should return false', () => {
        expect(rectangle1.collides(line1)).toEqual(true);
      })
    });

    describe('A line on the corner edge of rectangle', () => {
      const rectangle1 = new Rect(5, 1, 12, 4)
      it('should return false', () => {
        expect(line1.collides(rectangle1)).toEqual(true);
      })

      it('should return false', () => {
        expect(rectangle1.collides(line1)).toEqual(true);
      })
    });
  })

  describe('doesLineAndCircleCollide', () => {
    const line1 = new Line(1, 1, 10, 1);
    describe('A colliding line and circle', () => {
      const circle1 = new Circle(4, 4, 4)
      it('should return true', () => {
        expect(line1.collides(circle1)).toEqual(true);
      })

      it('should return true', () => {
        expect(circle1.collides(line1)).toEqual(true);
      })
    });

    describe('A colliding line on the edge of a circle', () => {
      const circle1 = new Circle(4, 4, 3)
      it('should return true', () => {
        expect(line1.collides(circle1)).toEqual(true);
      })

      it('should return true', () => {
        expect(circle1.collides(line1)).toEqual(true);
      })
    });

    describe('A line inside of a circle', () => {
      const circle1 = new Circle(4, 1, 6)
      it('should return true', () => {
        expect(line1.collides(circle1)).toEqual(true);
      })

      it('should return true', () => {
        expect(circle1.collides(line1)).toEqual(true);
      })
    });

    describe('A non colliding line and circle', () => {
      const circle2 = new Circle(4, 4, 2);
      it('should return false', () => {
        expect(line1.collides(circle2)).toEqual(false);
      })

      it('should return false', () => {
        expect(circle2.collides(line1)).toEqual(false);
      })
    })
  })

  describe('doesLineAndLineCollide', () => {
    const line1 = new Line(0, 5, 10, 5);
    describe('A colliding line and line', () => {
      const line2 = new Line(5, 0, 5, 10);
      it('should return true', () => {
        expect(line1.collides(line2)).toEqual(true)
      })

      it('should return true', () => {
        expect(line2.collides(line1)).toEqual(true)
      })
    });

    describe('Overlapping line and line', () => {
      const line2 = new Line(0, 5, 10, 5);
      it('should return true', () => {
        expect(line1.collides(line2)).toEqual(true)
      })

      it('should return true', () => {
        expect(line2.collides(line1)).toEqual(true)
      })
    });

    describe('A non-colliding line and line', () => {
      const line2 = new Line(0, 6, 10, 6);
      it('should return true', () => {
        expect(line1.collides(line2)).toEqual(false)
      })

      it('should return true', () => {
        expect(line2.collides(line1)).toEqual(false)
      })
    })

    describe('line edge to line edge', () => {
      const line2 = new Line(10, 5, 10, 6);
      it('should return true', () => {
        expect(line1.collides(line2)).toEqual(true)
      })

      it('should return true', () => {
        expect(line2.collides(line1)).toEqual(true)
      })
    })
  })
});
