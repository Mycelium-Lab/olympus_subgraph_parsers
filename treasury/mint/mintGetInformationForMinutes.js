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

export async function getMintRewardsByMinutes(startTimestamp=0,endTimestamp=Date.now()/1000){
    try{
        return fillBigArrayForMinutes(reformToBigArrayForMinutes(await getTotalReserveByMinutesFromGraph()),startTimestamp,endTimestamp)
    }
    catch(err)
    {
        console.log(err)
    }
}


async function getTotalReserveByMinutesFromGraph(){
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
function fillBigArrayForMinutes(bigArray,startTimestamp,endTimestamp){
    let out = [];
    let j=0;
    while(bigArray[j].timestamp<startTimestamp) j++;
    for(let i=j==0?1:j;i<bigArray.length;i++){
        let nextTimestamp=getWholePeriodOfTime(parseInt(bigArray[i].timestamp),minute)
        let timestamp=getWholePeriodOfTime(parseInt(bigArray[i-1].timestamp),minute)
        if (timestamp>endTimestamp) return out;
        if(timestamp>=startTimestamp){
            out.push({
                amount:bigArray[i-1].amount,
                timestamp:timestamp,
                recipient:bigArray[i-1].recipient,
                caller:bigArray[i-1].caller,
            });
        }
        timestamp+=minute;
        while(timestamp<nextTimestamp){
            if (timestamp>endTimestamp) return out;

            if(timestamp>=startTimestamp){
                out.push({
                    amount:0,
                    timestamp:timestamp,
                    recipient:[],
                    caller:[]
                });
            }
            timestamp+=minute;
        }
        
    }
    out.push({
      
        timestamp:getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),minute),
        amount:bigArray[bigArray.length-1].amount,
        recipient:bigArray[bigArray.length-1].recipient,
        caller:bigArray[bigArray.length-1].caller,
    })
    let timestamp =getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),minute);
    timestamp+=minute;
    while(timestamp<=endTimestamp){
        out.push({
            timestamp:timestamp,
            amount:0,
            timestamp:timestamp,
            recipient:[],
            caller:[]
        });
        timestamp+=minute;
    }

    return out;
}
