#!/bin/bash
for i in {1..50}
do
    node haggle.js -s $i example.js solution.js | grep "Bob got" >> test1.txt
    node haggle.js -s $i example.js solution.js | grep "Bob got" >> test1.txt
    node haggle.js -s $i solution.js example.js | grep "Alice got" >> test1.txt
    node haggle.js -s $i solution.js example.js | grep "Alice got" >> test1.txt
done