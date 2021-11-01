import axios from 'axios'
import { token } from '../config.js';
import {getWholePeriodOfTime} from '../utils/date.js'
import {getTokens} from '../tokens/getTokens.js'

const hour =60*60;

// graphql request for the Graph
const hourQuery =`
{
    depositFunctionYearEntities(first:1000 orderBy:timestamp){
     dayDeposit(first:366  orderBy:timestamp){
       hourDeposit(first:24  orderBy:timestamp){
           timestamp
           profit
           amount
           value
           sender
           sumValue
           sumProfit
           sumAmount
           id
       }
     }
     
   }
 }
  `

export async function getDepositByHour(startTimestamp=0,endTimestamp=Date.now()/1000){
    try{
        let bigArray=await reformToBigArrayForHour(await getDepositByHoursFromGraph());
     
        for(let i=0;i<bigArray.length;i++){
            bigArray[i].array=fillBigArrayForHours( bigArray[i].array,startTimestamp,endTimestamp);
        }
        
        return bigArray;
    }
    catch(err)
    {
        console.log(err)
    }
}

export async function getDepositBy4Hour(startTimestamp=0,endTimestamp=Date.now()/1000){
    try{
        let bigArray=await reformToBigArrayForHour(await getDepositByHoursFromGraph());
     
        for(let i=0;i<bigArray.length;i++){
            bigArray[i].array=fillBigArrayForNHours( bigArray[i].array,startTimestamp,endTimestamp,4);
        }
        
        return bigArray;
    }
    catch(err)
    {
        console.log(err)
    }
}

async function getDepositByHoursFromGraph(){
    try{
        const hourData = await axios({
            url: `https://api.thegraph.com/subgraphs/id/${token}`,
            method: 'post',
            data: {
              query: hourQuery
            }
          })
        return hourData.data.data.depositFunctionYearEntities;
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
async function reformToBigArrayForHour(days){
    let out=[];
    let tokens=await getTokens();
    for(let i=0; i<tokens.length; i++){
        out.push({ 
            token:tokens[i],
            array:[]
        })
    }
    
    for(let i=0; i<days.length; i++){
        for(let j=0; j<days[i].dayDeposit.length; j++){
            for(let k=0; k<days[i].dayDeposit[j].hourDeposit.length; k++){
                for(let m=0;m<tokens.length;m++){
                    if(days[i].dayDeposit[j].hourDeposit[k].id.slice(0,42)==tokens[m]){
                        out[m].array.push(days[i].dayDeposit[j].hourDeposit[k]);
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
function fillBigArrayForHours(bigArray,startTimestamp,endTimestamp){
    let out = [];
    let j=0;
    while(bigArray[j].timestamp<startTimestamp) j++;
    for(let i=j==0?1:j;i<bigArray.length;i++){
        let timestamp=getWholePeriodOfTime(parseInt(bigArray[i-1].timestamp),hour)
        let nextTimestamp=getWholePeriodOfTime(parseInt(bigArray[i].timestamp),hour)
        if (timestamp>endTimestamp) return out;

        if(timestamp>=startTimestamp){
            out.push({
                timestamp:timestamp,
                profit:bigArray[i-1].profit,
                amount:bigArray[i-1].amount,
                value:bigArray[i-1].value,
                sender:bigArray[i-1].sender,
                sumValue:bigArray[i-1].sumValue,
                sumProfit:bigArray[i-1].sumProfit,
                sumAmount:bigArray[i-1].sumAmount,
            });
        }
        timestamp+=hour;
        while(timestamp<nextTimestamp){
            if (timestamp>endTimestamp) return out;

            if(timestamp>=startTimestamp){
                out.push({
                    timestamp:timestamp,
                    profit:0,
                    amount:0,
                    value:0,
                    sender:[],
                    sumValue:bigArray[i-1].sumValue,
                    sumProfit:bigArray[i-1].sumProfit,
                    sumAmount:bigArray[i-1].sumAmount,
                });
            }
            timestamp+=hour;
        }       
    }
    
    out.push({
        timestamp:getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),hour),
        profit:bigArray[bigArray.length-1].profit,
        amount:bigArray[bigArray.length-1].amount,
        value:bigArray[bigArray.length-1].value,
        sender:bigArray[bigArray.length-1].sender,
        sumValue:bigArray[bigArray.length-1].sumValue,
        sumProfit:bigArray[bigArray.length-1].sumProfit,
        sumAmount:bigArray[bigArray.length-1].sumAmount,
    })
    let timestamp =getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),hour);
    timestamp+=hour;
    while(timestamp<=endTimestamp){
        if(timestamp>=startTimestamp){
            out.push({
                timestamp:timestamp,
                profit:0,
                amount:0,
                value:0,
                sender:[],
                sumValue:bigArray[bigArray.length-1].sumValue,
                sumProfit:bigArray[bigArray.length-1].sumProfit,
                sumAmount:bigArray[bigArray.length-1].sumAmount,
            });
        }
        timestamp+=hour;
    }
    return out;
}




/**
 * fills the array and divides it into equal time intervals
 * @param {*} bigArray  
 * @returns 
 */
// function fillBigArrayFor4Hours(bigArray,startTimestamp,endTimestamp){
//     let fragment=0;
//     let profit=0
//     let amount=0
//     let value=0
//     let sender=[]
//     let out = [];
//     let j=0;
//     while(bigArray.length>j&&bigArray[j].timestamp<startTimestamp) j++;
//     if(bigArray[0].timestamp>startTimestamp){
//         let timestamp =getWholePeriodOfTime(startTimestamp,4*hour);
//         while(timestamp<=bigArray[0].timestamp){
//             out.push({
//                 timestamp,
//                 profit:0,
//                 amount:0,
//                 value:0,
//                 sender:[],
//                 sumValue:0,
//                 sumProfit:0,
//                 sumAmount:0,
//             });
//             timestamp+=4*hour;
//         }
//     }
//     for(let i=j==0?1:j;i<bigArray.length;i++){
//         let timestamp=getWholePeriodOfTime(parseInt(bigArray[i-1].timestamp),hour)
//         if(timestamp==1633651200&&i==1){
//             console.log("timestamp")
//         }
//         let nextTimestamp=getWholePeriodOfTime(parseInt(bigArray[i].timestamp),hour)
//         profit+=bigArray[i-1].profit
//         if (timestamp>endTimestamp) return out;
//         amount+=bigArray[i-1].amount
//         value+=bigArray[i-1].value
//         sender=sender.concat(bigArray[i-1].sender)
//         if(out.length>0&&timestamp==out[out.length-1].timestamp){
//             out[out.length-1].profit+=profit;
//             out[out.length-1].value+=value;
//             out[out.length-1].amount+=amount;
//             out[out.length-1].sender.concat(sender);
//             out[out.length-1].sumValue=bigArray[i-1].sumValue;
//             out[out.length-1].sumProfit=bigArray[i-1].sumProfit;
//             out[out.length-1].sumAmount=bigArray[i-1].sumAmount;
//             profit=0
//             amount=0
//             value=0
//             sender=[]
//             continue;
//         }
//          if(timestamp>=startTimestamp){
//             if(timestamp%(4*hour)==0)
//             {
//                 out.push({
//                     timestamp:timestamp,
//                     profit:profit,
//                     amount:amount,
//                     value:value,
//                     sender:sender,
//                     sumValue:bigArray[i-1].sumValue,
//                     sumProfit:bigArray[i-1].sumProfit,
//                     sumAmount:bigArray[i-1].sumAmount,
//                 });
//                 profit=0
//                 amount=0
//                 value=0
//                 sender=[]
//             }
//         }
//         fragment++;
//         timestamp+=hour;
//         if (timestamp>endTimestamp) return out;
//         while(timestamp<nextTimestamp){
//             if(timestamp>=startTimestamp){
//                 if(timestamp%(4*hour)==0)
//                 {
//                     if(out.length>0&&timestamp==out[out.length-1].timestamp){
//                         out[out.length-1].profit+=profit;
//                         out[out.length-1].value+=value;
//                         out[out.length-1].amount+=amount;
//                         out[out.length-1].sender.concat(sender);
//                         out[out.length-1].sumValue=bigArray[i-1].sumValue;
//                         out[out.length-1].sumProfit=bigArray[i-1].sumProfit;
//                         out[out.length-1].sumAmount=bigArray[i-1].sumAmount;
//                         profit=0
//                         amount=0
//                         value=0
//                         sender=[]
//                         timestamp+=hour;
//                         continue;
//                     }
                   
//                     out.push({
//                         timestamp:timestamp,
//                         profit:profit,
//                         amount:amount,
//                         value:value,
//                         sender:sender,
//                         sumValue:bigArray[i-1].sumValue,
//                         sumProfit:bigArray[i-1].sumProfit,
//                         sumAmount:bigArray[i-1].sumAmount,
//                     });
//                     profit=0
//                     amount=0
//                     value=0
//                     sender=[]
//                 }
//             }
//             fragment++;
//             timestamp+=hour;
//         if (timestamp>endTimestamp) return out;

//         }
        
//     }

//     if(out.length>0&&getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),4*hour)==out[out.length-1].timestamp){
//         out[out.length-1].profit+=profit+bigArray[bigArray.length-1].profit;
//         out[out.length-1].value+=value+bigArray[bigArray.length-1].value;
//         out[out.length-1].amount+=amount+bigArray[bigArray.length-1].amount;
//         out[out.length-1].sender.concat(sender).concat(+bigArray[bigArray.length-1].sender);
//         out[out.length-1].sumValue=bigArray[bigArray.length-1].sumValue;
//         out[out.length-1].sumProfit=bigArray[bigArray.length-1].sumProfit;
//         out[out.length-1].sumAmount=bigArray[bigArray.length-1].sumAmount;
//         profit=0
//         amount=0
//         value=0
//         sender=[]
        
//     }else{
//         out.push({
//             timestamp:getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),4*hour),
//             profit:bigArray[bigArray.length-1].profit,
//             amount:bigArray[bigArray.length-1].amount,
//             value:bigArray[bigArray.length-1].value,
//             sender:bigArray[bigArray.length-1].sender,
//             sumValue:bigArray[bigArray.length-1].sumValue,
//             sumProfit:bigArray[bigArray.length-1].sumProfit,
//             sumAmount:bigArray[bigArray.length-1].sumAmount,
//         })
//     }
//     let timestamp =getWholePeriodOfTime(parseInt(bigArray[bigArray.length-1].timestamp),4*hour);
//     timestamp+=4*hour;
//     while(timestamp<=endTimestamp){
//         out.push({
//             timestamp:timestamp,
//             profit:0,
//             amount:0,
//             value:0,
//             sender:[],
//             sumValue:bigArray[bigArray.length-1].sumValue,
//             sumProfit:bigArray[bigArray.length-1].sumProfit,
//             sumAmount:bigArray[bigArray.length-1].sumAmount,
//         });
//         timestamp+=4*hour;
//     }
//     return out;
// }

function fillBigArrayForNHours(stakes,startTimestamp,endTime,hours){
    let data=[]
    for(let beginTimestamp = startTimestamp, endTimestamp = startTimestamp + hours*3600; beginTimestamp < endTime; beginTimestamp += hours*3600, endTimestamp+=hours*3600)
    {
      let obj = {
        timestamp: beginTimestamp,
        endTimestamp: endTimestamp,
        amount: 0,
        profit: 0,
        value: 0,
        sumAmount:data.length==0?0:data[data.length-1].sumAmount,
        sumProfit:data.length==0?0:data[data.length-1].sumProfit,
        sumValue:data.length==0?0:data[data.length-1].sumValue,
        sender:[]
      }
      for(let j = 0; j < stakes.length; ++j)
      {
        
        if(beginTimestamp <= stakes[j].timestamp && stakes[j].timestamp < endTimestamp)
        {
          obj.amount += Number(stakes[j].amount)
          obj.profit += Number(stakes[j].profit)
          obj.value += Number(stakes[j].value)
          obj.sumValue = Number(stakes[j].sumValue)
          obj.sumProfit = Number(stakes[j].sumProfit)
          obj.sumAmount = Number(stakes[j].sumAmount)
          obj.sender.concat(stakes[j].sender)
        }
      }
      data.push(obj)
    }
    return data
}