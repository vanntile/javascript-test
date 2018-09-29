n use 10.4.1 haggle.js

ID hash 5b6010ccadb0280402fd7735

while true; do node haggle.js --id vanntile@pm.me:dhsudh s2.js wss://hola.org/challenges/haggling/arena/standard; done
node haggle.js --id vanntile@pm.me:dhsudh s2.js wss://hola.org/challenges/haggling/arena/standard
node haggle.js -T 5 -M 10 -R 8 -V 20 example.js solution.js

c=0 ;while [ $c -lt 500 ]; do node haggle.js -T 5 -M 10 -R 8 -V 20 solution2.js s2.js | grep "Bob got" >> test1.txt; let c=c+1; done


stats against solution2 on 500x and custom arena
s1 limit=0.6 2545P 5.09R
example 8214P 16.42R
s2 limit=0.5 6984P 13.9R
s2 limit=0.6 7239P 14.47R
s2 limit=0.75 7357P 14.71R

stats against example on 500x and custom arena
example 2680P 5.36R
example 2756P 5.51R
s2 limit=0.5 3446P 6.89R
s2 limit=0.6 3154P 6.3R
s2 limit=0.7 2695P 5.39R

stats agains example on 500x and basic arena
example 1652P 3.3R
s2 limit=0.5 1921P 3.84R
s2 limit=0.6 1995P 3.99R
s2 limit=0.7 1800P 3.6R

stats (example, s2) pairs on seeds from 1 to 50 two times
l=0.5 668P 3.34R
l=0.6 664P 3.32R
l=0.7 615P 3.07R

(example, s3) pairs 2x 1-50 l=0.6 795P 3.97R

