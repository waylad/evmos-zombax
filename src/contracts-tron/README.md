# Zombax Contracts

Created with a fork of https://github.com/TRON-Developer-Hub/decentralized-library

Install dependancies:

```
yarn install
```

Modify `isContract` with `isContractTron` in

```
@openzeppelin/contracts/utils/Address.col
@openzeppelin/contracts/tokens/ERC721/ERC721.col
```

This is necessary to compile the contracts as isContract already exists in Tron.

Compile contract:

```
tronbox compile
```

Deploy contract:

```
tronbox migrate --reset --network nile
```
