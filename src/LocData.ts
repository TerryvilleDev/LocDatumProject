//CS-552, Homework # 1 
import {Bounds} from "./Bounds"
import { LocDatum, distance } from "./LocDatum"

/**
 * Class that holds a collection of LocDatum objects and methods to handle the collection.
 * @author Terence Lee
 * @date 9/7/2022
 * 
 * @export
 * @class LocData
 * @typedef {LocData}
 */
export class LocData {
    //Class fields
    locDatumBin: LocDatum[] //Container for LocDatum

    //The bounds of x and y for this object
    private xBounds: Bounds 
    private yBounds: Bounds

    
    /**
     * Creates an instance of LocData class.
     *
     * @constructor
     */
    constructor() {
        this.locDatumBin = []
        this.xBounds = new Bounds()
        this.yBounds = new Bounds()
    }

    /**
     * Determines the number of LocDatum objects that x and y coordinates are within the calling object's bounds.
     *
     * @returns {number}    The number of objects in locDatumBin that are in the calling object's bounds.
     */
    size(): number {
        if(this.xBounds.isEmpty() || this.yBounds.isEmpty()) return 0

        const NO_BOUNDS = new Bounds()
        const theBin = this.locDatumBin

        if(this.xBounds === NO_BOUNDS && this.yBounds === NO_BOUNDS) return theBin.length

        let startIndex = theBin.findIndex((datum) => datum.x >= this.xBounds.lo && datum.y >= this.yBounds.lo)
        let sizeCount = 0

        if(startIndex !== -1) {
            let endOfSliceReached = false
            for(; startIndex < theBin.length && !endOfSliceReached; startIndex++) {
                const containedInXBounds = this.xBounds.contains(theBin[startIndex].x)
                const yCoordinate = theBin[startIndex].y

                if(containedInXBounds && this.yBounds.contains(yCoordinate))
                    sizeCount++
                else if(!containedInXBounds || (theBin[startIndex].x === this.xBounds.hi && yCoordinate > this.yBounds.hi))
                    endOfSliceReached = true
            }
        }

        return sizeCount
    }

    /**
     * Determines if a LocDatum object is within the bounds of the calling object and adds it to the
     * underlying container if true.
     * 
     * @param {LocDatum} newDatum LocDatum object to potentially add.
     */
    add(newDatum: LocDatum) {
        if(!this.xBounds.contains(newDatum.x) || !this.yBounds.contains(newDatum.y)) 
            throw new Error("Argument passed has at least one out-of-bounds coordinate!")
        
        const theBin = this.locDatumBin
        let index = 0
        for(; index < theBin.length && (newDatum.x > theBin[index].x || (newDatum.x === theBin[index].x && newDatum.y > theBin[index].y)); 
            index++);

        theBin.splice(index, 0, newDatum)       
    }

    /**
     * Removes the LocDatum object passed as a parameter if within the calling object's bounds or the
     * an arbitrary LocDatum object is parameter is undefined.
     *
     * @param {?LocDatum} [thatDatum]   The LocDatum object to possibly remove.
     * @returns {(LocDatum | null)}     The object that was removed from the LocData object.
     */
    remove(thatDatum?: LocDatum): LocDatum | null {
        const theBin = this.locDatumBin
        const rangeX = this.xBounds
        const rangeY = this.yBounds
        const isLocDatumObj = thatDatum != undefined

        if(this.size() === 0 || (isLocDatumObj && (!rangeX.contains(thatDatum.x) || !rangeY.contains(thatDatum.y)))) return null

        const indexOfDatum = isLocDatumObj ? theBin.findIndex((datum) => datum.x === thatDatum.x && datum.y === thatDatum.y)
                                           : theBin.findIndex((datum) => rangeX.contains(datum.x) && rangeY.contains(datum.y)) 

        if(indexOfDatum === -1) return null

        const removedDatum = theBin[indexOfDatum]
        theBin.splice(indexOfDatum, 1)
        return removedDatum
    }

    /**
     * Produces a slice of the calling object based on the bounds passed as parameters.
     * The resulting slice can only modify a fraction of the container from the calling object.
     *
     * @param {?Bounds} [boundsForX] The potential new bounds for the x-coordinate.
     * @param {?Bounds} [boundsForY] The potential new bounds for the y-coordinate.
     * @returns {LocData}   LocData object that has permission to access select LocDatum objects based on its calculated bounds.
     */
    slice(boundsForX?: Bounds, boundsForY?: Bounds): LocData {
        const newLocDataObj = new LocData()
        newLocDataObj.locDatumBin = this.locDatumBin
        newLocDataObj.xBounds = boundsForX === undefined ? this.xBounds : this.xBounds.and(boundsForX)
        newLocDataObj.yBounds = boundsForY === undefined ? this.yBounds : this.yBounds.and(boundsForY)
        return newLocDataObj
    }

    /**
     * Finds the closest LocDatum object in Euclidean distance to the passed parameter.
     *
     * @param {LocDatum} thisDatum  The LocDatum to measure distance from all other LocDatum objects.
     * @returns {(LocDatum | undefined)} The closest LocDatum object to the parameter passed if it exists, otherwise undefined.
     */
    closest(thisDatum: LocDatum): LocDatum | undefined {
        if(this.size() === 0) return undefined

        const theBin = this.locDatumBin
        let closestDatum: LocDatum | undefined = undefined
        let minDistance = Infinity

        for(let index = theBin.findIndex((datum) => datum.x >= this.xBounds.lo  && datum.y >= this.yBounds.lo); 
            index !== -1 && index < theBin.length && (thisDatum.x < this.xBounds.hi || (thisDatum.x === this.xBounds.hi && thisDatum.y <= this.yBounds.hi)); 
            index++) 
        {
            if(this.yBounds.contains(theBin[index].y)) {
                const theDistance = distance(theBin[index], thisDatum)
                if(theDistance < minDistance) {
                    minDistance = theDistance
                    closestDatum = theBin[index]
                }
            }
        }

        return closestDatum
    }
}