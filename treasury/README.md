# Parser  olympus subgraph 
This repository contains functions for sending requests to Treasury subgraphs (<a href="https://github.com/ilau020203/olympus-subgraph-tokens" target="_blank">Treasury token balances </a> and <a href="https://github.com/ilau020203/graph" target="_blank"> Treasury smart contract functions parameters</a>)  and parsing data from these requests.You can make requests with a frequency of a minute, hour, 4 hours and day for a certain period of time.
You can make requests with a frequency of a minute, hour, 4 hours and day for a certain period of time.

## Usage

1. Run the `npm i` command to install dependencies.
2. In config file edit DEPLOYMENT ID if use new version of grah or deploy to new project.
3. Run the `node index.js` command to start exapmle.

## Example use function
    import {getTotalReserveByMinut} from './total reserve/totalReserveGetInformationForMinutes.js'
    let startTimestamp = 1633392000 //timestamp in seconds
    let endTimestamp = 1633996800 //timestamp in seconds
    data = await getBalanceForDay(startTimestamp,endTimestamp)
