import axios from 'axios'
import { token } from '../config.js';
import {getWholePeriodOfTime} from '../utils/date.js'
import {getTokens} from '../tokens/getTokens.js'

const minute =60;

// graphql request for the Graph
const minuteQuery =`
{
    depositFunctionYearEntities(first:1000 orderBy:timestamp){
     dayDeposit(first:366  orderBy:timestamp){
       hourDeposit(first:24  orderBy:timestamp){
           minuteDeposit(first:60  orderBy:timestamp){
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
 }
  `

export async function getDepositByMinut(startTimestamp=0,endTimestamp=Date.now()/1000){
    try{
        let bigArray=await reformToBigArrayForMinutes(await getDepositByMinutesFromGraph());
        
        for(let i=0;i<bigArray.length;i++){
            bigArray[i].array=fillBigArrayForMinues( bigArray[i].array,startTimestamp,endTimestamp);
        }
        
        return bigArray;
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
async function getDepositByMinutesFromGraph(){
    try{
        const minuteData = await axios({
            url: `https://api.thegraph.com/subgraphs/id/${token}`,
            method: 'post',
            data: {
              query: minuteQuery
            }
          })
        return minuteData.data.data.depositFunctionYearEntities;
    }
    catch(err)
    {
        console.log(err)
    }
}

async function reformToBigArrayForMinutes(days){
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
            for(let k=0; k<days[i].dayDeposit[j].hourDeposit.length; k++){
                for(let l=0; l<days[i].dayDeposit[j].hourDeposit[k].minuteDeposit.length;l++){
                    for(let m=0;m<tokens.length;m++){
                       if(days[i].dayDeposit[j].hourDeposit[k].minuteDeposit[l].id.slice(0,42)==tokens[m]){
                           out[m].array.push(days[i].dayDeposit[j].hourDeposit[k].minuteDeposit[l]);
                       }
                    }
                }
            }
        }
    }
    return out;
}
function fillBigArrayForMinues(bigArray,startTimestamp,endTimestamp){
    let out = [];
    let j=0;
    while(bigArray[j].timestamp<startTimestamp) j++;
    for(let i=j==0?1:j;i<bigArray.length;i++){
       
        let timestamp=getWholePeriodOfTime(parseInt(bigArray[i-1].timestamp),minute)
        let nextTimestamp=getWholePeriodOfTime(parseInt(bigArray[i].timestamp),minute)
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
        timestamp+=minute;
        if (timestamp>endTimestamp) return out;
        while(timestamp<nextTimestamp){
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
            timestamp+=minute;
            if (timestamp>endTimestamp) return out;

        }       
    }
    
    out.push({
        timestamp:getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),minute),
        profit:bigArray[bigArray.length-1].profit,
        amount:bigArray[bigArray.length-1].amount,
        value:bigArray[bigArray.length-1].value,
        sender:bigArray[bigArray.length-1].sender,
        sumValue:bigArray[bigArray.length-1].sumValue,
        sumProfit:bigArray[bigArray.length-1].sumProfit,
        sumAmount:bigArray[bigArray.length-1].sumAmount,
    })
    let timestamp =getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),minute);
    timestamp+=minute;
    while(timestamp<=endTimestamp){
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
        timestamp+=minute;
    }
    return out;
}
