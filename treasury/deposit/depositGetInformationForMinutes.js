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



export async function getDepositByNMinut(startTimestamp=0,endTimestamp=Date.now()/1000,n){
    try{
        let bigArray=await reformToBigArrayForMinut(await getDepositByMinutFromGraph());
     
        for(let i=0;i<bigArray.length;i++){
            bigArray[i].array=fillBigArrayForNMinut( bigArray[i].array,startTimestamp,endTimestamp,n);
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
async function getDepositByMinutFromGraph(){
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

async function reformToBigArrayForMinut(days){
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

function fillBigArrayForNMinut(stakes,startTimestamp,endTime,minutes){
    let data=[]
    for(let beginTimestamp = startTimestamp, endTimestamp = startTimestamp + minutes*minute; beginTimestamp < endTime; beginTimestamp += minutes*minute, endTimestamp+=minutes*minute)
    {
      let obj = {
        timestamp: beginTimestamp,
        endTimestamp: endTimestamp,
        amount: 0,
        profit: 0,
        value: 0,
        sumAmount:data.length==0?0:data[data.length-1].sumAmount,
        sumProfit:data.length==0?0:data[data.length-1].sumProfit,
        sumValue:data.length==0?0:data[data.length-1].sumValue,
        sender:[]
      }
      for(let j = 0; j < stakes.length; ++j)
      {
        
        if(beginTimestamp <= stakes[j].timestamp && stakes[j].timestamp < endTimestamp)
        {
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