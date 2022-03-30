git pull

npm run codegen
npm run build
for NAME in Fantom Avalanche Binance Ethereum Polygon testGanache
do
    echo 'y' | graph deploy CerbySwap/$NAME --node http://sergey2.cerby.fi:8020 ./subgraph.$NAME.yaml
    # echo "graph deploy CerbySwap/$NAME --node http://sergey2.cerby.fi:8020 ./subgraph.$NAME.yaml &"
done