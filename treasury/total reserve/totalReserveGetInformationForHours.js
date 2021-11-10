import axios from 'axios'
import { token } from '../config.js';
import {getWholePeriodOfTime} from '../utils/date.js'


const hour =60*60;
const hourQuery =`
 {
  reservesYearsEntities(first: 100 orderBy:timestamp) {
    reserversDays(first: 365 orderBy:timestamp) {
      reserversHours(first: 24 orderBy:timestamp) {
        audited
        timestamp
        finalTotalReserves
      }
    }
  }
}
`




export async function getTotalReserveByNHour(startTimestamp=0,endTimestamp=Date.now()/1000,n){
    try{
        return fillBigArrayForNHours(reformToBigArrayForHours( await getTotalReserveByHoursFromGraph()),startTimestamp,endTimestamp,n);
    }
    catch(err)
    {
        console.log(err)
    }
}

async function getTotalReserveByHoursFromGraph(){
    try{
        const hourData = await axios({
            url: `https://api.thegraph.com/subgraphs/id/${token}`,
            method: 'post',
            data: {
              query: hourQuery
            }
          })
        return hourData.data.data.reservesYearsEntities;
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
function reformToBigArrayForHours(days){
    let out=[];
    for(let i=0; i<days.length; i++){
        for(let j=0; j<days[i].reserversDays.length; j++){
            for(let k=0; k<days[i].reserversDays[j].reserversHours.length; k++){
                out.push(days[i].reserversDays[j].reserversHours[k]);
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
function fillBigArrayForHours(bigArray,startTimestamp,endTimestamp){
    let out = [];
    let j=0;
    while(bigArray[j].timestamp<startTimestamp) j++;
    for(let i=j==0?1:j;i<bigArray.length;i++){
        let nextTimestamp=getWholePeriodOfTime(parseInt(bigArray[i].timestamp),hour)
        let timestamp=getWholePeriodOfTime(parseInt(bigArray[i-1].timestamp),hour)
        if (timestamp>endTimestamp) return out;
        if(timestamp>=startTimestamp){
            out.push({
                totalReserves:bigArray[i-1].finalTotalReserves,
                timestamp:timestamp,
                audited:bigArray[i-1].audited,
            });
        }
        timestamp+=hour;
        if (timestamp>endTimestamp) return out;
        while(timestamp<nextTimestamp){
            if(timestamp>=startTimestamp){
                out.push({
                    totalReserves:bigArray[i-1].finalTotalReserves,
                    timestamp:timestamp,
                    audited:false,
                });
            }
            timestamp+=hour;
            if (timestamp>endTimestamp) return out;
        }        
    }
    
    out.push({
        totalReserves:bigArray[bigArray.length-1].finalTotalReserves,
        timestamp:getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),hour),
        audited:bigArray[bigArray.length-1].audited,
    })
    let timestamp =getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),hour);
    timestamp+=hour;
    while(timestamp<=endTimestamp){
        out.push({
            totalReserves:bigArray[bigArray.length-1].finalTotalReserves,
            timestamp:timestamp,
            audited:false,
        });
        timestamp+=hour;
    }
    return out;
}
/**
 * fills the array and divides it into equal time intervals
 * @param {*} bigArray  
 * @returns 
 */
// function fillBigArrayForNHours(bigArray,startTimestamp,endTimestamp,n){
//     let out = [];
//     let j=0;
//     while(bigArray[j].timestamp<startTimestamp) j++;
//     for(let i=j==0?1:j;i<bigArray.length;i++){
//         let nextTimestamp=getWholePeriodOfTime(parseInt(bigArray[i].timestamp),n*hour)
//         let timestamp=getWholePeriodOfTime(parseInt(bigArray[i-1].timestamp),n*hour)
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
//         timestamp+=n*hour;
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
//             timestamp+=n*hour;
//             if (timestamp>endTimestamp) return out;
//         }        
//     }
//     if(out.length>0){
//         if(out[out.length-1].timestamp!=getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),n*hour)){
//             out.push({
//                 totalReserves:bigArray[bigArray.length-1].finalTotalReserves,
//                 timestamp:getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),n*hour),
//                 audited:bigArray[bigArray.length-1].audited,
//             })
//         }else{
//             out[out.length-1].totalReserves=bigArray[bigArray.length-1].finalTotalReserves;
//         }
//     }
//     let timestamp =getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),n*hour);
//     timestamp+=n*hour;
//     while(timestamp<=endTimestamp){
//         out.push({
//             totalReserves:bigArray[bigArray.length-1].finalTotalReserves,
//             timestamp:timestamp,
//             audited:false,
//         });
//         timestamp+=n*hour;
//     }
//     if(out.length==0){
//         out.push({
//             totalReserves:bigArray[bigArray.length-1].finalTotalReserves,
//             timestamp:timestamp-n*hour,
//             audited:false,
//         })
//     }
//     return out;
// }



function fillBigArrayForNHours(stakes,startTimestamp,endTime,hours){
    let data=[]
    for(let beginTimestamp = startTimestamp, endTimestamp = startTimestamp + hours*hour; beginTimestamp < endTime; beginTimestamp += hours*hour, endTimestamp+=hours*hour)
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
            obj.totalReserves = Number(stakes[j].totalReserves)
            obj.audited= stakes[j].audited
        }
      }
      data.push(obj)
    }
    return data
}