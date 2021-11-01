import axios from 'axios'
import { token } from '../config.js';
import {getWholePeriodOfTime} from '../utils/date.js'
import {getTokens} from '../tokens/getTokens.js'

const day =60*60*24;

// graphql request for the Graph
const dayQuery =`
{
    depositFunctionYearEntities(first:1000 orderBy:timestamp){
     dayDeposit(first:366  orderBy:timestamp){
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
  `

export async function getDepositByDay(startTimestamp=0,endTimestamp=Date.now()/1000){
    try{
        let bigArray=await reformToBigArrayForDays(await getDepositByDaysFromGraph());
        
        for(let i=0;i<bigArray.length;i++){
            bigArray[i].array=fillBigArrayForDays( bigArray[i].array,startTimestamp,endTimestamp);
        }
       
        return bigArray;
    }
    catch(err)
    {
        console.log(err)
    }
}


async function getDepositByDaysFromGraph(){
    try{
        const dayData = await axios({
            url: `https://api.thegraph.com/subgraphs/id/${token}`,
            method: 'post',
            data: {
              query: dayQuery
            }
          })
        return dayData.data.data.depositFunctionYearEntities;
    }
    catch(err)
    {
        console.log(err)
    }
}

/**
 * struct from subgrph reform to array
 * @param {} days struct from subgrph
 * @returns 
 */
async function reformToBigArrayForDays(days){
    let out=[];
    let tokens=await getTokens();
    for(let i=0; i<tokens.length; i++){
        out.push({ 
            token:tokens[i],
            array:[]
        })
    }
    
    for(let i=0; i<days.length; i++){
        for(let j=0; j<days[i].dayDeposit.length; j++){
            for(let m=0;m<tokens.length;m++){
                if(days[i].dayDeposit[j].id.slice(0,42)==tokens[m]){
                    out[m].array.push(days[i].dayDeposit[j]);
                }
            }
        }
    }
    return out;
}
/**
 * fills the array and divides it into equal time intervals
 * @param {*} bigArray  
 * @returns 
 */
function fillBigArrayForDays(bigArray,startTimestamp,endTimestamp){
    let j=0;
    while(bigArray[j].timestamp<startTimestamp) j++;
    let out = [];
    for(let i=j==0?1:j;i<bigArray.length;i++){
        let timestamp=getWholePeriodOfTime(parseInt(bigArray[i-1].timestamp),day)
        let nextTimestamp=getWholePeriodOfTime(parseInt(bigArray[i].timestamp),day)
        if (timestamp>endTimestamp) return out;
        if(timestamp>=startTimestamp){
            out.push({
                timestamp:timestamp,
                profit:bigArray[i-1].profit,
                amount:bigArray[i-1].amount,
                value:bigArray[i-1].value,
                sender:bigArray[i-1].sender,
                sumValue:bigArray[i-1].sumValue,
                sumProfit:bigArray[i-1].sumProfit,
                sumAmount:bigArray[i-1].sumAmount,
            });
        }
        timestamp+=day;
        if (timestamp>endTimestamp) return out;

        while(timestamp<nextTimestamp){
            if (timestamp>endTimestamp) return out;

            if(timestamp>=startTimestamp){
                out.push({
                    timestamp:timestamp,
                    profit:0,
                    amount:0,
                    value:0,
                    sender:[],
                    sumValue:bigArray[i-1].sumValue,
                    sumProfit:bigArray[i-1].sumProfit,
                    sumAmount:bigArray[i-1].sumAmount,
                });
            }
            timestamp+=day;
            if (timestamp>endTimestamp) return out;

        }       
    }
    
    out.push({
        timestamp:getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),day),
        profit:bigArray[bigArray.length-1].profit,
        amount:bigArray[bigArray.length-1].amount,
        value:bigArray[bigArray.length-1].value,
        sender:bigArray[bigArray.length-1].sender,
        sumValue:bigArray[bigArray.length-1].sumValue,
        sumProfit:bigArray[bigArray.length-1].sumProfit,
        sumAmount:bigArray[bigArray.length-1].sumAmount,
    })
    let timestamp =getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),day);
    timestamp+=day;
    while(timestamp<=endTimestamp){
        if (timestamp>endTimestamp) return out;

        if(timestamp>=startTimestamp){
            out.push({
                timestamp:timestamp,
                profit:0,
                amount:0,
                value:0,
                sender:[],
                sumValue:bigArray[bigArray.length-1].sumValue,
                sumProfit:bigArray[bigArray.length-1].sumProfit,
                sumAmount:bigArray[bigArray.length-1].sumAmount,
            });
            timestamp+=day;
        }
    }
    return out;
}
