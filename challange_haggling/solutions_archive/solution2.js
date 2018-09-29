'use strict'; /*jslint node:true*/

module.exports = class Agent {
    constructor(me, counts, values, max_rounds, log){
        this.counts = counts;
        this.values = values;
        this.roundsLeft = max_rounds;
        this.round = 0;
        this.log = log;

        // this.total is the total value of the items
        this.total = 0;
        // this.valuesSummed is an array of the total values of each category
        this.valuesSummed = [];
        for (let i = 0; i < counts.length; i++) {
            let j = counts[i] * values[i];
            this.valuesSummed.push(j);
            this.total += j;
        }
        // this.valuesSummedOrdered is an ordered array of what I need
        this.valuesSummedOrdered = [];


        // how much do I want?
        this.limit = 0.6;
        // this.offers is an array of the offers received
        this.offers = [];
        this.offers.push(this.counts.slice());
        // my last offer
        this.lastoffer = [];
        // an useful array of zeroes
        this.zero = new Array(this.counts.length).fill(0);

        this.grad = this.zero.slice();
        this.weights = [];

        /*
         * Defining local functions
         */
        this.compareArrays = function(array1, array2) {
            for (let i = 0; i < array1.length; ++i) {
                if (array1[i] != array2[i])
                    return 0;
            }
            return 1;
        };
        // TODO
        this.sortWithIndeces = function(toSort) {
            for (let i = 0; i < toSort.length; i++) {
                toSort[i] = [toSort[i], i];
            }
            toSort.sort(function(left, right) {
                return left[0] < right[0] ? -1 : 1;
            });
            toSort.sortIndices = [];
            for (let j = 0; j < toSort.length; j++) {
                toSort.sortIndices.push(toSort[j][1]);
                toSort[j] = toSort[j][0];
            }
            return toSort;
        };
    }
    offer(o){
        //this.log(`${this.roundsLeft} rounds left`);
        this.roundsLeft--;
        this.round++;

        if (!o) {
            if (Math.random() > 0.5) {
                /*
                 * Offer all zero values initially
                 */
                o = this.counts.slice();
                for (let i = 0; i<o.length; i++) {
                    if (!this.values[i])
                        o[i] = 0;
                }
                this.lastoffer = o.slice();
                return o;
            } else {
                /*
                 * Offer nothing to keep the data upper hand
                 */
                this.lastoffer = this.counts.slice();
                return this.counts;
            }
        } else {
            this.offers.push(o.slice());
        }

        // logging all offers
        //this.log(`V is: ${this.values}`);
        //this.offers.forEach((offer, idx) => {
        //    this.log(`${idx} is: ${offer}`);
        //});

        /*
         * Calculating the gradient
         */
        


        /* 
         * If the offer's value is greater than this.total * this.limit
         * accept, whatever happens.
         */
        let sum = this.values.reduce((acc, curr, idx) => {
            return acc + curr * o[idx];
        }, 0);
        if (sum >= this.total * this.limit) {
            return;
        }


        /*
         * If there have been at least two identical consecutive offers, than
         * the script is probably dummy or in a dummy-state.
         * If you have more than one round left, first try to get the least of
         * what he wants. Then, try to reach equilibrium.
         */

        // TODO: debugging this whole if
        if (this.offers.length - 1 !== 0) {
            let dummy = 0,
                idx = 0;

            for (idx = this.offers.length - 1; idx > 1 ; --idx) {
                if (this.compareArrays(this.offers[idx].slice(), this.offers[idx - 1].slice())) {
                    dummy = 1;
                    break;
                }
            }

            if (dummy) {
                //this.log(`it's a dummy`);

                //this.log(`${idx}`);
                o = this.offers[idx].slice();
                this.valuesSummedOrdered = this.sortWithIndeces(this.valuesSummed.slice());
                //this.log(`offer: ${o} valuesSummed ${this.valuesSummed} vSO: ${this.valuesSummedOrdered}`);

                let valuesSummed = this.valuesSummed.slice();

                if (this.roundsLeft > 1) {
                    // get the things he wants with maximum value to you
                    idx = 0;
                    let maximum = 0;


                    valuesSummed.forEach((e, i) => {
                        if (e > maximum) {
                            maximum = e;
                            idx = i;
                        }
                    });
                    o[idx] = this.counts.slice()[idx];
                } else {
                    // reach equilibrium
                    // TODO: this is a mock
                    //this.log(`spaaaaacce`);
                    idx = 0;
                    let maxim = 0;
                    valuesSummed.forEach((e, i) => {
                        if (e > maxim) {
                            maxim = e;
                            idx = i;
                        }
                    });
                    o.push[idx] = this.counts[idx];
                }
                this.lastoffer = o.slice();
                return o;
            }
        }


        /*
         * Return the same offer
         */
        //this.log(`I'll return the same offer`);
        o.forEach((_, idx) => {
            o[idx] = this.counts[idx] - o[idx];
        });

        /*
         * 
         * 
         */
        this.lastoffers = o.slice();
        return o;
    }
};