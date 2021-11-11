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


export async function getTotalReserveByNMinut(startTimestamp=0,endTimestamp=Date.now()/1000,n){
    try{
        return fillBigArrayForNMinutes(reformToBigArrayForMinutes( await getTotalReserveByMinutesFromGraph()),startTimestamp,endTimestamp,n);
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
function fillBigArrayForMinues(bigArray,startTimestamp,endTimestamp){
    let out = [];
    let j=0;

    while(bigArray[j].timestamp<startTimestamp) j++;
    for(let i=j==0?1:j;i<bigArray.length;i++){
        let nextTimestamp=getWholePeriodOfTime(parseInt(bigArray[i].timestamp),minute)
        let timestamp=getWholePeriodOfTime(parseInt(bigArray[i-1].timestamp),minute)
        if (timestamp>endTimestamp) return out;
        if(timestamp>=startTimestamp){
            out.push({
                totalReserves:bigArray[i-1].finalTotalReserves,
                timestamp:timestamp,
                audited:bigArray[i-1].audited,
            });
        }
        timestamp+=minute;
        if (timestamp>endTimestamp) return out;
        while(timestamp<nextTimestamp){
            if(timestamp>=startTimestamp){
            out.push({
                    totalReserves:bigArray[i-1].finalTotalReserves,
                    timestamp:timestamp,
                    audited:false,
                });
            }
            timestamp+=minute;
            if (timestamp>endTimestamp) return out;
        }
        
    }

    out.push({
        totalReserves:bigArray[bigArray.length-1].finalTotalReserves,
        timestamp:getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),minute),
        audited:bigArray[bigArray.length-1].audited,
    })
    let timestamp =getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),minute);
    timestamp+=minute;
    while(timestamp<=endTimestamp){
        out.push({
            totalReserves:bigArray[bigArray.length-1].finalTotalReserves,
            timestamp:timestamp,
            audited:false,
        });
        timestamp+=minute;
    }
    return out;
}


/**
 * fills the array and divides it into equal time intervals
 * @param {*} bigArray  
 * @returns 
 */
//  function fillBigArrayForNMinutes(bigArray,startTimestamp,endTimestamp,n){
//     let out = [];
//     let j=0;
//     while(bigArray[j].timestamp<startTimestamp) j++;
//     for(let i=j==0?1:j;i<bigArray.length;i++){
//         let nextTimestamp=getWholePeriodOfTime(parseInt(bigArray[i].timestamp),n*minute)
//         let timestamp=getWholePeriodOfTime(parseInt(bigArray[i-1].timestamp),n*minute)
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
//         timestamp+=n*minute;
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
//             timestamp+=n*minute;
//             if (timestamp>endTimestamp) return out;
//         }        
//     }
//     if(out.length>0){
//         if(out[out.length-1].timestamp!=getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),n*minute)){
//             out.push({
//                 totalReserves:bigArray[bigArray.length-1].finalTotalReserves,
//                 timestamp:getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),n*minute),
//                 audited:bigArray[bigArray.length-1].audited,
//             })
//         }else{
//             out[out.length-1].totalReserves=bigArray[bigArray.length-1].finalTotalReserves;
//         }
//     }
//     let timestamp =getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),n*minute);
//     timestamp+=n*minute;
//     while(timestamp<=endTimestamp){
//         out.push({
//             totalReserves:bigArray[bigArray.length-1].finalTotalReserves,
//             timestamp:timestamp,
//             audited:false,
//         });
//         timestamp+=n*minute;
//     }
//     if(out.length==0){
//         out.push({
//             totalReserves:bigArray[bigArray.length-1].finalTotalReserves,
//             timestamp:timestamp-n*minute,
//             audited:false,
//         })
//     }
//     return out;
// }


function fillBigArrayForNMinutes(stakes,startTimestamp,endTime,minutes){
    let data=[]
    for(let beginTimestamp = startTimestamp, endTimestamp = startTimestamp + minutes*minute; beginTimestamp < endTime; beginTimestamp += minutes*minute, endTimestamp+=minutes*minute)
    {
      let obj = {
        timestamp: beginTimestamp,
        endTimestamp: endTimestamp,
        totalReserves:data.length>0?data[data.length-1].finalTotalReserves:0 ,
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