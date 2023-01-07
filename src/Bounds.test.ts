import { Bounds } from "./Bounds";

describe('Bounds attributes', () => {
    test('empty bounds', () => {
        const b = new Bounds();
        expect(b.lo).toBe(Number.NEGATIVE_INFINITY);
        expect(b.hi).toBe(Number.POSITIVE_INFINITY);
    })
    test('no upper bound', () => {
        const b = new Bounds(6);
        expect(b.lo).toBe(6);
        expect(b.hi).toBe(Number.POSITIVE_INFINITY);
    });
    test("no lower bound", () => {
        const b = new Bounds(undefined, 6);
        expect(b.lo).toBe(Number.NEGATIVE_INFINITY);
        expect(b.hi).toBe(6);
    });
    test('both bounds', () => {
        const b = new Bounds(-5, 6);
        expect(b.lo).toBe(-5);
        expect(b.hi).toBe(6);
    });
});

describe('Bounds tests', () => {
    test('simple not empty', () => {
        expect(new Bounds(0, 7).isEmpty()).toBe(false);
    })
    test('simple lo', () => {
        expect(new Bounds(1, 10).contains(1)).toBe(true);
    })
    test('simple hi', () => {
        expect(new Bounds(2, 20).contains(20)).toBe(true);
    });
    test('simple mid', () => {
        expect(new Bounds(3, 6).contains(4.2)).toBe(true);
    });
    test('simple too big', () => {
        expect(new Bounds(4, 7.5).contains(7.6)).toBe(false);
    });
    test('simple too small', () => {
        expect(new Bounds(5.5, 9).contains(5.4)).toBe(false);
    });
    test('single not empty', () => {
        expect(new Bounds(4.2, 4.2).isEmpty()).toBe(false);
    });
    test('single in', () => {
        expect(new Bounds(3.14, 3.14).contains(3.14)).toBe(true);
    });
    test('single out', () => {
        expect(new Bounds(3.14, 3.14).contains(Math.PI)).toBe(false);
    });
    test('empty', () => {
        expect(new Bounds(Math.PI, 3.14159).isEmpty()).toBe(true);
    });
    test('empty does not contain', () => {
        expect(new Bounds(3.3, 3.1).contains(3.2)).toBe(false);
    });
    test('empty lo', () => {
        expect(new Bounds(3, 1).contains(3)).toBe(false);
    });
    test('empty hi', () => {
        expect(new Bounds(4, 2).contains(2)).toBe(false);
    });
    test('no hi', () => {
        expect(new Bounds(1).contains(Math.PI)).toBe(true);
        expect(new Bounds(1).contains(0.5)).toBe(false);
    });
    test('no lo', () => {
        expect(new Bounds(undefined, 10).contains(8)).toBe(true);
        expect(new Bounds(undefined, 10).contains(42)).toBe(false);
    });
    test('no bounds', () => {
        expect(new Bounds().contains(-17)).toBe(true);
        expect(new Bounds().contains(999)).toBe(true);
        expect(new Bounds().contains(Number.MAX_VALUE)).toBe(true);
    });
});

describe('Bounds and tests', () => {
    test('and overlap mid', () => {
        expect(new Bounds(1, 3).and(new Bounds(2, 4)).contains(2.5)).toBe(true);
    });
    test('and overlap lo', () => {
        expect(new Bounds(2, 5).and(new Bounds(1, 4)).contains(2)).toBe(true);
    });
    test('and overlap hi', () => {
        expect(new Bounds(3, 6).and(new Bounds(4, 8)).contains(6)).toBe(true);
    });
    test('and overlap too small', () => {
        expect(new Bounds(4, 8).and(new Bounds(3, 6)).contains(3.5)).toBe(false);
    });
    test('and overlap too big', () => {
        expect(new Bounds(5, 10).and(new Bounds(6, 12)).contains(11)).toBe(false);
    });
    test('and touch in', () => {
        expect(new Bounds(1, 3).and(new Bounds(3, 5)).contains(3)).toBe(true);
    });
    test('and touch out', () => {
        expect(new Bounds(2, 4).and(new Bounds(4, 8)).contains(6)).toBe(false);
    });
    test('and miss forward', () => {
        expect(new Bounds(3, 6).and(new Bounds(7, 9)).isEmpty()).toBe(true);
    });
    test('and miss backward', () => {
        expect(new Bounds(4, 8).and(new Bounds(1, 3)).contains(3.5)).toBe(false);
    });
    test('self and', () => {
        const b = new Bounds(2, 4);
        const a = b.and(b);
        expect(a.contains(1)).toBe(false);
        expect(a.contains(2)).toBe(true);
        expect(a.contains(3)).toBe(true);
        expect(a.contains(4)).toBe(true);
        expect(a.contains(5)).toBe(false);
    });
    test('and half-bounded', () => {
        const a = new Bounds(3).and(new Bounds(undefined, 5));
        expect(a.isEmpty()).toBe(false);
        expect(a.contains(2)).toBe(false);
        expect(a.contains(Math.PI)).toBe(true);
        expect(a.contains(4)).toBe(true);
        expect(a.contains(5)).toBe(true);
        expect(a.contains(5.1)).toBe(false);
    });
    test('and half-bounded empty', () => {
        const a = new Bounds(4).and(new Bounds(undefined, 3));
        expect(a.isEmpty()).toBe(true);
        expect(a.contains(3)).toBe(false);
        expect(a.contains(4)).toBe(false);
        expect(a.contains(Math.PI)).toBe(false);
    })
    test('and unbounded', () => {
        const a = new Bounds(4, 6).and(new Bounds());
        expect(a.contains(Math.PI)).toBe(false);
        expect(a.contains(4)).toBe(true);
        expect(a.contains(5)).toBe(true);
        expect(a.contains(6)).toBe(true);
        expect(a.contains(20 / 3)).toBe(false);
    });
    test('unbounded and', () => {
        const a = new Bounds().and(new Bounds(4, 6));
        expect(a.contains(Math.PI)).toBe(false);
        expect(a.contains(4)).toBe(true);
        expect(a.contains(5)).toBe(true);
        expect(a.contains(6)).toBe(true);
        expect(a.contains(20 / 3)).toBe(false);
    })
});
