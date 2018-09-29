'use strict'; /*jslint node:true*/

module.exports = class Agent {
    constructor(me, counts, values, max_rounds, log){
        this.counts = counts;
        this.values = values;
        this.roundsLeft = max_rounds;
        this.no = 0;
        this.log = log;



        // this.total is the total value of the items
        this.total = 0;
        // how much do I want?
        this.limit = 0.7;
        // an useful array of zeroes
        this.zero = new Array(this.counts.length).fill(0);

        // this.offers is an array of the offers received
        this.offers = [];
        this.offers.push(this.counts.slice());
        // my last offer
        this.lastoffer = this.zero.slice();
        // this.valuesSummed is an array of the total values of each category
        this.valuesSummed = [];
        for (let i = 0; i < counts.length; i++) {
            let j = counts[i] * values[i];
            this.valuesSummed.push(j);
            this.total += j;
        }
        let max = Math.max(...this.valuesSummed);
        // what I like to get, as a probability
        this.like = this.valuesSummed.map(x => x / max);
        // gradient
        this.gradient = [];
        this.gradient.push(this.zero.slice());
        // weights
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

        this.update = function() {
            var idx,
                o = Array.from(this.zero),
                lastoffer = Array.from(this.lastoffer),
                weights = Array.from(this.weights);

            
            for (idx = 0; idx < this.counts.length; ++idx) {
                //this.log(`${idx} like ${this.like[idx]} weights ${weights[idx]}`);
                if (this.like[idx] === 0) {
                    //this.log(`o1 ${o}`);
                    o[idx] = 0;
                    //this.log(`o1 ${o}`);
                } else{
                    if (this.like[idx] + weights[idx] >= 1) {
                        //this.log(`o2 ${lastoffer}`);
                        if (lastoffer[idx] !== this.counts[idx]) {
                            o[idx] = lastoffer[idx] + 1;
                        } else {
                            o[idx] = lastoffer[idx];
                        }
                        //this.log(`o2 ${o} ${lastoffer}`);
                    } else {
                        //this.log(`o3 ${lastoffer}`);
                        if (lastoffer[idx] !== 0) {
                            o[idx] = lastoffer[idx] - 1;
                        } else {
                            o[idx] = lastoffer[idx];
                        }
                        //this.log(`o3 ${o} ${lastoffer}`);
                    }
                }
            }
            //this.log(`o4 ${o}`);
            this.lastoffer = o.slice();
            //this.log(`o4 ${this.lastoffer}`);

            return this.lastoffer;
        };
    }
    offer(o){
        //this.log(`${this.roundsLeft} rounds left`);
        this.roundsLeft--;

        /*
         * We try a version based on gradients and weights to update our
         * lastoffer with to the new offer, o;
         * Each time we get a new offer we calculate the new gradient then we
         * recalculate the weigth based on how many rounds passed.
         * Afterwards, we update the lastoffer based on weights and what I like.
         */

        if (!o) {
            if (Math.random() > 0.5) {
                // Offer all zero values initially
                o = this.counts.slice();
                for (let i = 0; i < o.length; i++) {
                    if (this.values[i] === 0)
                        o[i] = 0;
                }
                this.lastoffer = o.slice();
                return o;
            } else {
                // Offer nothing to keep the data upper hand
                this.lastoffer = this.counts.slice();
                return this.counts;
            }
        } else {
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

        
            // new offer received
            this.no++;
            this.offers.push(o.slice());
            // calculate the latest gradient
            this.gradient.push([]);
            o.forEach((x, i) => {
                this.gradient[this.no][i] = this.offers[this.no - 1][i] - x;
            });
        }

        //// logging offers
        //this.log(`V is: ${this.values}`);
        //this.log(`offers`);
        //this.offers.forEach((offer, idx) => {
        //    this.log(`${idx} is: ${offer}`);
        //});
        //// log gradient
        //this.log(`gradient`);
        //this.gradient.forEach((gradient, idx) => {
        //    this.log(`${idx} is: ${gradient}`);
        //});

        // recalculating weights
        this.weights = this.zero.slice();
        for (let i = 1; i <= this.no; ++i) {
            for (let j = 0; j < this.counts.length; ++j) {
                if ((Math.sign(this.gradient[i][j]) !== -1) &&
                    (this.offers[i][j] !== this.counts[j])) { // this could be wrong
                    this.weights[j]++;
                }
            }
        }
        for(let i = 0; i < this.counts.length; ++i) {
            this.weights[i] = this.weights[i] / this.no;
        }

        return this.update();;

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
                if (this.compareArrays(this.offers[idx].slice(),
                        this.offers[idx - 1].slice())) {
                    dummy = 1;
                    break;
                }
            }

            if (dummy) {
                this.log(`it's a dummy`);

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