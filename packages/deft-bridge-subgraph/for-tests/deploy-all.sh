#!/bin/bash


./graph-remote.sh create binance-test
./graph-remote.sh create kovan

./graph-remote.sh deploy binance-test
./graph-remote.sh deploy kovan