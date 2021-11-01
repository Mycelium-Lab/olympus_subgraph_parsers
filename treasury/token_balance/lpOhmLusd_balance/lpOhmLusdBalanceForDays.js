import axios from 'axios'
import { tokenForBalance } from '../../config.js';
import {getWholePeriodOfTime} from '../../utils/date.js'

const day =60*60*24;
const dayQuery =`
{
    balanceYears(first:1000 orderBy:timestamp where:{token:"0xfDf12D1F85b5082877A6E070524f50F6c84FAa6b"}){
      day(first:366 orderBy:timestamp) { 
        value
        id
        timestamp
      }
    }
  }
`


export async function getlpOhmLusdBalanceByDay(startTimestamp=0,endTimestamp=Date.now()/1000) {
    try{
        return fillBigArrayForDays(reformToBigArrayForDays( await getlpOhmLusdBalanceByDaysFromGraph()),startTimestamp,endTimestamp);
    }
    catch(err)
    {
        console.log(err)
    }
}

async function getlpOhmLusdBalanceByDaysFromGraph(){
    try{
        const dayData = await axios({
            url: `https://api.thegraph.com/subgraphs/id/${tokenForBalance}`,//QmRpuXnecL1xjHgUUMSBaeok9Ggkpdep9KJNMLJxSbDvxZ
            method: 'post',
            data: {
              query: dayQuery
            }
          })
        return dayData.data.data.balanceYears;
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
        for(let j=0; j<days[i].day.length; j++){         
            out.push(days[i].day[j]);
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
    while(bigArray.length>j&&bigArray[j].timestamp<startTimestamp) j++;
    if(j!=0&&bigArray[j-1].timestamp<startTimestamp){
        let timestamp =getWholePeriodOfTime(startTimestamp,day);
        timestamp+=day;
        while(timestamp<=endTimestamp){
            out.push({
                timestamp:timestamp,
                value:bigArray[bigArray.length-1].value,
            });
            timestamp+=day;
        }
        return out;
    }
    let out = [];
    for(let i=j==0?1:j;i<bigArray.length;i++){
        let timestamp=getWholePeriodOfTime(parseInt(bigArray[i-1].timestamp),day)
        let nextTimestamp=getWholePeriodOfTime(parseInt(bigArray[i].timestamp),day)
        if (timestamp>endTimestamp) return out;
        if(timestamp>=startTimestamp){
            out.push({
                value:bigArray[i-1].value,
                timestamp:timestamp,
                audited:bigArray[i-1].audited,
            });
        }
        timestamp+=day;
        if (timestamp>endTimestamp) return out;
        while(timestamp<nextTimestamp){
            if(timestamp>=startTimestamp){
                out.push({
                    value:bigArray[i-1].value,
                    timestamp:timestamp,
                    audited:false,
                });
            }

            timestamp+=day;
        if (timestamp>endTimestamp) return out;
        }
        
    }
    
    out.push({
        value:bigArray[bigArray.length-1].value,
        timestamp:getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),day),////?
        audited:bigArray[bigArray.length-1].audited,
    })
    let timestamp =getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),day);
    timestamp+=day;
    while(timestamp<=endTimestamp){
        out.push({
            value:bigArray[bigArray.length-1].value,
            timestamp:timestamp,
            audited:false,
        });
        timestamp+=day;
    }
    return out;
}