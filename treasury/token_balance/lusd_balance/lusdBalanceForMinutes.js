import axios from 'axios'
import { tokenForBalance } from '../../config.js';
import {getWholePeriodOfTime} from '../../utils/date.js'



const minute =60;

const minuteQuery =`
{
    balanceYears(first:1000 orderBy:timestamp where:{token:"0x5f98805A4E8be255a32880FDeC7F6728C6568bA0"}){
      day(first:366 orderBy:timestamp) {
        hour(first:24 orderBy:timestamp){
          minute(first:60 orderBy:timestamp){
            
              value
              id
              timestamp
            
          }
        }
      }
    }
  }

  `

export async function getLUSDBalanceByMinut(startTimestamp=0,endTimestamp=Date.now()/1000){
    try{
        return fillBigArrayForMinues(reformToBigArrayForMinutes(await getLUSDBalanceByMinutesFromGraph()),startTimestamp,endTimestamp)
    }
    catch(err)
    {
        console.log(err)
    }
}


async function getLUSDBalanceByMinutesFromGraph(){
    try{
        const minuteData = await axios({
            url: `https://api.thegraph.com/subgraphs/id/${tokenForBalance}`,
            method: 'post',
            data: {
              query: minuteQuery
            }
          })
        return minuteData.data.data.balanceYears;
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
        for(let j=0; j<days[i].day.length; j++){
            for(let k=0; k<days[i].day[j].hour.length; k++){
                for(let l=0; l<days[i].day[j].hour[k].minute.length;l++){
                    out.push(days[i].day[j].hour[k].minute[l]);
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
    console.log(bigArray)
    while(bigArray.length>j&&bigArray[j].timestamp<startTimestamp) j++;
    if(j!=0&&bigArray[j-1].timestamp<startTimestamp){
        let timestamp =getWholePeriodOfTime(startTimestamp,minute);
        timestamp+=minute;
        while(timestamp<=endTimestamp){
            out.push({
                timestamp:timestamp,
                value:bigArray[bigArray.length-1].value,
            });
            timestamp+=minute;
        }
        return out;
    }
    for(let i=j==0?1:j;i<bigArray.length;i++){
        let nextTimestamp=getWholePeriodOfTime(parseInt(bigArray[i].timestamp),minute)
        let timestamp=getWholePeriodOfTime(parseInt(bigArray[i-1].timestamp),minute)
        if (timestamp>endTimestamp) return out;
        if(timestamp>=startTimestamp){
            out.push({
                value:bigArray[i-1].value,
                timestamp:timestamp,
                audited:bigArray[i-1].audited,
            });
        }
        timestamp+=minute;
        if (timestamp>endTimestamp) return out;
        while(timestamp<nextTimestamp){
            if(timestamp>=startTimestamp){
            out.push({
                    value:bigArray[i-1].value,
                    timestamp:timestamp,
                    audited:false,
                });
            }
            timestamp+=minute;
            if (timestamp>endTimestamp) return out;
        }
        
    }

    out.push({
        value:bigArray[bigArray.length-1].value,
        timestamp:getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),minute),
        audited:bigArray[bigArray.length-1].audited,
    })
    let timestamp =getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),minute);
    timestamp+=minute;
    while(timestamp<=endTimestamp){
        out.push({
            value:bigArray[bigArray.length-1].value,
            timestamp:timestamp,
            audited:false,
        });
        timestamp+=minute;
    }
    return out;
}
