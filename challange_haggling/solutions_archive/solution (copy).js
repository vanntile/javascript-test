'use strict'; /*jslint node:true*/

module.exports = class Agent {
    constructor(me, counts, values, max_rounds, log){
        this.counts = counts;
        this.values = values;
        this.roundsLeft = max_rounds;
        this.log = log;

        this.total = 0;
        this.valuesSummed = new Array();
        for (let i = 0; i < counts.length; i++) {
            let j = counts[i] * values[i];
            this.valuesSummed.push(j);
            this.total += j;
        }

        this.round = 0;
        this.limit = 0.75;
        this.offers = new Array();

        this.compareArrays = function(array1, array2) {
            for (let i = 0; i < array1.length; ++i) {
                if (array1[i] != array2[i])
                    return 0;
            }
            return 1;
        }
    }
    offer(o){
        this.log(`${this.roundsLeft} rounds left`);
        this.roundsLeft--;
        this.round++;

        // logging previous offers
        this.log(`values:${this.values}`);
        this.offers.forEach((offer, idx) => {
            this.log(`#${idx + 1} is: ${offer}`);
        });

        if (!o) {
            /*
             * Offer all nonzero values initially
             */
            this.log(`all nonzero`);
            o = this.counts.slice();
            for (let i = 0; i<o.length; i++) {
                if (!this.values[i])
                    o[i] = 0;
            }
            return o;
        } else {
            this.offers.push(o);
        }

        /* 
         * If the offer's value is greater than this.total * this.limit
         * accept, whatever happens.
         */
        let sum = this.values.reduce((acc, curr, idx) => {
            return acc + curr * o[idx];
        }, 0);
        if (sum >= this.total * this.limit)
            return;

        /*
         * If there have been at least two identical consecutive offers, than
         * the script is probably dummy or in a dummy-state.
         * If you have more than one round left, first try to get the least of
         * what he wants. Then, try to reach equilibrium.
         */


        let dummy = 0;
        if (this.offers.length - 1) {
            let idx = 0;
            for (idx = this.offers.length - 1; idx > 1 ; --idx) {
                if (this.compareArrays(this.offers[idx], this.offers[idx - 1])) {
                    dummy = 1;
                    break;
                }
            }

            if (dummy) {
                this.log(`dummified`);

                o = this.offer[idx];
                this.log(`${o}`);
                let valuesSummed = this.valuesSummed;
                valuesSummed[idx] = 0;

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
                    o[idx] = this.counts[idx];
                } else {
                    // reach equilibrium
                    // TODO: this is a mock
                    this.log(`spaaaaacce`);
                    idx = 0;
                    let maxim = 0;
                    valuesSummed.forEach((e, i) => {
                        if (e > maxim) {
                            maximum = e;
                            idx = i;
                        }
                    });
                    o.push[idx] = this.counts[idx];
                }
                return o;
            }
        }

        /*
         * Return the same offer
         */
        this.log(`spaaaaacce2`);
        o.forEach((_, idx) => {
            o[idx] = this.counts[idx] - o[idx];
        });

        /*
         * 
         * 
         */
        return o;
    }
};
