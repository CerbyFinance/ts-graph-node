for NAME in Fantom Avalanche Binance Ethereum Polygon testGanache
do
    graph create CerbySwap/$NAME --node http://sergey2.cerby.fi:8020 ./subgraph.$NAME.yaml
done