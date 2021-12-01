import axios from 'axios'
import { token } from '../config.js'
import { getTokens } from '../tokens/getTokens.js'

const hour = 60 * 60

// graphql request for the Graph
const hourQuery = `
{
    depositFunctionYearEntities(first:1000 orderBy:timestamp){
     dayDeposit(first:366  orderBy:timestamp){
       hourDeposit(first:24  orderBy:timestamp){
           timestamp
           profit
           amount
           value
           sender
           sumValue
           sumProfit
           sumAmount
           id
       }
     }
     
   }
 }
  `

export async function getDepositInfoNHours(
    startTimestamp = 0,
    endTimestamp = Date.now() / 1000,
    n
) {
    try {
        let bigArray = await reformToBigArrayForHour(
            await getDepositByHoursFromGraph()
        )

        for (let i = 0; i < bigArray.length; i++) {
            bigArray[i].array = fillBigArrayForNHours(
                bigArray[i].array,
                startTimestamp,
                endTimestamp,
                n
            )
        }

        return bigArray
    } catch (err) {
        console.log(err)
    }
}

async function getDepositByHoursFromGraph() {
    try {
        const hourData = await axios({
            url: `https://api.thegraph.com/subgraphs/id/${token}`,
            method: 'post',
            data: {
                query: hourQuery,
            },
        })
        return hourData.data.data.depositFunctionYearEntities
    } catch (err) {
        console.log(err)
    }
}

/**
 * struct from subgrph reform to array
 * @param {} days struct from subgrph
 * @returns
 */
async function reformToBigArrayForHour(days) {
    let out = []
    let tokens = await getTokens()
    for (let i = 0; i < tokens.length; i++) {
        out.push({
            token: tokens[i],
            array: [],
        })
    }

    for (let i = 0; i < days.length; i++) {
        for (let j = 0; j < days[i].dayDeposit.length; j++) {
            for (let k = 0; k < days[i].dayDeposit[j].hourDeposit.length; k++) {
                for (let m = 0; m < tokens.length; m++) {
                    if (
                        days[i].dayDeposit[j].hourDeposit[k].id.slice(0, 42) ==
                        tokens[m]
                    ) {
                        out[m].array.push(days[i].dayDeposit[j].hourDeposit[k])
                    }
                }
            }
        }
    }
    return out
}

function fillBigArrayForNHours(stakes, startTimestamp, endTime, hours) {
    let data = []
    for (
        let beginTimestamp = startTimestamp,
            endTimestamp = startTimestamp + hours * 3600;
        beginTimestamp < endTime;
        beginTimestamp += hours * 3600, endTimestamp += hours * 3600
    ) {
        let obj = {
            timestamp: beginTimestamp,
            endTimestamp: endTimestamp,
            amount: 0,
            profit: 0,
            value: 0,
            sumAmount: data.length == 0 ? 0 : data[data.length - 1].sumAmount,
            sumProfit: data.length == 0 ? 0 : data[data.length - 1].sumProfit,
            sumValue: data.length == 0 ? 0 : data[data.length - 1].sumValue,
            sender: [],
        }
        for (let j = 0; j < stakes.length; ++j) {
            if (
                beginTimestamp <= stakes[j].timestamp &&
                stakes[j].timestamp < endTimestamp
            ) {
                obj.amount += Number(stakes[j].amount)
                obj.profit += Number(stakes[j].profit)
                obj.value += Number(stakes[j].value)
                obj.sumValue = Number(stakes[j].sumValue)
                obj.sumProfit = Number(stakes[j].sumProfit)
                obj.sumAmount = Number(stakes[j].sumAmount)
                obj.sender.concat(stakes[j].sender)
            }
        }
        data.push(obj)
    }
    return data
}
