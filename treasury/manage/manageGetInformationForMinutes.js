import axios from 'axios'
import { token } from '../config.js';
import {getWholePeriodOfTime} from '../utils/date.js'
import {getTokens} from '../tokens/getTokens.js'


const minute =60;

const minuteQuery =`
{
    manageYearEntities(first:1000 orderBy:timestamp){
     dayManage(first:365 orderBy:timestamp){
       hourManage(first:24 orderBy:timestamp){
         minuteManage(first:60 orderBy:timestamp){
           id
           amount
           timestamp
           sender
           sumAmount
         }
       }
     }
   }
   }
   
  `

export async function getManageByMinut(startTimestamp=0,endTimestamp=Date.now()/1000){
    try{
        let bigArray=await reformToBigArrayForMinutes(await getManageByMinutesFromGraph());
        
        for(let i=0;i<bigArray.length;i++){
            bigArray[i].array=fillBigArrayForMinutes( bigArray[i].array,startTimestamp,endTimestamp);
        }
        
        return bigArray;
    }
    catch(err)
    {
        console.log(err)
    }
}


async function getManageByMinutesFromGraph(){
    try{
        const minuteData = await axios({
            url: `https://api.thegraph.com/subgraphs/id/${token}`,
            method: 'post',
            data: {
              query: minuteQuery
            }
          })
        return minuteData.data.data.manageYearEntities;
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
async function reformToBigArrayForMinutes(days){
    let out=[];
    let tokens=await getTokens();
    for(let i=0; i<tokens.length; i++){
        out.push({ 
            token:tokens[i],
            array:[]
        })
    }
    
    for(let i=0; i<days.length; i++){
        for(let j=0; j<days[i].dayManage.length; j++){
            for(let k=0; k<days[i].dayManage[j].hourManage.length; k++){
                for(let l=0; l<days[i].dayManage[j].hourManage[k].minuteManage.length;l++){
                    for(let m=0;m<tokens.length;m++){
                       if(days[i].dayManage[j].hourManage[k].minuteManage[l].id.slice(0,42)==tokens[m]){
                           out[m].array.push(days[i].dayManage[j].hourManage[k].minuteManage[l]);
                       }
                    }
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
    
    if(bigArray.length==0){
        return out;
    }
    if(bigArray.length==1){
        out.push({
            timestamp:bigArray[0].timestamp,
            amount:bigArray[0].amount,
            sender:bigArray[0].sender,
            sumAmount:bigArray[0].sumAmount,
        });
        return out;
    }
    while(bigArray.length>j&&bigArray[j].timestamp<startTimestamp) j++;
    if(j!=0&&bigArray[j-1].timestamp<startTimestamp){
        let timestamp =getWholePeriodOfTime(startTimestamp,minute);
        timestamp+=minute;
        while(timestamp<=endTimestamp){
            if (timestamp>endTimestamp) return out;

            if(timestamp>=startTimestamp){
                out.push({
                    timestamp:timestamp,
                    amount:0,
                    sender:[],
                    sumAmount:bigArray[bigArray.length-1].sumAmount,
                });
            }
            timestamp+=minute;
        }
        return out;
    }
    for(let i=j==0?1:j;i<bigArray.length;i++){
        let timestamp=getWholePeriodOfTime(parseInt(bigArray[i-1].timestamp),minute)
        let nextTimestamp=getWholePeriodOfTime(parseInt(bigArray[i].timestamp),minute)
        if (timestamp>endTimestamp) return out;
        if(timestamp>=startTimestamp){
            out.push({
                
                timestamp:timestamp,
                amount:bigArray[i-1].amount,
                sender:bigArray[i-1].sender,
                sumAmount:bigArray[i-1].sumAmount,
            });
        }
        timestamp+=minute;
        while(timestamp<nextTimestamp){
            if (timestamp>endTimestamp) return out;
                if(timestamp>=startTimestamp){
                out.push({
                timestamp:timestamp,
                amount:0,
                sender:[],
                sumAmount:bigArray[i-1].sumAmount,
                });
            }
            timestamp+=minute;
        }       
    }
    
    out.push({
        timestamp:getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),minute),
        amount:bigArray[bigArray.length-1].amount,
        sender:bigArray[bigArray.length-1].sender,
        sumAmount:bigArray[bigArray.length-1].sumAmount,
    })
    let timestamp =getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),minute);
    timestamp+=minute;
    while(timestamp<=endTimestamp){
        out.push({
            timestamp:timestamp,
            amount:0,
            sender:[],
            sumAmount:bigArray[bigArray.length-1].sumAmount,
        });
        timestamp+=minute;
    }
    return out;
}
