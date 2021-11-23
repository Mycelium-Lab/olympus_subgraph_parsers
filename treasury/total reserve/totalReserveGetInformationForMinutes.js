import axios from 'axios';
import { token } from '../config.js';
import { getWholePeriodOfTime } from '../utils/date.js';


const minute =60;

const minuteQuery =`
 {
  reservesYearsEntities(first: 100 orderBy:timestamp) {
    reserversDays(first: 365 orderBy:timestamp) {
      reserversHours(first: 24 orderBy:timestamp) {
        reserversMinutes(first: 60 orderBy:timestamp) {
          audited
          timestamp
          finalTotalReserves
        }
      }
    }
  }
}

  `


export async function getTotalReservesByNMinutes(startTimestamp=0,endTimestamp=Date.now()/1000,n){
    try{
        return fillBigArrayForNMinutes(reformToBigArrayForMinutes( await getTotalReservesByMinutesFromGraph()),startTimestamp,endTimestamp,n);
    }
    catch(err)
    {
        console.log(err)
    }
}

async function getTotalReservesByMinutesFromGraph(){
    try{
        const minuteData = await axios({
            url: `https://api.thegraph.com/subgraphs/id/${token}`,
            method: 'post',
            data: {
              query: minuteQuery
            }
          })
        return minuteData.data.data.reservesYearsEntities;
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
function reformToBigArrayForMinutes(days){
    let out=[];
    for(let i=0; i<days.length; i++){
        for(let j=0; j<days[i].reserversDays.length; j++){
            for(let k=0; k<days[i].reserversDays[j].reserversHours.length; k++){
                for(let l=0; l<days[i].reserversDays[j].reserversHours[k].reserversMinutes.length;l++){
                    out.push(days[i].reserversDays[j].reserversHours[k].reserversMinutes[l]);
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
        totalReserves:data.length>0?data[data.length-1].totalReserves:0 ,
        audited:false,
      }
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