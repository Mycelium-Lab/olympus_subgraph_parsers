import axios from 'axios'

/**
 * @dev : Get pairs (N days)
 * @param startTimestamp - Start timestamp for query
 * @param endTime - End timestamp for query
 * @param token0 - Token0 symbol e.g. OHM
 * @param token1 - Token1 symbol e.g. DAI
 * @param days - Number of days
 */
export async function getPairsInfoNDays(
    startTimestamp,
    endTime,
    token0,
    token1,
    days
) {
    let findPairQuery =
        `{
    pairs(where:{name_in:["${token0}-` +
        `${token1}"]})
    {
      id
    }
  }
  `

    try {
        const findPair = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/sushi-swap-ohm',
            method: 'post',
            data: {
                query: findPairQuery,
            },
        })
        let id = findPair.data.data.pairs[0].id
        let pairName
        if (id !== undefined) {
            pairName = token0 + '-' + token1
        } else {
            pairName = token1 + '-' + token0
        }
        let query = `
    {	
      pairYears(first: 5 where:{name:"${pairName}"}){
        dayPair(first:365, orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} })
        {
          
            token1Price
            token1PriceLow
            token1PriceOpen
            token1PriceHigh
            timestamp
            volumeToken0In
            volumeToken0Out
            volumeToken1In
            volumeToken1Out
          
        }
      }
    }
    `
        const pairData = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/sushi-swap-ohm',
            method: 'post',
            data: {
                query: query,
            },
        })
        const pair = pairData.data.data.pairYears
        let data = []
        let pairs = []
        for (let c = 0; c < pair.length; ++c) {
            for (let i = 0; i < pair[c].dayPair.length; ++i) {
                let obj = {}
                obj.token1PriceClose = pair[c].dayPair[i].token1Price
                obj.token1PriceLow = pair[c].dayPair[i].token1PriceLow
                obj.token1PriceOpen = pair[c].dayPair[i].token1PriceOpen
                obj.token1PriceHigh = pair[c].dayPair[i].token1PriceHigh
                obj.timestamp = pair[c].dayPair[i].timestamp
                obj.volumeToken1In = pair[c].dayPair[i].volumeToken1In
                obj.volumeToken1Out = pair[c].dayPair[i].volumeToken1Out
                pairs.push(obj)
            }
        }
        let [
            prevToken1PriceOpen,
            prevToken1PriceClose,
            prevToken1PriceHigh,
            prevToken1PriceLow,
            prevVolumeToken1In,
            prevVolumeToken1Out,
        ] = [0, 0, 0, 0, 0, 0]

        for (
            let beginTimestamp = startTimestamp,
                endTimestamp = startTimestamp + days * 86400;
            beginTimestamp < endTime;
            beginTimestamp += days * 86400, endTimestamp += days * 86400
        ) {
            let obj = {
                beginTimestamp: beginTimestamp,
                endTimestamp: endTimestamp,
                token1PriceOpen: prevToken1PriceClose,
                token1PriceClose: prevToken1PriceClose,
                token1PriceHigh: prevToken1PriceClose,
                token1PriceLow: prevToken1PriceClose,
                volumeToken1In: 0,
                volumeToken1Out: 0,
            }
            let isOpen = false
            for (let j = 0; j < pairs.length; ++j) {
                if (
                    beginTimestamp <= pairs[j].timestamp &&
                    pairs[j].timestamp < endTimestamp
                ) {
                    obj.token1PriceClose = Number(pairs[j].token1PriceClose)
                    prevToken1PriceClose = Number(pairs[j].token1PriceClose)
                    if (!isOpen) {
                        obj.token1PriceOpen = Number(pairs[j].token1PriceOpen)
                        obj.token1PriceLow = Number(pairs[j].token1PriceLow)
                        isOpen = true
                        prevToken1PriceOpen = Number(pairs[j].token1PriceOpen)
                    }

                    if (
                        Number(pairs[j].token1PriceHigh) > obj.token1PriceHigh
                    ) {
                        obj.token1PriceHigh = Number(pairs[j].token1PriceHigh)
                    }
                    if (Number(pairs[j].token1PriceLow) < obj.token1PriceLow) {
                        obj.token1PriceLow = Number(pairs[j].token1PriceLow)
                    }
                    obj.volumeToken1In += Number(pairs[j].volumeToken1In)
                    obj.volumeToken1Out += Number(pairs[j].volumeToken1Out)
                }
            }
            data.push(obj)
        }
        return data
    } catch (err) {
        console.log(err)
    }
}

/**
 * @dev : Get pairs (N hours)
 * @param startTimestamp - Start timestamp for query
 * @param endTime - End timestamp for query
 * @param token0 - Token0 symbol e.g. OHM
 * @param token1 - Token1 symbol e.g. DAI
 * @param hours - Number of hours
 */
export async function getPairsInfoNHours(
    startTimestamp,
    endTime,
    token0,
    token1,
    hours
) {
    let findPairQuery =
        `{
    pairs(where:{name_in:["${token0}-` +
        `${token1}"]})
    {
      id
    }
  }
  `

    try {
        const findPair = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/sushi-swap-ohm',
            method: 'post',
            data: {
                query: findPairQuery,
            },
        })
        let id = findPair.data.data.pairs[0].id
        let pairName
        if (id !== undefined) {
            pairName = token0 + '-' + token1
        } else {
            pairName = token1 + '-' + token0
        }
        let query = `
    {	
      pairYears(first: 5 where:{name:"${pairName}"}){
        dayPair(first:365, orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} })
        {
          hourPair(first:24 orderBy:timestamp)
          {
            token1Price
            token1PriceLow
            token1PriceOpen
            token1PriceHigh
            timestamp
            volumeToken0In
            volumeToken0Out
            volumeToken1In
            volumeToken1Out
          }
        }
      }
    }
    `
        const pairData = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/sushi-swap-ohm',
            method: 'post',
            data: {
                query: query,
            },
        })
        const pair = pairData.data.data.pairYears
        let data = []
        let pairs = []
        for (let c = 0; c < pair.length; ++c) {
            for (let i = 0; i < pair[c].dayPair.length; ++i) {
                for (let j = 0; j < pair[c].dayPair[i].hourPair.length; ++j) {
                    let obj = {}
                    obj.token1PriceClose =
                        pair[c].dayPair[i].hourPair[j].token1Price
                    obj.token1PriceLow =
                        pair[c].dayPair[i].hourPair[j].token1PriceLow
                    obj.token1PriceOpen =
                        pair[c].dayPair[i].hourPair[j].token1PriceOpen
                    obj.token1PriceHigh =
                        pair[c].dayPair[i].hourPair[j].token1PriceHigh
                    obj.timestamp = pair[c].dayPair[i].hourPair[j].timestamp
                    obj.volumeToken1In =
                        pair[c].dayPair[i].hourPair[j].volumeToken1In
                    obj.volumeToken1Out =
                        pair[c].dayPair[i].hourPair[j].volumeToken1Out
                    pairs.push(obj)
                }
            }
        }
        let [
            prevToken1PriceOpen,
            prevToken1PriceClose,
            prevToken1PriceHigh,
            prevToken1PriceLow,
            prevVolumeToken1In,
            prevVolumeToken1Out,
        ] = [0, 0, 0, 0, 0, 0]

        for (
            let beginTimestamp = startTimestamp,
                endTimestamp = startTimestamp + hours * 3600;
            beginTimestamp < endTime;
            beginTimestamp += hours * 3600, endTimestamp += hours * 3600
        ) {
            let obj = {
                beginTimestamp: beginTimestamp,
                endTimestamp: endTimestamp,
                token1PriceOpen: prevToken1PriceClose,
                token1PriceClose: prevToken1PriceClose,
                token1PriceHigh: prevToken1PriceClose,
                token1PriceLow: prevToken1PriceClose,
                volumeToken1In: 0,
                volumeToken1Out: 0,
            }
            let isOpen = false
            for (let j = 0; j < pairs.length; ++j) {
                if (
                    beginTimestamp <= pairs[j].timestamp &&
                    pairs[j].timestamp < endTimestamp
                ) {
                    obj.token1PriceClose = Number(pairs[j].token1PriceClose)
                    prevToken1PriceClose = Number(pairs[j].token1PriceClose)

                    if (!isOpen) {
                        obj.token1PriceOpen = Number(pairs[j].token1PriceOpen)
                        obj.token1PriceLow = Number(pairs[j].token1PriceLow)
                        isOpen = true
                        prevToken1PriceOpen = Number(pairs[j].token1PriceOpen)
                    }

                    if (
                        Number(pairs[j].token1PriceHigh) > obj.token1PriceHigh
                    ) {
                        obj.token1PriceHigh = Number(pairs[j].token1PriceHigh)
                    }
                    if (Number(pairs[j].token1PriceLow) < obj.token1PriceLow) {
                        obj.token1PriceLow = Number(pairs[j].token1PriceLow)
                    }
                    obj.volumeToken1In += Number(pairs[j].volumeToken1In)
                    obj.volumeToken1Out += Number(pairs[j].volumeToken1Out)
                }
            }

            data.push(obj)
        }

        return data
    } catch (err) {
        console.log(err)
    }
}

/**
 * @dev : Get pairs (N minutes)
 * @param startTimestamp - Start timestamp for query
 * @param endTime - End timestamp for query
 * @param token0 - Token0 symbol e.g. OHM
 * @param token1 - Token1 symbol e.g. DAI
 * @param minutes - Number of minutes
 */
export async function getPairsInfoNMinutes(
    startTimestamp,
    endTime,
    token0,
    token1,
    minutes
) {
    let findPairQuery =
        `{
    pairs(where:{name_in:["${token0}-` +
        `${token1}"]})
    {
      id
    }
  }
  `

    try {
        const findPair = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/sushi-swap-ohm',
            method: 'post',
            data: {
                query: findPairQuery,
            },
        })
        let id = findPair.data.data.pairs[0].id
        let pairName
        if (id !== undefined) {
            pairName = token0 + '-' + token1
        } else {
            pairName = token1 + '-' + token0
        }
        let query = `
    {	
      pairYears(first: 5 where:{name:"${pairName}"}){
        dayPair(first:365, orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} })
        {
          hourPair(first:24 orderBy:timestamp)
        {
          minutePair(first:60 orderBy:timestamp)
          {
            token1Price
            token1PriceLow
            token1PriceOpen
            token1PriceHigh
            timestamp
            volumeToken0In
            volumeToken0Out
            volumeToken1In
            volumeToken1Out
          }
        }
          
        }
      }
    }
    `
        const pairData = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/sushi-swap-ohm',
            method: 'post',
            data: {
                query: query,
            },
        })
        const pair = pairData.data.data.pairYears
        let data = []
        let pairs = []
        for (let c = 0; c < pair.length; ++c) {
            for (let i = 0; i < pair[c].dayPair.length; ++i) {
                for (let j = 0; j < pair[c].dayPair[i].hourPair.length; ++j) {
                    for (
                        let k = 0;
                        k < pair[c].dayPair[i].hourPair[j].minutePair.length;
                        ++k
                    ) {
                        let obj = {}
                        obj.token1PriceClose =
                            pair[c].dayPair[i].hourPair[j].minutePair[
                                k
                            ].token1Price
                        obj.token1PriceLow =
                            pair[c].dayPair[i].hourPair[j].minutePair[
                                k
                            ].token1PriceLow
                        obj.token1PriceOpen =
                            pair[c].dayPair[i].hourPair[j].minutePair[
                                k
                            ].token1PriceOpen
                        obj.token1PriceHigh =
                            pair[c].dayPair[i].hourPair[j].minutePair[
                                k
                            ].token1PriceHigh
                        obj.timestamp =
                            pair[c].dayPair[i].hourPair[j].minutePair[
                                k
                            ].timestamp
                        obj.volumeToken1In =
                            pair[c].dayPair[i].hourPair[j].minutePair[
                                k
                            ].volumeToken1In
                        obj.volumeToken1Out =
                            pair[c].dayPair[i].hourPair[j].minutePair[
                                k
                            ].volumeToken1Out
                        pairs.push(obj)
                    }
                }
            }
        }
        // let prevToken1PriceOpen = 0, prevToken1PriceClose = 0
        let [prevToken1PriceOpen, prevToken1PriceClose] = [0, 0]
        for (
            let beginTimestamp = startTimestamp,
                endTimestamp = startTimestamp + minutes * 60;
            beginTimestamp < endTime;
            beginTimestamp += minutes * 60, endTimestamp += minutes * 60
        ) {
            let obj = {
                beginTimestamp: beginTimestamp,
                endTimestamp: endTimestamp,
                token1PriceOpen: prevToken1PriceClose,
                token1PriceClose: prevToken1PriceClose,
                token1PriceHigh: prevToken1PriceClose,
                token1PriceLow: prevToken1PriceClose,
                volumeToken1In: 0,
                volumeToken1Out: 0,
            }
            let isOpen = false
            for (let j = 0; j < pairs.length; ++j) {
                if (
                    beginTimestamp <= pairs[j].timestamp &&
                    pairs[j].timestamp < endTimestamp
                ) {
                    obj.token1PriceClose = Number(pairs[j].token1PriceClose)
                    prevToken1PriceClose = Number(pairs[j].token1PriceClose)
                    if (!isOpen) {
                        prevToken1PriceOpen = Number(pairs[j].token1PriceOpen)
                        obj.token1PriceOpen = Number(pairs[j].token1PriceOpen)
                        obj.token1PriceLow = Number(pairs[j].token1PriceLow)
                        isOpen = true
                    }

                    if (
                        Number(pairs[j].token1PriceHigh) > obj.token1PriceHigh
                    ) {
                        obj.token1PriceHigh = Number(pairs[j].token1PriceHigh)
                    }
                    if (Number(pairs[j].token1PriceLow) < obj.token1PriceLow) {
                        obj.token1PriceLow = Number(pairs[j].token1PriceLow)
                    }
                    obj.volumeToken1In += Number(pairs[j].volumeToken1In)
                    obj.volumeToken1Out += Number(pairs[j].volumeToken1Out)
                }
            }
            data.push(obj)
        }
        return data
    } catch (err) {
        console.log(err)
    }
}
