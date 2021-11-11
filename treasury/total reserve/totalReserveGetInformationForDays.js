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
        return fillBigArrayForNDays(reformToBigArrayForDays( await getTotalReserveByDaysFromGraph()),startTimestamp,endTimestamp,n);
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
/**
 * fills the array and divides it into equal time intervals
 * @param {*} bigArray  
 * @returns 
 */
//  function fillBigArrayForNDays(bigArray,startTimestamp,endTimestamp,n){
//     let out = [];
//     let j=0;
//     while(bigArray[j].timestamp<startTimestamp) j++;
//     for(let i=j==0?1:j;i<bigArray.length;i++){
//         let nextTimestamp=getWholePeriodOfTime(parseInt(bigArray[i].timestamp),n*day)
//         let timestamp=(parseInt(bigArray[i-1].timestamp),n*day)
//         if (timestamp>endTimestamp) return out;
//         if(timestamp>=startTimestamp){
//             if(out.length!=0&&out[out.length-1].timestamp==timestamp){
//                 out[out.length-1].audited= out[out.length-1].audited?true:bigArray[i-1].audited;
//                 out[out.length-1].totalReserves=bigArray[i-1].finalTotalReserves;
//             }
//             else{
//                 out.push({
//                     totalReserves:bigArray[i-1].finalTotalReserves,
//                     timestamp:timestamp,
//                     audited:bigArray[i-1].audited,
//                 });
//             }
//         }
//         timestamp+=n*day;
//         if (timestamp>endTimestamp) return out;
//         while(timestamp<nextTimestamp){
//             if(timestamp>=startTimestamp){
//                 if(out.length!=0&&out[out.length-1].timestamp==timestamp){
//                     out[out.length-1].audited= out[out.length-1].audited?true:bigArray[i-1].audited;
//                     out[out.length-1].totalReserves=bigArray[i-1].finalTotalReserves;
//                 }
//                 else{
//                     out.push({
//                         totalReserves:bigArray[i-1].finalTotalReserves,
//                         timestamp:timestamp,
//                         audited:false,
//                     });
//                 }
//             }
//             timestamp+=n*day;
//             if (timestamp>endTimestamp) return out;
//         }        
//     }
//     if(out.length>0){
//         if(out[out.length-1].timestamp!=getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),n*day)){
//             out.push({
//                 totalReserves:bigArray[bigArray.length-1].finalTotalReserves,
//                 timestamp:getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),n*day),
//                 audited:bigArray[bigArray.length-1].audited,
//             })
//         }else{
//             out[out.length-1].totalReserves=bigArray[bigArray.length-1].finalTotalReserves;
//         }
//     }
//     let timestamp =getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),n*day);
//     timestamp+=n*day;
//     while(timestamp<=endTimestamp){
//         out.push({
//             totalReserves:bigArray[bigArray.length-1].finalTotalReserves,
//             timestamp:timestamp,
//             audited:false,
//         });
//         timestamp+=n*day;
//     }
//     if(out.length==0){
//         out.push({
//             totalReserves:bigArray[bigArray.length-1].finalTotalReserves,
//             timestamp:timestamp-n*day,
//             audited:false,
//         })
//     }
//     return out;
// }


function fillBigArrayForNDays(stakes,startTimestamp,endTime,days){
    let data=[]
    for(let beginTimestamp = startTimestamp, endTimestamp = startTimestamp + days*day; beginTimestamp < endTime; beginTimestamp += days*day, endTimestamp+=days*day)
    {
      let obj = {
        timestamp: beginTimestamp,
        endTimestamp: endTimestamp,
        totalReserves:data.length>0?data[data.length-1].finalTotalReserves:0 ,
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