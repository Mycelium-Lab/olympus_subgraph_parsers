import axios from 'axios'
import { token } from '../config.js';
import {getWholePeriodOfTime} from '../utils/date.js'
import {getTokens} from '../tokens/getTokens.js'

const day =60*60*24;

const dayQuery =`
{
    manageYearEntities(first:1000 orderBy:timestamp){
     dayManage(first:365 orderBy:timestamp){
       
        id
        amount
        timestamp
        sender
        sumAmount
       
     }
   }
}
  `

export async function getManageByNDays(startTimestamp=0,endTimestamp=Date.now()/1000,n){
    try{
        let bigArray=await reformToBigArrayForDays(await getManageByDaysFromGraph());
     
        for(let i=0;i<bigArray.length;i++){
            bigArray[i].array=fillBigArrayForNDays( bigArray[i].array,startTimestamp,endTimestamp,n);
        }
        
        return bigArray;
    }
    catch(err)
    {
        console.log(err)
    }
}

async function getManageByDaysFromGraph(){
    try{
        const dayData = await axios({
            url: `https://api.thegraph.com/subgraphs/id/${token}`,
            method: 'post',
            data: {
              query: dayQuery
            }
          })
        return dayData.data.data.manageYearEntities;
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
async function reformToBigArrayForDays(days){
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
            for(let m=0;m<tokens.length;m++){
                if(days[i].dayManage[j].id.slice(0,42)==tokens[m]){
                    out[m].array.push(days[i].dayManage[j]);
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
function fillBigArrayForNDays(stakes,startTimestamp,endTime,days){
    let data=[]
    for(let beginTimestamp = startTimestamp, endTimestamp = startTimestamp + days*day; beginTimestamp < endTime; beginTimestamp += days*day, endTimestamp+=days*day)
    {
      let obj = {
        timestamp: beginTimestamp,
        endTimestamp: endTimestamp,
        amount: 0,
        sumAmount:data.length==0?0:data[data.length-1].sumAmount,
        sender:[]
      }
      for(let j = 0; j < stakes.length; ++j)
      {
        
        if(beginTimestamp <= stakes[j].timestamp && stakes[j].timestamp < endTimestamp)
        {
          obj.amount += Number(stakes[j].amount)
          obj.sumAmount = Number(stakes[j].sumAmount)
          obj.sender.concat(stakes[j].sender)
        }
      }
      data.push(obj)
    }
    return data
}