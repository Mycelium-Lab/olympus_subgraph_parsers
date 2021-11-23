import axios from 'axios'
import { token } from '../config.js';
import {getWholePeriodOfTime} from '../utils/date.js'


const minute =60;

const minuteQuery =`
{
    yearRewardsMintedEntities(first:100 orderBy:timestamp){
      dayMint(first:365 orderBy:timestamp){
        hourMint(first:24 orderBy:timestamp){
          minuteMint(first:60 orderBy:timestamp){
            timestamp
            amount
            recipient
            caller
          }
        }
      }
    }
  }

  `




export async function getMintRewardsByNMinutes(startTimestamp=0,endTimestamp=Date.now()/1000,n){
    try{
        return fillBigArrayForNMinutes(reformToBigArrayForMinutes(await getMintRewardsByMinutesFromGraph()),startTimestamp,endTimestamp,n)
    }
    catch(err)
    {
        console.log(err)
    }
}

async function getMintRewardsByMinutesFromGraph(){
    try{
        const minuteData = await axios({
            url: `https://api.thegraph.com/subgraphs/id/${token}`,
            method: 'post',
            data: {
              query: minuteQuery
            }
          })
        return minuteData.data.data.yearRewardsMintedEntities;
    }
    catch(err)
    {
        console.log(err)
    }
}

function reformToBigArrayForMinutes(days){
    let out=[];
    for(let i=0; i<days.length; i++){
        for(let j=0; j<days[i].dayMint.length; j++){
            for(let k=0; k<days[i].dayMint[j].hourMint.length; k++){
                for(let l=0; l<days[i].dayMint[j].hourMint[k].minuteMint.length;l++){
                    out.push(days[i].dayMint[j].hourMint[k].minuteMint[l]);
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
function fillBigArrayForNMinutes(stakes,startTimestamp,endTime,minutes){
    let data=[]
    for(let beginTimestamp = startTimestamp, endTimestamp = startTimestamp + minutes*minute; beginTimestamp < endTime; beginTimestamp += minutes*minute, endTimestamp+=minutes*minute)
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