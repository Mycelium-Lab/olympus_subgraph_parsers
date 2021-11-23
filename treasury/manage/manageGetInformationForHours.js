import axios from 'axios'
import { token } from '../config.js';
import {getWholePeriodOfTime} from '../utils/date.js'
import {getTokens} from '../tokens/getTokens.js'

const hour =60*60;

const hourQuery =`
{
    manageYearEntities(first:1000 orderBy:timestamp){
     dayManage(first:365 orderBy:timestamp){
       hourManage(first:24 orderBy:timestamp){
       
           id
           amount
           timestamp
           sender
           sumAmount
        
       }
     }
   }
}
`


export async function getManageByNHours(startTimestamp=0,endTimestamp=Date.now()/1000,n){
    try{
        let bigArray=await reformToBigArrayForHours(await getManageByHoursFromGraph());
     
        for(let i=0;i<bigArray.length;i++){
            bigArray[i].array=fillBigArrayForNHours( bigArray[i].array,startTimestamp,endTimestamp,n);
        }
        
        return bigArray;
    }
    catch(err)
    {
        console.log(err)
    }
}


async function getManageByHoursFromGraph(){
    try{
        const hourData = await axios({
            url: `https://api.thegraph.com/subgraphs/id/${token}`,
            method: 'post',
            data: {
              query: hourQuery
            }
          })
          
        return hourData.data.data.manageYearEntities;
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
async function reformToBigArrayForHours(days){
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
                for(let m=0;m<tokens.length;m++){
                    
                    if(days[i].dayManage[j].hourManage[k].id.slice(0,42)==tokens[m]){
                        out[m].array.push(days[i].dayManage[j].hourManage[k]);
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
function fillBigArrayForNHours(stakes,startTimestamp,endTime,hours){
    let data=[]
    for(let beginTimestamp = startTimestamp, endTimestamp = startTimestamp + hours*3600; beginTimestamp < endTime; beginTimestamp += hours*3600, endTimestamp+=hours*3600)
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
