import axios from 'axios'
import { token } from '../config.js';
import {getWholePeriodOfTime} from '../utils/date.js'

const day =60*60*24;
const dayQuery =`
 {
  reservesYearsEntities(first: 100 orderBy:timestamp) {
    reserversDays(first: 365 orderBy:timestamp) {
        audited
        timestamp
        finalTotalReserves
    }
  }
}
`


export async function getTotalReserveByDay(startTimestamp=0,endTimestamp=Date.now()/1000) {
    try{
        return fillBigArrayForDays(reformToBigArrayForDays( await getTotalReserveByDaysFromGraph()),startTimestamp,endTimestamp);
    }
    catch(err)
    {
        console.log(err)
    }
}

async function getTotalReserveByDaysFromGraph(){
    try{
        const dayData = await axios({
            url: `https://api.thegraph.com/subgraphs/id/${token}`,//QmRpuXnecL1xjHgUUMSBaeok9Ggkpdep9KJNMLJxSbDvxZ
            method: 'post',
            data: {
              query: dayQuery
            }
          })
        return dayData.data.data.reservesYearsEntities;
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
function reformToBigArrayForDays(days){
    let out=[];
    for(let i=0; i<days.length; i++){
        for(let j=0; j<days[i].reserversDays.length; j++){         
            out.push(days[i].reserversDays[j]);
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
                totalReserves:bigArray[i-1].finalTotalReserves,
                timestamp:timestamp,
                audited:bigArray[i-1].audited,
            });
        }
        timestamp+=day;
        if (timestamp>endTimestamp) return out;
        while(timestamp<nextTimestamp){
            if(timestamp>=startTimestamp){
                out.push({
                    totalReserves:bigArray[i-1].finalTotalReserves,
                    timestamp:timestamp,
                    audited:false,
                });
            }

            timestamp+=day;
        if (timestamp>endTimestamp) return out;
        }
        
    }
    
    out.push({
        totalReserves:bigArray[bigArray.length-1].finalTotalReserves,
        timestamp:getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),day),////?
        audited:bigArray[bigArray.length-1].audited,
    })
    let timestamp =getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),day);
    timestamp+=day;
    while(timestamp<=endTimestamp){
        out.push({
            totalReserves:bigArray[bigArray.length-1].finalTotalReserves,
            timestamp:timestamp,
            audited:false,
        });
        timestamp+=day;
    }
    return out;
}