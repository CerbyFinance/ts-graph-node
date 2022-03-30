#!/bin/bash

# deploy
# create
# remove

graph $1 --node http://nodes2.valar-solutions.com:8020/ --ipfs http://nodes2.valar-solutions.com:5001/ deft/staking-$2 ./subgraph.$2.yaml
