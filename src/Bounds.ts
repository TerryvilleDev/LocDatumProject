//CS-552 Homework # 1

/**
 * Class that stores an interval with inclusive endpoints.
 * @author Terence Lee
 * @date 9/7/2022
 * 
 * @export
 * @class Bounds
 * @typedef {Bounds}
 */
export class Bounds {
    //Class fields
    readonly hi: number //The high end point of the interval.
    readonly lo: number //The low end point of the interval.

    /**
     * Creates an instance of Bounds.
     *
     * @constructor
     * @param {?number} [lowEnd]    The lower endpoint of the interval.
     * @param {?number} [highEnd]   The higher endpoint of the interval.
     */
    constructor(lowEnd?: number, highEnd?: number) {
        this.hi = highEnd ?? Infinity
        this.lo = lowEnd ?? -Infinity
    }

    /**
     * Calculates if the current bounds represent an empty interval.
     *
     * @returns {boolean} The answer to "Is the low endpoint value greater the high endpoint value?"
     */
    isEmpty(): boolean {
        return this.lo > this.hi
    }

    /**
     * Checks to see if a number is in the interval specified by the class fields.
     *
     * @param {number} aNumber  The number to check for in the interval.
     * @returns {boolean}       The answer to "If the number given as an argument is in the interval?"
     */
    contains(aNumber: number): boolean {
        return aNumber >= this.lo && aNumber <= this.hi
    }

    /**
     * Creates a new Bounds object that is the intersection of the calling object and the argument.
     *
     * @param {Bounds} that Another Bounds object.
     * @returns {Bounds}    The interval that results from the intersection of two intervals.
     */
    and(that: Bounds): Bounds {
        return new Bounds(Math.max(this.lo, that.lo), Math.min(this.hi, that.hi))
    }
}