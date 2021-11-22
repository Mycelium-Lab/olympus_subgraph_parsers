import axios from 'axios'
import { tokenForBalance } from '../../config.js';
import {getWholePeriodOfTime} from '../../utils/date.js'


const hour =60*60;
const hourQuery =`
{
    balanceYears(first:1000 orderBy:timestamp where:{token:"0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"}){
      day(first:366 orderBy:timestamp) {
        hour(first:24 orderBy:timestamp){
          
            
              value
              id
              timestamp
            
          
        }
      }
    }
  }
`


export async function getWETHBalanceByHour(startTimestamp=0,endTimestamp=Date.now()/1000){
    try{
       
       
        return fillBigArrayForHours(reformToBigArrayForHours( await getWETHBalanceByHoursFromGraph()),startTimestamp,endTimestamp);
    }
    catch(err)
    {
        console.log(err)
    }
}
export async function getWETHBalanceBy4Hour(startTimestamp=0,endTimestamp=Date.now()/1000){
    try{

        return fillBigArrayFor4Hours(reformToBigArrayForHours( await getWETHBalanceByHoursFromGraph()),startTimestamp,endTimestamp);
    }
    catch(err)
    {
        console.log(err)
    }
}

async function getWETHBalanceByHoursFromGraph(){
    try{
        const hourData = await axios({
            url: `https://api.thegraph.com/subgraphs/id/${tokenForBalance}`,
            method: 'post',
            data: {
              query: hourQuery
            }
          })
        return hourData.data.data.balanceYears;
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
        for(let j=0; j<days[i].day.length; j++){
            for(let k=0; k<days[i].day[j].hour.length; k++){
                out.push(days[i].day[j].hour[k]);
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
    while(bigArray.length>j&&bigArray[j].timestamp<startTimestamp) j++;
    if(j!=0&&bigArray[j-1].timestamp<startTimestamp){
        let timestamp =getWholePeriodOfTime(startTimestamp,hour);
        timestamp+=hour;
        while(timestamp<=endTimestamp){
            out.push({
                timestamp:timestamp,
                value:bigArray[bigArray.length-1].value,
            });
            timestamp+=hour;
        }
        return out;
    }
    for(let i=j==0?1:j;i<bigArray.length;i++){
        let nextTimestamp=getWholePeriodOfTime(parseInt(bigArray[i].timestamp),hour)
        let timestamp=getWholePeriodOfTime(parseInt(bigArray[i-1].timestamp),hour)
        if (timestamp>endTimestamp) return out;
        if(timestamp>=startTimestamp){
            out.push({
                value:bigArray[i-1].value,
                timestamp:timestamp,
                audited:bigArray[i-1].audited,
            });
        }
        timestamp+=hour;
        if (timestamp>endTimestamp) return out;
        while(timestamp<nextTimestamp){
            if(timestamp>=startTimestamp){
                out.push({
                    value:bigArray[i-1].value,
                    timestamp:timestamp,
                    audited:false,
                });
            }
            timestamp+=hour;
            if (timestamp>endTimestamp) return out;
        }        
    }
    
    out.push({
        value:bigArray[bigArray.length-1].value,
        timestamp:getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),hour),
        audited:bigArray[bigArray.length-1].audited,
    })
    let timestamp =getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),hour);
    timestamp+=hour;
    while(timestamp<=endTimestamp){
        out.push({
            value:bigArray[bigArray.length-1].value,
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
function fillBigArrayFor4Hours(bigArray,startTimestamp,endTimestamp){
    let out = [];
    let j=0;
    while(bigArray.length>j&&bigArray[j].timestamp<startTimestamp) j++;
    if(j!=0&&bigArray[j-1].timestamp<startTimestamp){
        let timestamp =getWholePeriodOfTime(startTimestamp,4*hour);
        timestamp+=4*hour;
        while(timestamp<=endTimestamp){
            out.push({
                timestamp:timestamp,
                value:bigArray[bigArray.length-1-1].value,
            });
            timestamp+=4*hour;
        }
        return out;
    }
    for(let i=j==0?1:j;i<bigArray.length;i++){
        let nextTimestamp=getWholePeriodOfTime(parseInt(bigArray[i].timestamp),4*hour)
        let timestamp=getWholePeriodOfTime(parseInt(bigArray[i-1].timestamp),4*hour)
        if (timestamp>endTimestamp) return out;
        if(timestamp>=startTimestamp){
            if(out.length!=0&&out[out.length-1].timestamp==timestamp){
                out[out.length-1].audited= out[out.length-1].audited?true:bigArray[i-1].audited;
                out[out.length-1].value=bigArray[i-1].value;
            }
            else{
                out.push({
                    value:bigArray[i-1].value,
                    timestamp:timestamp,
                    audited:bigArray[i-1].audited,
                });
            }
        }
        timestamp+=4*hour;
        if (timestamp>endTimestamp) return out;
        while(timestamp<nextTimestamp){
            if(timestamp>=startTimestamp){
                if(out.length!=0&&out[out.length-1].timestamp==timestamp){
                    out[out.length-1].audited= out[out.length-1].audited?true:bigArray[i-1].audited;
                    out[out.length-1].value=bigArray[i-1].value;
                }
                else{
                    out.push({
                        value:bigArray[i-1].value,
                        timestamp:timestamp,
                        audited:false,
                    });
                }
            }
            timestamp+=4*hour;
            if (timestamp>endTimestamp) return out;
        }        
    }
    
    out.push({
        value:bigArray[bigArray.length-1].value,
        timestamp:getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),4*hour),
        audited:bigArray[bigArray.length-1].audited,
    })
    let timestamp =getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),4*hour);
    timestamp+=4*hour;
    while(timestamp<=endTimestamp){
        out.push({
            value:bigArray[bigArray.length-1].value,
            timestamp:timestamp,
            audited:false,
        });
        timestamp+=4*hour;
    }
    return out;
}