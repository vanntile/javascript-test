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
        // what I like to get, as a probability
        this.like = [];
        

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
        this.log(`V is: ${this.values}`);
        this.offers.forEach((offer, idx) => {
            this.log(`${idx} is: ${offer}`);
        });

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
         * We try a version based on gradients and weights to update our
         * lastoffer with to the new offer, o;
         * Each time we get a new offer we calculate the new gradient then we
         * recalculate the weigth based on how many rounds passed.
         * Afterwards, we update the lastoffer based on weights and what I like.
         */





        /*
         * If there have been at least two identical consecutive offers, than
         * the script is probably dummy or in a dummy-state.
         * If you have more than one round left, first try to get the least of
         * what he wants. Then, try to reach equilibrium.
         */

        // TODO: adding a deterministic solution
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
                this.log(`it's a dummy`);

                this.log(`${idx}`);
                o = this.offers[idx].slice();
                this.valuesSummedOrdered = this.sortWithIndeces(this.valuesSummed.slice());
                this.log(`offer: ${o} valuesSummed ${this.valuesSummed} vSO: ${this.valuesSummedOrdered}`);

                let valuesSummed = this.valuesSummed.slice();

                o = this.counts.slice();
                this.lastoffer = o.slice();
                return o;
            }
        }


        /*
         * Return the same offer
         */
        this.log(`I'll return the same offer`);
        o.forEach((_, idx) => {
            o[idx] = this.counts[idx] - o[idx];
        });
        this.lastoffers = o.slice();
        return o;
    }
};