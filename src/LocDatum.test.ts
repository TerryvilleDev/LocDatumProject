import { distance, LocDatum } from "./LocDatum";

export interface Restaurant extends LocDatum {
    readonly name: string;
    readonly cost: number;
}

export interface Landmark extends LocDatum {
    readonly description: string
}

describe('tests of distance', () => {
    test('x difference', () => {
        expect(distance({ x: 8, y: 10 }, { x: 15, y: 10 })
        ).toBe(7);
    });
    test('x difference reversed', () => {
        expect(distance({ y: 14.1, x: 4.5 }, { x: -0.5, y: 14.1 })
        ).toBe(5);
    });
    test('y difference', () => {
        expect(distance({ x: 8, y: 10 }, { y: -12.5, x: 8 })
        ).toBe(22.5);
    });
    test('coincide', () => {
        expect(distance({ x: 22.7, y: 10.1, description: "One" } as Landmark,
            { y: 10.1, x: 22.7 })).toBe(0);
    });
    test('integer distance', () => {
        expect(distance({ x: 10, y: 10, description: "Cool" } as Landmark,
            { cost: 400, y: 6, x: 7, name: 'Ooh la la' } as Restaurant)
        ).toBe(5);
    });
    test('square root distance ', () => {
        expect(distance({ x: 0, y: 0 }, { y: 17.0, x: 7.0, cost: 120, name: 'Chez Matisse' } as Restaurant)
        ).toBeCloseTo(Math.SQRT2 * 13, 10);
    });
});
