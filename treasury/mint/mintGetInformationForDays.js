import axios from 'axios'
import { token } from '../config.js';
import {getWholePeriodOfTime} from '../utils/date.js'


const day =60*60*24;

const dayQuery =`
{
    yearRewardsMintedEntities(first:100 orderBy:timestamp){
      dayMint(first:365 orderBy:timestamp){
        timestamp
        amount
        recipient
        caller
      }
    }
  }
  `



export async function getMintRewardsByNDay(startTimestamp=0,endTimestamp=Date.now()/1000,n){
    try{
        return fillBigArrayForNDay(reformToBigArrayForDay(await getTotalReserveByDayFromGraph()),startTimestamp,endTimestamp,n)
    }
    catch(err)
    {
        console.log(err)
    }
}

async function getTotalReserveByDayFromGraph(){
    try{
        const dayData = await axios({
            url: `https://api.thegraph.com/subgraphs/id/${token}`,
            method: 'post',
            data: {
              query: dayQuery
            }
          })
        return dayData.data.data.yearRewardsMintedEntities;
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
function reformToBigArrayForDay(days){
    let out=[];
    for(let i=0; i<days.length; i++){
        for(let j=0; j<days[i].dayMint.length; j++){
            out.push(days[i].dayMint[j]);
        }
    }
    return out;
}

/**
 * fills the array and divides it into equal time intervals
 * @param {*} bigArray  
 * @returns 
 */
function fillBigArrayForNDay(stakes,startTimestamp,endTime,days){
    let data=[]
    for(let beginTimestamp = startTimestamp, endTimestamp = startTimestamp + days*day; beginTimestamp < endTime; beginTimestamp += days*day, endTimestamp+=days*day)
    {
      let obj = {
        timestamp: beginTimestamp,
        endTimestamp: endTimestamp,
        amount: 0,
        recipient:[],
        caller:[]
      }
      for(let j = 0; j < stakes.length; ++j)
      {
        
        if(beginTimestamp <= stakes[j].timestamp && stakes[j].timestamp < endTimestamp)
        {
          obj.amount += Number(stakes[j].amount)
          obj.recipient.concat(stakes[j].recipient)
          obj.caller.concat(stakes[j].caller)
        }
      }
      data.push(obj)
    }
    return data
}