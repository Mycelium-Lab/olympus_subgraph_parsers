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



export async function getTotalReserveByNDay(startTimestamp=0,endTimestamp=Date.now()/1000,n){
    try{
        return fillBigArrayForNDay(reformToBigArrayForDay( await getTotalReserveByDayFromGraph()),startTimestamp,endTimestamp,n);
    }
    catch(err)
    {
        console.log(err)
    }
}

async function getTotalReserveByDayFromGraph(){
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
function reformToBigArrayForDay(days){
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

function fillBigArrayForNDay(stakes,startTimestamp,endTime,days){
    let data=[]
    for(let beginTimestamp = startTimestamp, endTimestamp = startTimestamp + days*day; beginTimestamp < endTime; beginTimestamp += days*day, endTimestamp+=days*day)
    {
      let obj = {
        timestamp: beginTimestamp,
        endTimestamp: endTimestamp,
        totalReserves:data.length>0?data[data.length-1].totalReserves:0 ,
        audited:false,
      }
      console.log(stakes[0])
      for(let j = 0; j < stakes.length; ++j)
      {
        
        if(beginTimestamp <= stakes[j].timestamp && stakes[j].timestamp < endTimestamp)
        {
            obj.totalReserves = Number(stakes[j].finalTotalReserves)
            obj.audited= stakes[j].audited
        }
      }
      data.push(obj)
    }
    return data
}