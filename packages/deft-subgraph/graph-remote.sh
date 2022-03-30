#!/bin/bash

# deploy
# create
# remove

graph $1 --node http://server.wisetoken.me:8020/ --ipfs http://server.wisetoken.me:5001/ deft/deft-$2 ./subgraph.$2.yaml