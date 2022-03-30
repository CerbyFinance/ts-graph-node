#!/bin/bash

# deploy
# create
# remove

graph $1 --node http://localhost:8020/ --ipfs http://localhost:5001/ deft/deft-bridge-$2 ./subgraph.$2.yaml