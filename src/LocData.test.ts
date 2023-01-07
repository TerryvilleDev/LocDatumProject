import { Bounds } from './Bounds';
import { LocData } from './LocData';


describe('LocData tests', () => {
    const origin = { x: 0, y: 0 };
    const r34 = { name: 'Super Burger', cost: 1, x: 3, y: 4 };
    const l02 = { description: 'sign', x: 0, y: 2 };
    const p30 = { x: 3, y: 0 };
    const l00 = { description: 'pole', y: 0, x: 0 };

    let data: LocData = new LocData(); // pre-initialize to make TypeScript happy
    beforeEach(() => {
        data = new LocData();
    })

    describe('add tests', () => {
        test('empty has size = 0', () => {
            expect(data.size()).toBe(0);
        });
        test('add to empty with size 1', () => {
            data.add(r34);
            expect(data.size()).toBe(1);
        });
        test('add twice allowed', () => {
            data.add(r34);
            expect(() => { data.add(r34) }).not.toThrow();
            expect(data.size()).toBe(2);
        });
        test('add thrice', () => {
            data.add(p30);
            data.add(origin);
            data.add(l02);
            expect(data.size()).toBe(3);
        })
    });

    describe('remove tests', () => {
        test('remove empty #1', () => {
            expect(data.remove(origin)).toBeNull();
        });
        test('remove empty #2', () => {
            expect(data.remove()).toBeNull();
        });
        describe('one element', () => {
            beforeEach(() => {
                data.add(r34);
            });
            test('matches', () => {
                expect(data.remove({ x: 3, y: 4 })).toBe(r34);
                expect(data.size()).toBe(0);
            });
            test('no match', () => {
                expect(data.remove({ x: 3, y: -4 })).toBeNull();
                expect(data.size()).toBe(1);
            })
            test('any', () => {
                expect(data.remove()).toBe(r34);
                expect(data.size()).toBe(0);
            });
        });
        describe('two elements', () => {
            beforeEach(() => {
                data.add(origin);
                data.add(p30);
            });
            test('matches #1', () => {
                expect(data.remove(l00)).toBe(origin);
                expect(data.size()).toBe(1);
            });
            test('matches #2', () => {
                expect(data.remove({ x: 3, y: 0 })).toBe(p30);
                expect(data.size()).toBe(1);
            })
            test('none', () => {
                expect(data.remove({ x: 2, y: 0 })).toBeNull();
                expect(data.size()).toBe(2);
            })
            test('any', () => {
                const res = data.remove();
                expect([origin, p30]).toContain(res);
                expect(data.size()).toBe(1);
                if (res != null) {
                    expect(data.remove(res)).toBeNull();
                }
            })
        });
    });

    describe('slice tests', () => {
        const unbounded = new Bounds();
        const lo1 = new Bounds(1);
        const hi10 = new Bounds(undefined, 10);
        const one2ten = new Bounds(1, 10);
        const lo5 = new Bounds(5);
        const hi5 = new Bounds(undefined, 5);
        const only5 = new Bounds(5, 5);
        const universal = { x: Math.PI, y: 5 };
        const l20 = { x: 20, y: 5, description: "far" };
        let range: LocData = new LocData();
        describe.each([
            { xb: unbounded },
            { xb: lo1 },
            { xb: hi10 },
            { xb: one2ten }
        ])('slice($xb,_)', ({ xb }) => {
            describe.each([
                { yb: unbounded },
                { yb: lo5 },
                { yb: hi5 },
                { yb: only5 },
                { yb: one2ten }
            ])('slice(_,$yb)', ({ yb }) => {
                beforeEach(() => {
                    range = data.slice(xb, yb);
                });
                test('still empty', () => {
                    expect(range.size()).toBe(0);
                });
                test('add to slice', () => {
                    range.add(universal);
                    expect(range.size()).toBe(1);
                    expect(data.size()).toBe(1);
                });
                if ((yb.lo ?? 0) > 4) {
                    test('add not visible', () => {
                        data.add(r34);
                        expect(range.size()).toBe(0);
                    });
                    test('add out of range', () => {
                        expect(() => { range.add(r34) }).toThrowError();
                    });
                } else {
                    test('add visible', () => {
                        data.add(r34);
                        expect(range.size()).toBe(1);
                    });
                    test('add in range', () => {
                        range.add(r34);
                        expect(data.size()).toBe(1);
                    });
                }
                if ((xb.hi ?? 100) < 20) {
                    test('add not visible #2', () => {
                        data.add(l20);
                        expect(range.size()).toBe(0);
                    });
                    test('add out of range #2', () => {
                        expect(() => { range.add(l20) }).toThrowError();
                    });
                } else {
                    test('add visible #2', () => {
                        data.add(l20);
                        expect(range.size()).toBe(1);
                    })
                }

                describe('one element slice', () => {
                    beforeEach(() => {
                        data.add(r34);
                        range = data.slice(xb, yb);
                    });
                    const visible = (yb.lo ?? 0) <= 4;
                    test('size of one.slice', () => {
                        expect(range.size()).toBe(visible ? 1 : 0);
                    });
                    test('add to one slice', () => {
                        range.add(universal);
                        expect(range.size()).toBe(visible ? 2 : 1);
                        expect(data.size()).toBe(2);
                    });
                    if (visible) {
                        test('remove visible', () => {
                            expect(range.remove({ x: 3, y: 4 })).toBe(r34);
                            expect(data.size()).toBe(0);
                        });
                        test('remove only', () => {
                            expect(range.remove()).toBe(r34);
                            expect(data.size()).toBe(0);
                        });
                        test('remove from original', () => {
                            expect(data.remove({ x: 3, y: 4 })).toBe(r34);
                            expect(range.size()).toBe(0);
                        })
                    } else {
                        test('remove invisible', () => {
                            expect(range.remove({ x: 3, y: 4 })).toBeNull();
                            expect(data.size()).toBe(1);
                        });
                        test('remove none visible', () => {
                            expect(range.remove()).toBeNull();
                            expect(data.size()).toBe(1);
                        })
                    }
                });

                describe('two element slice', () => {
                    beforeEach(() => {
                        data.add(l20);
                        data.add(universal);
                        range = data.slice(xb, yb);
                    });
                    const visible = (xb.hi ?? 100) >= 20;
                    test('size of two.slice', () => {
                        expect(range.size()).toBe(visible ? 2 : 1);
                    });
                    test('remove always visible', () => {
                        expect(range.remove({ x: Math.PI, y: 5 })).toBe(universal);
                        expect(data.size()).toBe(1);
                    });
                    test('remove not there', () => {
                        expect(range.remove(origin)).toBeNull();
                        expect(data.size()).toBe(2);
                    })
                    if (visible) {
                        test("remove visible", () => {
                            expect(range.remove({ x: 20, y: 5 })).toBe(l20);
                            expect(data.size()).toBe(1);
                        });
                        test('remove ambiguous', () => {
                            expect([universal, l20]).toContain(range.remove());
                            expect(data.size()).toBe(1);
                        })
                    } else {
                        test('remove invisible', () => {
                            expect(range.remove(l20)).toBeNull();
                            expect(data.size()).toBe(2);
                        });
                        test('add invisible', () => {
                            expect(() => { range.add(l20) }).toThrowError();
                        });
                        test('remove unambiguous', () => {
                            expect(range.remove()).toBe(universal);
                            expect(data.size()).toBe(1);
                            expect(data.remove()).toBe(l20);
                        });
                    }
                });
            });
        });

        describe('missing arguments', () => {
            beforeEach(() => {
                data.add(r34);
                data.add(universal); // Pi, 5
                data.add(origin);
                data.add(l20); // 20, 5
                data.add(p30);
                data.add(l02);
                range = data.slice(one2ten, one2ten);
            });
            test('no bounds', () => {
                const rr = range.slice();
                expect(rr.size()).toBe(2);
            });
            test('missing second bounds', () => {
                const rr = range.slice(new Bounds(1,3));
                expect(rr.size()).toBe(1);
            });
            test('missing first bound', () => {
                const rr = range.slice(undefined, new Bounds(3,4));
                expect(rr.size()).toBe(1);
            });
        });
        
        describe('multi-slice tests', () => {
            beforeEach(() => {
                data.add(r34);
                data.add(universal); // Pi, 5
                data.add(origin);
                data.add(l20); // 20, 5
                data.add(p30);
                data.add(l02);
                range = data.slice(one2ten, hi5).slice(unbounded, lo5);
            });
            test('verify add', () => {
                expect(data.size()).toBe(6);
            });
            test('check intersection size', () => {
                expect(range.size()).toBe(1);
            });
            test('check removal of only', () => {
                expect(range.remove()).toBe(universal);
                expect(data.size()).toBe(5);
            });
            test('check removal of invisible', () => {
                expect(range.remove(l20)).toBeNull();
                expect(data.size()).toBe(6);
            });
            test('check illegal add', () => {
                expect(() => { range.add(l20) }).toThrowError();
            });
            test('check legal add', () => {
                expect(range.add({ x: 7, y: 5 })).toBeUndefined();
            });
        })
    });

    describe('closest tests', () => {
        test('empty closest', () => {
            expect(data.closest(origin)).toBeUndefined();
            expect(data.closest(r34)).toBeUndefined();
        });
        test('single closest', () => {
            data.add(p30);
            expect(data.closest(origin)).toBe(p30);
            expect(data.size()).toBe(1);
        });
        test('single immediate', () => {
            data.add(r34);
            expect(data.closest({ x: 3, y: 4 })).toBe(r34);
            expect(data.size()).toBe(1);
        });
        test('invisible not closest', () => {
            data.add({ x: 20, y: 8 });
            const range = data.slice(new Bounds(1, 10), new Bounds());
            expect(range.closest(origin)).toBeUndefined();
        });
        describe('closest of two tests', () => {
            beforeEach(() => {
                data.add(origin);
                data.add(r34);
            });
            test('test measure 1 #1', () => {
                expect(data.closest({ x: 0, y: 3.25 })).toBe(r34);
            });
            test('test measure 1 #2', () => {
                expect(data.closest({ x: 3, y: 0.75 })).toBe(origin);
            });
            test('test measure 0 #1', () => {
                expect(data.closest({ x: 1, y: 2.25 })).toBe(origin);
            });
            test('test measure 0 #2', () => {
                expect(data.closest({ x: 2, y: 1.75 })).toBe(r34);
            });
        });
        describe('closest of many', () => {
            const p2_2 = { x: 2, y: -2 };
            beforeEach(() => {
                data.add(r34);
                data.add(p30);
                data.add(l02);
                data.add(l00);
                data.add(p2_2);
            });
            describe.each([
                { x: 0, y: 6, d: r34 },
                { x: 0, y: 5, d: l02 },
                { x: -1, y: 1.1, d: l02 },
                { x: 1, y: 0.9, d: l00 },
                { x: -1, y: -2, d: l00 },
                { x: 0, y: -3, d: p2_2 },
                { x: 1.6, y: 0, d: p30 },
                { x: 1.4, y: 0, d: l00 },
                { x: 2, y: 2, d: l02 },
                { x: 4, y: -2, d: p2_2 },
                { x: 4, y: 2.5, d: r34 },
            ])('closest($x,$y)', ({ x, y, d }) => {
                test('check', () => {
                    expect(data.closest({ x: x, y: y })).toBe(d);
                });
            });
            test('tie', () => {
                expect([r34, p30]).toContain(data.closest({ x: 2.5, y: 2 }));
            });
            describe('sliced', () => {
                let range = new LocData();
                beforeEach(() => {
                    range = data.slice(new Bounds(), new Bounds(-1, 2));
                });
                test('check expected size', () => {
                    expect(range.size()).toBe(3);
                });
                test('closest invisible', () => {
                    expect(range.closest({ x: 2, y: -1 })).toBe(p30);
                });
                test('target out of range', () => {
                    expect(range.closest({ x: -2, y: -2 })).toBe(l00);
                });
                test('closest invisible and target out of range', () => {
                    expect(range.closest({ x: 3, y: 3 })).toBe(p30);
                });
            })
        })
    });
});
