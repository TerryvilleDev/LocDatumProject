/**
    Implementation of the LocDatum interface and distance function.
    @author Terence Lee
    @date 9/7/2022
*/

/**
 * Interface for objects to store location coordinates within itself. 
 *
 * @export
 * @interface LocDatum
 * @typedef {LocDatum} 
 */
export interface LocDatum {
    x: number //Value of the x-coordinate
    y: number //Value of the y-coordinate
}

/**
 * Calculates the Euclidean distance between two LocDatum objects.
 *
 * @export
 * @param {LocDatum} ld1    A LocDatum object
 * @param {LocDatum} ld2    Another LocDatum object
 * @returns {number}        The Euclidean distance between two LocDatum objects.
 */
export function distance(ld1: LocDatum, ld2: LocDatum): number {
    return Math.sqrt(Math.pow(ld1.x - ld2.x, 2) + Math.pow(ld1.y - ld2.y, 2))
}