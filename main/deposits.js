import axios from 'axios'
/**

    * @dev : Get deposits (days)
    * @param startTimestamp - Start timestamp for query 
    * @param endTime - End timestamp for query

*/
export async function getDepositsInfoDays(startTimestamp, endTime)
{
    let depositQuery = `
    {
        depositYearDaiEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"DAI"}) {
          
          dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
            
            id
            amount
            depositCount
            timestamp
            redeemCount
            payout
            initBCV
            newBCV
            adjustment
          }
        }
        depositYearETHEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"WETH"}) {
          
          dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
            
            id
            amount
            depositCount
            timestamp
            redeemCount
            payout
            initBCV
            newBCV
            adjustment
          }
        }
        depositYearFraxEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"FRAX"}) {
          
          dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
            
            id
                  amount
                  depositCount
                  timestamp
                  redeemCount
                  payout
                  initBCV
            newBCV
            adjustment
          }
        }
        
        depositYearLusdEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"LUSD"}) {
          
          dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
            
            id
                  amount
                  depositCount
                  timestamp
                  redeemCount
                  payout
                  initBCV
            newBCV
            adjustment
          }
        }
        
        depositYearOHMDAIEntities:depositYearEntities(first: 100 orderBy:timestamp where:{token:"OHM-DAI"}) {
          
          dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
            
            id
            amount
            depositCount
            timestamp
            redeemCount
            payout
            initBCV
            newBCV
            adjustment
          }
        }
        
        depositYearOHMFRAXEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"OHM-FRAX"}) {
          
          dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
            
            id
            amount
            depositCount
            timestamp
            redeemCount
            payout
            initBCV
            newBCV
            adjustment
          }
        }
        depositYearOHMLUSDEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"OHM-LUSD"}) {
          
            dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
              
                id
                amount
                depositCount
                timestamp
                redeemCount
                payout
                initBCV
                newBCV
                adjustment
            }
          }
  
      }

    `

    try
    {
        const depositData = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
            method: 'post',
            data: {
              query: depositQuery
            }
        }) 
        const daiDeposits = depositData.data.data.depositYearDaiEntities
        const ethDeposits = depositData.data.data.depositYearETHEntities
        const fraxDeposits = depositData.data.data.depositYearFraxEntities
        const lusdDeposits = depositData.data.data.depositYearLusdEntities
        const ohmDaiDeposits = depositData.data.data.depositYearOHMDAIEntities
        const ohmFraxDeposits = depositData.data.data.depositYearOHMFRAXEntities
        const ohmLusdDeposits = depositData.data.data.depositYearOHMLUSDEntities
        let data = []
        for(let beginTimestamp = startTimestamp, endTimestamp = startTimestamp + 86400; beginTimestamp < endTime; beginTimestamp += 86400, endTimestamp+=86400)
        {
            
            let obj = {
                amountDai: 0,
                amountEth: 0,
                amountFrax: 0,
                amountLusd: 0,
                amountOhmDai: 0,
                amountOhmFrax: 0,
                amountOhmLusd: 0,
                amountDaiAvg: 0,
                amountEthAvg: 0,
                amountLusdAvg: 0,
                amountFraxAvg: 0,
                amountOhmDaiAvg: 0,
                amountOhmFraxAvg:0,
                amountOhmLusdAvg: 0,
                payoutDai: 0,
                payoutEth: 0,
                payoutFrax: 0,
                payoutLusd: 0,
                payoutOhmDai: 0,
                payoutOhmFrax: 0,
                payoutOhmLusd: 0,
                depositCountDai: 0,
                depositCountEth: 0,
                depositCountLusd: 0,
                depositCountFrax: 0,
                depositCountOhmDai: 0,
                depositCountOhmFrax: 0,
                depositCountOhmLusd: 0,
                redeemCountDai: 0,
                redeemCountLusd: 0,
                redeemCountEth: 0,
                redeemCountFrax: 0,
                redeemCountOhmDai: 0,
                redeemCountOhmFrax: 0,
                redeemCountOhmLusd: 0,
                initBCVDai: 0,
                newBCVDai: 0,
                adjustmentDai: 0,
                initBCVEth: 0,
                newBCVEth: 0,
                adjustmentEth: 0,
                initBCVFrax: 0,
                newBCVFrax: 0,
                adjustmentFrax: 0,
                initBCVLusd: 0,
                newBCVLusd: 0,
                adjustmentLusd: 0,
                initBCVOhmDai: 0,
                newBCVOhmDai: 0,
                adjustmentOhmDai: 0,
                initBCVOhmFrax: 0,
                newBCVOhmFrax: 0,
                adjustmentOhmFrax: 0,
                initBCVOhmLusd: 0,
                newBCVOhmLusd: 0,
                adjustmentOhmLusd: 0,
                beginTimestamp: beginTimestamp,
                endTimestamp: endTimestamp
            }
            if(daiDeposits.length != 0)
            {
                for(let k = 0; k < daiDeposits.length; ++k)
                {
                    for(let j = 0; j < daiDeposits[k].dayDeposit.length; ++j)
                    {
                        if(beginTimestamp <= daiDeposits[k].dayDeposit[j].timestamp && daiDeposits[k].dayDeposit[j].timestamp < endTimestamp )
                        {
                            obj.initBCVDai = daiDeposits[k].dayDeposit[j].initBCV
                            obj.newBCVDai = daiDeposits[k].dayDeposit[j].newBCV
                            obj.adjustmentDai = daiDeposits[k].dayDeposit[j].adjustment
                            obj.amountDai = daiDeposits[k].dayDeposit[j].amount
                            obj.depositCountDai = daiDeposits[k].dayDeposit[j].depositCount
                            obj.redeemCountDai = daiDeposits[k].dayDeposit[j].redeemCount
                            obj.payoutDai = daiDeposits[k].dayDeposit[j].payout
                            if(daiDeposits[k].dayDeposit[j].depositCount != 0)
                            {
                                obj.amountDaiAvg = daiDeposits[k].dayDeposit[j].amount/ daiDeposits[k].dayDeposit[j].depositCount
                            }
                        }
                    
                    }
                }
                
            }
            
            if(ethDeposits.length != 0)
            {
                for(let k = 0; k < ethDeposits.length; ++k)
                {
                    for(let j = 0; j < ethDeposits[k].dayDeposit.length; ++j)
                    {
                        if(beginTimestamp <= ethDeposits[k].dayDeposit[j].timestamp && ethDeposits[0].dayDeposit[j].timestamp < endTimestamp )
                        {
                            obj.initBCVEth = ethDeposits[k].dayDeposit[j].initBCV
                            obj.newBCVEth = ethDeposits[k].dayDeposit[j].newBCV
                            obj.adjustmentEth = ethDeposits[k].dayDeposit[j].adjustment

                            obj.amountEth = ethDeposits[k].dayDeposit[j].amount
                            obj.depositCountEth = ethDeposits[k].dayDeposit[j].depositCount
                            obj.redeemCountEth = ethDeposits[k].dayDeposit[j].redeemCount
                            obj.payoutEth = ethDeposits[k].dayDeposit[j].payout
                            if(ethDeposits[k].dayDeposit[j].depositCount != 0)
                            {
                                obj.amountEthAvg = ethDeposits[k].dayDeposit[j].amount/ ethDeposits[k].dayDeposit[j].depositCount
                            }
                        }
                    
                    }
                }
                
            }
            if(fraxDeposits.length != 0)
            {
                for(let k = 0; k < fraxDeposits.length; ++k)
                {
                    for(let j = 0; j < fraxDeposits[k].dayDeposit.length; ++j)
                    {
                        if(beginTimestamp <= fraxDeposits[k].dayDeposit[j].timestamp && fraxDeposits[k].dayDeposit[j].timestamp < endTimestamp )
                        {
                            obj.initBCVFrax = fraxDeposits[k].dayDeposit[j].initBCV
                            obj.newBCVFrax = fraxDeposits[k].dayDeposit[j].newBCV
                            obj.adjustmentFrax = fraxDeposits[k].dayDeposit[j].adjustment

                            obj.amountFrax = fraxDeposits[k].dayDeposit[j].amount
                            obj.depositCountFrax = fraxDeposits[k].dayDeposit[j].depositCount
                            obj.redeemCountFrax = fraxDeposits[k].dayDeposit[j].redeemCount
                            obj.payoutFrax = fraxDeposits[k].dayDeposit[j].payout
                            if(fraxDeposits[0].dayDeposit[j].depositCount != 0)
                            {
                                obj.amountFraxAvg = fraxDeposits[k].dayDeposit[j].amount/ fraxDeposits[k].dayDeposit[j].depositCount
                            }
                        }
                    }
                }
            }
            
            if(lusdDeposits.length != 0)
            {
                for(let k = 0; k < lusdDeposits.length; ++k)
                {
                    for(let j = 0; j < lusdDeposits[k].dayDeposit.length; ++j)
                    {
                        if(beginTimestamp <= lusdDeposits[k].dayDeposit[j].timestamp && lusdDeposits[k].dayDeposit[j].timestamp < endTimestamp )
                        {
                            obj.initBCVLusd = lusdDeposits[k].dayDeposit[j].initBCV
                            obj.newBCVLusd = lusdDeposits[k].dayDeposit[j].newBCV
                            obj.adjustmentLusd = lusdDeposits[k].dayDeposit[j].adjustment

                            obj.amountLusd = lusdDeposits[k].dayDeposit[j].amount
                            obj.depositCountLusd = lusdDeposits[k].dayDeposit[j].depositCount
                            obj.redeemCountLusd = lusdDeposits[k].dayDeposit[j].redeemCount
                            obj.payoutLusd = lusdDeposits[k].dayDeposit[j].payout
                            if(lusdDeposits[k].dayDeposit[j].depositCount != 0)
                            {
                                obj.amountLusdAvg = lusdDeposits[k].dayDeposit[j].amount/ lusdDeposits[k].dayDeposit[j].depositCount
                            }
                        }
                    }
                }
            }
            if(ohmDaiDeposits.length != 0 )
            {
                for(let k = 0; k < ohmDaiDeposits.length; ++k)
                {
                    for(let j = 0; j < ohmDaiDeposits[k].dayDeposit.length; ++j)
                    {
                        if(beginTimestamp <= ohmDaiDeposits[k].dayDeposit[j].timestamp && ohmDaiDeposits[k].dayDeposit[j].timestamp < endTimestamp )
                        {
                            obj.initBCVOhmDai = ohmDaiDeposits[k].dayDeposit[j].initBCV
                            obj.newBCVOhmDai = ohmDaiDeposits[k].dayDeposit[j].newBCV
                            obj.adjustmentOhmDai = ohmDaiDeposits[k].dayDeposit[j].adjustment

                            obj.amountOhmDai = ohmDaiDeposits[k].dayDeposit[j].amount
                            obj.depositCountOhmDai = ohmDaiDeposits[k].dayDeposit[j].depositCount
                            obj.redeemCountOhmDai = ohmDaiDeposits[k].dayDeposit[j].redeemCount
                            obj.payoutOhmDai = ohmDaiDeposits[k].dayDeposit[j].payout
                            if(ohmDaiDeposits[k].dayDeposit[j].depositCount != 0)
                            {
                                obj.amountOhmDaidAvg = ohmDaiDeposits[k].dayDeposit[j].amount/ ohmDaiDeposits[k].dayDeposit[j].depositCount
                            }
                        }
                    }
                }
                
            }
            
            if(ohmFraxDeposits.length != 0)
            {
                for(let k = 0; k < ohmFraxDeposits.length; ++k)
                {
                    for(let j = 0; j < ohmFraxDeposits[k].dayDeposit.length; ++j)
                    {
                        if(beginTimestamp <= ohmFraxDeposits[k].dayDeposit[j].timestamp && ohmFraxDeposits[k].dayDeposit[j].timestamp < endTimestamp )
                        {
                            obj.initBCVOhmFrax = ohmFraxDeposits[k].dayDeposit[j].initBCV
                            obj.newBCVOhmFrax = ohmFraxDeposits[k].dayDeposit[j].newBCV
                            obj.adjustmentOhmFrax = ohmFraxDeposits[k].dayDeposit[j].adjustment

                            obj.amountOhmFrax = ohmFraxDeposits[k].dayDeposit[j].amount
                            obj.depositCountOhmFrax = ohmFraxDeposits[k].dayDeposit[j].depositCount
                            obj.redeemCountOhmFrax = ohmFraxDeposits[k].dayDeposit[j].redeemCount
                            obj.payoutOhmFrax = ohmFraxDeposits[k].dayDeposit[j].payout
                            if(ohmFraxDeposits[k].dayDeposit[j].depositCount != 0)
                            {
                                obj.amountOhmFraxAvg = ohmFraxDeposits[k].dayDeposit[j].amount/ ohmFraxDeposits[k].dayDeposit[j].depositCount
                            }
                        }
                    }
                }
                
            }
            
            if(ohmLusdDeposits.length != 0)
            {
                for(let k = 0; k < ohmLusdDeposits.length; ++k)
                {
                    for(let j = 0; j < ohmLusdDeposits[k].dayDeposit.length; ++j)
                    {
                        if(beginTimestamp <= ohmLusdDeposits[k].dayDeposit[j].timestamp && ohmLusdDeposits[k].dayDeposit[j].timestamp < endTimestamp )
                        {
                            obj.initBCVOhmLusd = ohmLusdDeposits[k].dayDeposit[j].initBCV
                            obj.newBCVOhmLusd = ohmLusdDeposits[k].dayDeposit[j].newBCV
                            obj.adjustmentOhmLusd = ohmLusdDeposits[k].dayDeposit[j].adjustment

                            obj.amountOhmLusd = ohmLusdDeposits[k].dayDeposit[j].amount
                            obj.depositCountOhmLusd = ohmLusdDeposits[k].dayDeposit[j].depositCount
                            obj.redeemCountOhmLusd = ohmLusdDeposits[k].dayDeposit[j].redeemCount
                            obj.payoutOhmLusd = ohmLusdDeposits[k].dayDeposit[j].payout
                            if(ohmLusdDeposits[k].dayDeposit[j].depositCount != 0)
                            {
                                obj.amountOhmLusdAvg = ohmLusdDeposits[k].dayDeposit[j].amount/ ohmLusdDeposits[k].dayDeposit[j].depositCount
                            }
                        }
                    }
                }
                
            }
            data.push(obj)
        }
        return data
    }
    catch(err)
    {
        console.log(err)
    }

}

/**
    * @dev : Get deposits (N days)
    * @param startTimestamp - Start timestamp for query 
    * @param endTime - End timestamp for query
    * @param days - Number of days
*/
export async function getDepositsInfoNDays(startTimestamp, endTime, days)
{
    let depositQuery = `
    {
        depositYearDaiEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"DAI"}) {
          
          dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
            
            id
            amount
            timestamp
            depositCount
            redeemCount
            payout
            initBCV
            newBCV
            adjustment

          }
        }
        depositYearETHEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"WETH"}) {
          
            dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
                
                id
                amount
                timestamp
                depositCount
                redeemCount
                payout
                initBCV
                newBCV
                adjustment

            }
          }
          depositYearFraxEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"FRAX"}) {
          
            dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
                
                id
                amount
                timestamp
                depositCount
                redeemCount
                payout
                initBCV
                newBCV
                adjustment

            }
          }
          depositYearLusdEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"LUSD"}) {
          
            dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
                
                id
                amount
                timestamp
                depositCount
                redeemCount
                payout
                initBCV
                newBCV
                adjustment

            }
          }
          depositYearOHMDAIEntities:depositYearEntities(first: 100 orderBy:timestamp where:{token:"OHM-DAI"}) {
          
            dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
                
                id
                amount
                timestamp
                depositCount
                redeemCount
                payout
                initBCV
                newBCV
                adjustment

            }
          }
          depositYearOHMFRAXEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"OHM-FRAX"}) {
          
            dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
                
                id
                amount
                timestamp
                depositCount
                redeemCount
                payout
                initBCV
                newBCV
                adjustment

            }
          }
          depositYearOHMLUSDEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"OHM-LUSD"}) {
          
            dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
                
                id
                amount
                timestamp
                depositCount
                redeemCount
                payout
                initBCV
                newBCV
                adjustment

            }
          }
      }
    
    `
    try{
        const depositData = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
            method: 'post',
            data: {
              query: depositQuery
            }
        }) 
        const daiDeposits = depositData.data.data.depositYearDaiEntities
        const ethDeposits = depositData.data.data.depositYearETHEntities
        const fraxDeposits = depositData.data.data.depositYearFraxEntities
        const lusdDeposits = depositData.data.data.depositYearLusdEntities
        const ohmDaiDeposits = depositData.data.data.depositYearOHMDAIEntities
        const ohmFraxDeposits = depositData.data.data.depositYearOHMFRAXEntities
        const ohmLusdDeposits = depositData.data.data.depositYearOHMLUSDEntities
        let data = []
        
        let daiArray = []
        let ethArray = []
        let fraxArray = []
        let lusdArray = []
        let ohmDaiArray = []
        let ohmFraxArray = []
        let ohmLusdArray = []

        if(daiDeposits.length != 0)
        {
            for(let c = 0; c < daiDeposits.length; ++c)
            {
                for(let i = 0; i < daiDeposits[0].dayDeposit.length; ++i)
                {    
                    let obj = {}
                    obj.adjustment = daiDeposits[c].dayDeposit[i].adjustment
                    obj.initBCV = daiDeposits[c].dayDeposit[i].initBCV
                    obj.newBCV = daiDeposits[c].dayDeposit[i].newBCV
                    obj.amountDai = daiDeposits[c].dayDeposit[i].amount
                    obj.payoutDai = daiDeposits[c].dayDeposit[i].payout
                    obj.depositCountDai = daiDeposits[c].dayDeposit[i].depositCount
                    obj.redeemCountDai = daiDeposits[c].dayDeposit[i].redeemCount
                    obj.timestamp = daiDeposits[c].dayDeposit[i].timestamp
                    daiArray.push(obj)
                    
                }
            }
        }
        
        if(ethDeposits.length != 0)
        {
            for(let c = 0; c < ethDeposits.length; ++c)
            {
                for(let i = 0; i < ethDeposits[c].dayDeposit.length; ++i)
                {
                    
                        let obj = {}
                        obj.adjustment = ethDeposits[c].dayDeposit[i].adjustment
                        obj.initBCV = ethDeposits[c].dayDeposit[i].initBCV
                        obj.newBCV = ethDeposits[c].dayDeposit[i].newBCV

                        obj.amountEth = ethDeposits[c].dayDeposit[i].amount
                        obj.payoutEth = ethDeposits[c].dayDeposit[i].payout
                        obj.depositCountEth = ethDeposits[c].dayDeposit[i].depositCount
                        obj.redeemCountEth = ethDeposits[c].dayDeposit[i].redeemCount
                        obj.timestamp = ethDeposits[c].dayDeposit[i].timestamp
                        ethArray.push(obj)
                    
                }
            }
            
        }

        if(fraxDeposits.length != 0)
        {
            for(let c = 0; c < fraxDeposits.length; ++c)
            {
                for(let i = 0; i < fraxDeposits[c].dayDeposit.length; ++i)
                {
                    let obj = {}
                    obj.adjustment = fraxDeposits[c].dayDeposit[i].adjustment
                    obj.initBCV = fraxDeposits[c].dayDeposit[i].initBCV
                    obj.newBCV = fraxDeposits[c].dayDeposit[i].newBCV
                    obj.amountFrax = fraxDeposits[c].dayDeposit[i].amount
                    obj.payoutFrax = fraxDeposits[c].dayDeposit[i].payout
                    obj.depositCountFrax = fraxDeposits[c].dayDeposit[i].depositCount
                    obj.redeemCountFrax = fraxDeposits[c].dayDeposit[i].redeemCount
                    obj.timestamp = fraxDeposits[c].dayDeposit[i].timestamp
                    fraxArray.push(obj)
                }
            } 
        }
        
        if(lusdDeposits.length != 0)
        {
            for(let c = 0; c < lusdDeposits.length; ++c)
            {
                for(let i = 0; i < lusdDeposits[c].dayDeposit.length; ++i)
                {
                    let obj = {}
                    obj.adjustment = lusdDeposits[c].dayDeposit[i].adjustment
                    obj.initBCV = lusdDeposits[c].dayDeposit[i].initBCV
                    obj.newBCV = lusdDeposits[c].dayDeposit[i].newBCV
                    obj.amountLusd = lusdDeposits[c].dayDeposit[i].amount
                    obj.payoutLusd = lusdDeposits[c].dayDeposit[i].payout
                    obj.depositCountLusd = lusdDeposits[c].dayDeposit[i].depositCount
                    obj.redeemCountLusd = lusdDeposits[c].dayDeposit[i].redeemCount
                    obj.timestamp = lusdDeposits[c].dayDeposit[i].timestamp
                    lusdArray.push(obj)
                }
            }
            
        }
        
        if(ohmFraxDeposits.length != 0)
        {
            for(let c = 0; c < ohmDaiDeposits.length; ++c)
            {
                for(let i = 0; i < ohmDaiDeposits[c].dayDeposit.length; ++i)
                {
                    
                    let obj = {}
                    obj.adjustment = ohmDaiDeposits[c].dayDeposit[i].adjustment
                    obj.initBCV = ohmDaiDeposits[c].dayDeposit[i].initBCV
                    obj.newBCV = ohmDaiDeposits[c].dayDeposit[i].newBCV
                    obj.amountOhmDai = ohmDaiDeposits[c].dayDeposit[i].amount
                    obj.payoutOhmDai = ohmDaiDeposits[c].dayDeposit[i].payout
                    obj.depositCountOhmDai = ohmDaiDeposits[c].dayDeposit[i].depositCount
                    obj.redeemCountOhmDai = ohmDaiDeposits[c].dayDeposit[i].redeemCount
                    obj.timestamp = ohmDaiDeposits[c].dayDeposit[i].timestamp
                    ohmDaiArray.push(obj)
                }    
            }
        }
        
        if(ohmFraxDeposits.length != 0)
        {
            for(let c = 0; c < ohmFraxDeposits.length; ++c)
            {
                for(let i = 0; i < ohmFraxDeposits[c].dayDeposit.length; ++i)
                {

                    let obj = {}
                    obj.adjustment = ohmFraxDeposits[c].dayDeposit[i].adjustment
                    obj.initBCV = ohmFraxDeposits[c].dayDeposit[i].initBCV
                    obj.newBCV = ohmFraxDeposits[c].dayDeposit[i].newBCV
                    obj.amountOhmFrax = ohmFraxDeposits[c].dayDeposit[i].amount
                    obj.payoutOhmFrax = ohmFraxDeposits[c].dayDeposit[i].payout
                    obj.depositCountOhmFrax = ohmFraxDeposits[c].dayDeposit[i].depositCount
                    obj.redeemCountOhmFrax = ohmFraxDeposits[c].dayDeposit[i].redeemCount
                    obj.timestamp = ohmFraxDeposits[c].dayDeposit[i].timestamp
                    ohmFraxArray.push(obj)
                    
                }    
            }
        }

        if(ohmLusdDeposits.length != 0)
        {
            for(let c = 0; c < ohmLusdDeposits.length; ++c)
            {
                for(let i = 0; i < ohmLusdDeposits[c].dayDeposit.length; ++i)
                {
                    let obj = {}
                    obj.adjustment = ohmLusdDeposits[c].dayDeposit[i].adjustment
                    obj.initBCV = ohmLusdDeposits[c].dayDeposit[i].initBCV
                    obj.newBCV = ohmLusdDeposits[c].dayDeposit[i].newBCV
                    obj.amountOhmLusd = ohmLusdDeposits[c].dayDeposit[i].amount
                    obj.payoutOhmLusd = ohmLusdDeposits[c].dayDeposit[i].payout
                    obj.depositCountOhmLusd = ohmLusdDeposits[c].dayDeposit[i].depositCount
                    obj.redeemCountOhmLusd = ohmLusdDeposits[c].dayDeposit[i].redeemCount
                    obj.timestamp = ohmLusdDeposits[c].dayDeposit[i].timestamp
                    ohmLusdArray.push(obj)
                }
            }
        }
        
        for(let beginTimestamp = startTimestamp, endTimestamp = startTimestamp + days*86400; beginTimestamp < endTime; beginTimestamp += days*86400, endTimestamp+=days*86400)
        {
            let obj = {
                amountDai: 0,
                amountEth: 0,
                amountFrax: 0,
                amountLusd: 0,
                amountOhmDai: 0,
                amountOhmFrax: 0,
                amountOhmLusd: 0,
                amountDaiAvg: 0,
                amountEthAvg: 0,
                amountLusdAvg: 0,
                amountFraxAvg: 0,
                amountOhmDaiAvg: 0,
                amountOhmFraxAvg:0,
                amountOhmLusdAvg: 0,
                payoutDai: 0,
                payoutEth: 0,
                payoutFrax: 0,
                payoutLusd: 0,
                payoutOhmDai: 0,
                payoutOhmFrax: 0,
                payoutOhmLusd: 0,
                depositCountDai: 0,
                depositCountEth: 0,
                depositCountLusd: 0,
                depositCountFrax: 0,
                depositCountOhmDai: 0,
                depositCountOhmFrax: 0,
                depositCountOhmLusd: 0,
                redeemCountDai: 0,
                redeemCountLusd: 0,
                redeemCountEth: 0,
                redeemCountFrax: 0,
                redeemCountOhmDai: 0,
                redeemCountOhmFrax: 0,
                redeemCountOhmLusd: 0,
                initBCVDai: 0,
                newBCVDai: 0,
                adjustmentDai: 0,
                initBCVEth: 0,
                newBCVEth: 0,
                adjustmentEth: 0,
                initBCVFrax: 0,
                newBCVFrax: 0,
                adjustmentFrax: 0,
                initBCVLusd: 0,
                newBCVLusd: 0,
                adjustmentLusd: 0,
                initBCVOhmDai: 0,
                newBCVOhmDai: 0,
                adjustmentOhmDai: 0,
                initBCVOhmFrax: 0,
                newBCVOhmFrax: 0,
                adjustmentOhmFrax: 0,
                initBCVOhmLusd: 0,
                newBCVOhmLusd: 0,
                adjustmentOhmLusd: 0,
                beginTimestamp: beginTimestamp,
                endTimestamp: endTimestamp
            }            
            for(let j = 0; j < daiArray.length; ++j)
            {  
                if(beginTimestamp <= daiArray[j].timestamp && daiArray[j].timestamp < endTimestamp)
                {
                    obj.initBCVDai = daiArray[j].initBCV
                    obj.newBCVDai = daiArray[j].newBCV
                    obj.adjustmentDai = daiArray[j].adjustment
                    obj.amountDai += Number(daiArray[j].amountDai)
                    obj.depositCountDai += Number(daiArray[j].depositCountDai)
                    obj.redeemCountDai += Number(daiArray[j].redeemCountDai)
                    obj.payoutDai += Number(daiArray[j].payoutDai)
                    if(obj.depositCountDai != 0)
                    {
                        obj.amountDaiAvg = obj.amountDai / obj.depositCountDai
                    }
                }

            }
            for(let j = 0; j < ethArray.length; ++j)
            {  
                if(beginTimestamp <= ethArray[j].timestamp && ethArray[j].timestamp < endTimestamp)
                {
                    obj.initBCVEth = ethArray[j].initBCV
                    obj.newBCVEth = ethArray[j].newBCV
                    obj.adjustmentEth = ethArray[j].adjustment

                    obj.amountEth += Number(ethArray[j].amountEth)
                    obj.depositCountEth += Number(ethArray[j].depositCountEth)
                    obj.redeemCountEth += Number(ethArray[j].redeemCountEth)
                    obj.payoutEth += Number(ethArray[j].payoutEth)
                    if(obj.depositCountEth != 0)
                    {
                        obj.amountEthAvg = obj.amountEth / obj.depositCountEth
                    }
                }

            }
            for(let j = 0; j < fraxArray.length; ++j)
            {  
                if(beginTimestamp <= fraxArray[j].timestamp && fraxArray[j].timestamp < endTimestamp)
                {
                    obj.initBCVFrax = fraxArray[j].initBCV
                    obj.newBCVFrax = fraxArray[j].newBCV
                    obj.adjustmentFrax = fraxArray[j].adjustment

                    obj.amountFrax += Number(fraxArray[j].amountFrax)
                    obj.depositCountFrax += Number(fraxArray[j].depositCountFrax)
                    obj.redeemCountFrax += Number(fraxArray[j].redeemCountFrax)
                    obj.payoutFrax += Number(fraxArray[j].payoutFrax)
                    if(obj.depositCountFrax != 0)
                    {
                        obj.amountFraxAvg = obj.amountFrax / obj.depositCountFrax
                    }
                }
            }
            for(let j = 0; j < lusdArray.length; ++j)
            {  
                if(beginTimestamp <= lusdArray[j].timestamp && lusdArray[j].timestamp < endTimestamp)
                {
                    obj.initBCVLusd = lusdArray[j].initBCV
                    obj.newBCVLusd = lusdArray[j].newBCV
                    obj.adjustmentLusd = lusdArray[j].adjustment

                    obj.amountLusd += Number(lusdArray[j].amountLusd)
                    obj.depositCountLusd += Number(lusdArray[j].depositCountLusd)
                    obj.redeemCountLusd += Number(lusdArray[j].redeemCountLusd)
                    obj.payoutLusd += Number(lusdArray[j].payoutLusd)
                    if(obj.depositCountLusd != 0)
                    {
                        obj.amountLusdAvg = obj.amountLusd / obj.depositCountLusd
                    }
                }
            }
            for(let j = 0; j < ohmDaiArray.length; ++j)
            {  
                if(beginTimestamp <= ohmDaiArray[j].timestamp && ohmDaiArray[j].timestamp < endTimestamp)
                {
                    obj.initBCVOhmDai = ohmDaiArray[j].initBCV
                    obj.newBCVOhmDai = ohmDaiArray[j].newBCV
                    obj.adjustmentOhmDai = ohmDaiArray[j].adjustment

                    obj.amountOhmDai += Number(ohmDaiArray[j].amountOhmDai)
                    obj.depositCountOhmDai += Number(ohmDaiArray[j].depositCountOhmDai)
                    obj.redeemCountOhmDai += Number(ohmDaiArray[j].redeemCountOhmDai)
                    obj.payoutOhmDai += Number(ohmDaiArray[j].payoutOhmDai)
                    if(obj.depositCountOhmDai != 0)
                    {
                        obj.amountOhmDaiAvg = obj.amountOhmDai / obj.depositCountOhmDai
                    }
                }
            }
            for(let j = 0; j < ohmFraxArray.length; ++j)
            {  
                if(beginTimestamp <= ohmFraxArray[j].timestamp && ohmFraxArray[j].timestamp < endTimestamp)
                {
                    obj.initBCVOhmFrax = ohmFraxArray[j].initBCV
                    obj.newBCVOhmFrax = ohmFraxArray[j].newBCV
                    obj.adjustmentOhmFrax = ohmFraxArray[j].adjustment

                    obj.amountOhmFrax += Number(ohmFraxArray[j].amountOhmFrax)
                    obj.depositCountOhmFrax += Number(ohmFraxArray[j].depositCountOhmFrax)
                    obj.redeemCountOhmFrax += Number(ohmFraxArray[j].redeemCountOhmFrax)
                    obj.payoutOhmFrax += Number(ohmFraxArray[j].payoutOhmFrax)
                    if(obj.depositCountOhmFrax != 0)
                    {
                        obj.amountOhmFraxAvg = obj.amountOhmFrax / obj.depositCountOhmFrax
                    }
                }
            }
            for(let j = 0; j < ohmLusdArray.length; ++j)
            {  
                if(beginTimestamp <= ohmLusdArray[j].timestamp && ohmLusdArray[j].timestamp < endTimestamp)
                {
                    obj.initBCVOhmLusd = ohmLusdArray[j].initBCV
                    obj.newBCVOhmLusd = ohmLusdArray[j].newBCV
                    obj.adjustmentOhmLusd = ohmLusdArray[j].adjustment

                    obj.amountOhmLusd += Number(ohmLusdArray[j].amountOhmLusd)
                    obj.depositCountOhmLusd += Number(ohmLusdArray[j].depositCountOhmLusd)
                    obj.redeemCountOhmLusd += Number(ohmLusdArray[j].redeemCountOhmLusd)
                    obj.payoutOhmLusd += Number(ohmLusdArray[j].payoutOhmLusd)
                    if(obj.depositCountOhmLusd != 0)
                    {
                        obj.amountOhmLusdAvg = obj.amountOhmLusd / obj.depositCountOhmLusd
                    }
                }
            }
            data.push(obj)
        }
        return data
    }
    catch(err)
    {
        console.log(err)
    }
}



/**

    * @dev : Get deposits (hours)
    * @param startTimestamp - Start timestamp for query 
    * @param endTime - End timestamp for query

*/
export async function getDepositsInfoHours(startTimestamp)
{
    let depositQuery = `
    {
        depositYearDaiEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"DAI"}) {
          
          dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
            
            hourDeposit(first: 24 orderBy:timestamp) {
              id
                  amount
                  timestamp
                  depositCount
                  redeemCount
                  payout
                  initBCV
                  newBCV
                  adjustment
      
            }
          }
        }
        depositYearETHEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"WETH"}) {
          
            dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
                
              hourDeposit(first: 24 orderBy:timestamp) {
                id
                    amount
                    timestamp
                    depositCount
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
              }
            }
          }
          depositYearFraxEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"FRAX"}) {
          
            dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
                
              hourDeposit(first: 24 orderBy:timestamp) {
                id
                    amount
                    timestamp
                    depositCount
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
              }
            }
          }
          depositYearLusdEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"LUSD"}) {
          
            dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
                
              hourDeposit(first: 24 orderBy:timestamp) {
                id
                    amount
                    timestamp
                    depositCount
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
              }
            }
          }
          depositYearOHMDAIEntities:depositYearEntities(first: 100 orderBy:timestamp where:{token:"OHM-DAI"}) {
          
            dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
                
              hourDeposit(first: 24 orderBy:timestamp) {
                id
                    amount
                    timestamp
                    depositCount
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
              }
            }
          }
          depositYearOHMFRAXEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"OHM-FRAX"}) {
          
            dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
                
              hourDeposit(first: 24 orderBy:timestamp) {
                id
                    amount
                    timestamp
                    depositCount
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
              }
            }
          }
          depositYearOHMLUSDEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"OHM-LUSD"}) {
          
            dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
                
              hourDeposit(first: 24 orderBy:timestamp) {
                id
                    amount
                    timestamp
                    depositCount
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
              }
            }
          }
      }
    
    `
    try{
        const depositData = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
            method: 'post',
            data: {
              query: depositQuery
            }
        }) 
        const daiDeposits = depositData.data.data.depositYearDaiEntities
        const ethDeposits = depositData.data.data.depositYearETHEntities
        const fraxDeposits = depositData.data.data.depositYearFraxEntities
        const lusdDeposits = depositData.data.data.depositYearLusdEntities
        const ohmDaiDeposits = depositData.data.data.depositYearOHMDAIEntities
        const ohmFraxDeposits = depositData.data.data.depositYearOHMFRAXEntities
        const ohmLusdDeposits = depositData.data.data.depositYearOHMLUSDEntities
        let data = []
        
        let daiArray = []
        let ethArray = []
        let fraxArray = []
        let lusdArray = []
        let ohmDaiArray = []
        let ohmFraxArray = []
        let ohmLusdArray = []

        if(daiDeposits.length != 0)
        {
            for(let c = 0; c < daiDeposits.length; ++c)
            {
                for(let i = 0; i < daiDeposits[0].dayDeposit.length; ++i)
                {
                    
                    for(let k = 0; k < daiDeposits[0].dayDeposit[i].hourDeposit.length; ++k)
                    {
                        let obj = {}
                        obj.adjustment = daiDeposits[c].dayDeposit[i].hourDeposit[k].adjustment
                        obj.initBCV = daiDeposits[c].dayDeposit[i].hourDeposit[k].initBCV
                        obj.newBCV = daiDeposits[c].dayDeposit[i].hourDeposit[k].newBCV
                        obj.amountDai = daiDeposits[c].dayDeposit[i].hourDeposit[k].amount
                        obj.payoutDai = daiDeposits[c].dayDeposit[i].hourDeposit[k].payout
                        obj.depositCountDai = daiDeposits[c].dayDeposit[i].hourDeposit[k].depositCount
                        obj.redeemCountDai = daiDeposits[c].dayDeposit[i].hourDeposit[k].redeemCount
                        obj.timestamp = daiDeposits[c].dayDeposit[i].hourDeposit[k].timestamp
                        daiArray.push(obj)
                    }
                }
            }
        }
        
        if(ethDeposits.length != 0)
        {
            for(let c = 0; c < ethDeposits.length; ++c)
            {
                for(let i = 0; i < ethDeposits[c].dayDeposit.length; ++i)
                {
                    for(let k = 0; k < ethDeposits[c].dayDeposit[i].hourDeposit.length; ++k)
                    {
                        let obj = {}
                        obj.adjustment = ethDeposits[c].dayDeposit[i].hourDeposit[k].adjustment
                        obj.initBCV = ethDeposits[c].dayDeposit[i].hourDeposit[k].initBCV
                        obj.newBCV = ethDeposits[c].dayDeposit[i].hourDeposit[k].newBCV

                        obj.amountEth = ethDeposits[c].dayDeposit[i].hourDeposit[k].amount
                        obj.payoutEth = ethDeposits[c].dayDeposit[i].hourDeposit[k].payout
                        obj.depositCountEth = ethDeposits[c].dayDeposit[i].hourDeposit[k].depositCount
                        obj.redeemCountEth = ethDeposits[c].dayDeposit[i].hourDeposit[k].redeemCount
                        obj.timestamp = ethDeposits[c].dayDeposit[i].hourDeposit[k].timestamp
                        ethArray.push(obj)
                    }
                }
            }
            
        }

        if(fraxDeposits.length != 0)
        {
            for(let c = 0; c < fraxDeposits.length; ++c)
            {
                for(let i = 0; i < fraxDeposits[c].dayDeposit.length; ++i)
                {
                    for(let k = 0; k < fraxDeposits[c].dayDeposit[i].hourDeposit.length; ++k)
                    {
                        let obj = {}
                        obj.adjustment = fraxDeposits[c].dayDeposit[i].hourDeposit[k].adjustment
                        obj.initBCV = fraxDeposits[c].dayDeposit[i].hourDeposit[k].initBCV
                        obj.newBCV = fraxDeposits[c].dayDeposit[i].hourDeposit[k].newBCV

                        obj.amountFrax = fraxDeposits[c].dayDeposit[i].hourDeposit[k].amount
                        obj.payoutFrax = fraxDeposits[c].dayDeposit[i].hourDeposit[k].payout
                        obj.depositCountFrax = fraxDeposits[c].dayDeposit[i].hourDeposit[k].depositCount
                        obj.redeemCountFrax = fraxDeposits[c].dayDeposit[i].hourDeposit[k].redeemCount
                        obj.timestamp = fraxDeposits[c].dayDeposit[i].hourDeposit[k].timestamp
                        fraxArray.push(obj)
                    }
                }
            } 
        }
        
        if(lusdDeposits.length != 0)
        {
            for(let c = 0; c < lusdDeposits.length; ++c)
            {
                for(let i = 0; i < lusdDeposits[c].dayDeposit.length; ++i)
                {
                    for(let k = 0; k < lusdDeposits[c].dayDeposit[i].hourDeposit.length; ++k)
                    {
                        let obj = {}
                        obj.adjustment = lusdDeposits[c].dayDeposit[i].hourDeposit[k].adjustment
                        obj.initBCV = lusdDeposits[c].dayDeposit[i].hourDeposit[k].initBCV
                        obj.newBCV = lusdDeposits[c].dayDeposit[i].hourDeposit[k].newBCV

                        obj.amountLusd = lusdDeposits[c].dayDeposit[i].hourDeposit[k].amount
                        obj.payoutLusd = lusdDeposits[c].dayDeposit[i].hourDeposit[k].payout
                        obj.depositCountLusd = lusdDeposits[c].dayDeposit[i].hourDeposit[k].depositCount
                        obj.redeemCountLusd = lusdDeposits[c].dayDeposit[i].hourDeposit[k].redeemCount
                        obj.timestamp = lusdDeposits[c].dayDeposit[i].hourDeposit[k].timestamp
                        lusdArray.push(obj)
                    }
                }
            }
            
        }
        
        if(ohmFraxDeposits.length != 0)
        {
            for(let c = 0; c < ohmDaiDeposits.length; ++c)
            {
                for(let i = 0; i < ohmDaiDeposits[c].dayDeposit.length; ++i)
                {
                    
                    for(let k = 0; k < ohmDaiDeposits[c].dayDeposit[i].hourDeposit.length; ++k)
                    {
                        let obj = {}
                        obj.adjustment = ohmDaiDeposits[c].dayDeposit[i].hourDeposit[k].adjustment
                        obj.initBCV = ohmDaiDeposits[c].dayDeposit[i].hourDeposit[k].initBCV
                        obj.newBCV = ohmDaiDeposits[c].dayDeposit[i].hourDeposit[k].newBCV

                        obj.amountOhmDai = ohmDaiDeposits[c].dayDeposit[i].hourDeposit[k].amount
                        obj.payoutOhmDai = ohmDaiDeposits[c].dayDeposit[i].hourDeposit[k].payout
                        obj.depositCountOhmDai = ohmDaiDeposits[c].dayDeposit[i].hourDeposit[k].depositCount
                        obj.redeemCountOhmDai = ohmDaiDeposits[c].dayDeposit[i].hourDeposit[k].redeemCount
                        obj.timestamp = ohmDaiDeposits[c].dayDeposit[i].hourDeposit[k].timestamp
                        ohmDaiArray.push(obj)
                    }
                }    
            }
        }
        
        if(ohmFraxDeposits.length != 0)
        {
            for(let c = 0; c < ohmFraxDeposits.length; ++c)
            {
                for(let i = 0; i < ohmFraxDeposits[c].dayDeposit.length; ++i)
                {
                    
                    for(let k = 0; k < ohmFraxDeposits[c].dayDeposit[i].hourDeposit.length; ++k)
                    {
                        let obj = {}
                        obj.adjustment = ohmFraxDeposits[c].dayDeposit[i].hourDeposit[k].adjustment
                        obj.initBCV = ohmFraxDeposits[c].dayDeposit[i].hourDeposit[k].initBCV
                        obj.newBCV = ohmFraxDeposits[c].dayDeposit[i].hourDeposit[k].newBCV

                        obj.amountOhmFrax = ohmFraxDeposits[c].dayDeposit[i].hourDeposit[k].amount
                        obj.payoutOhmFrax = ohmFraxDeposits[c].dayDeposit[i].hourDeposit[k].payout
                        obj.depositCountOhmFrax = ohmFraxDeposits[c].dayDeposit[i].hourDeposit[k].depositCount
                        obj.redeemCountOhmFrax = ohmFraxDeposits[c].dayDeposit[i].hourDeposit[k].redeemCount
                        obj.timestamp = ohmFraxDeposits[c].dayDeposit[i].hourDeposit[k].timestamp
                        ohmFraxArray.push(obj)
                    }
                }    
            }
        }

        if(ohmLusdDeposits.length != 0)
        {
            for(let c = 0; c < ohmLusdDeposits.length; ++c)
            {
                for(let i = 0; i < ohmLusdDeposits[0].dayDeposit.length; ++i)
                {
                    
                    for(let k = 0; k < ohmLusdDeposits[0].dayDeposit[i].hourDeposit.length; ++k)
                    {
                        let obj = {}
                        obj.adjustment = ohmLusdDeposits[c].dayDeposit[i].hourDeposit[k].adjustment
                        obj.initBCV = ohmLusdDeposits[c].dayDeposit[i].hourDeposit[k].initBCV
                        obj.newBCV = ohmLusdDeposits[c].dayDeposit[i].hourDeposit[k].newBCV

                        obj.amountOhmLusd = ohmLusdDeposits[c].dayDeposit[i].hourDeposit[k].amount
                        obj.payoutOhmLusd = ohmLusdDeposits[c].dayDeposit[i].hourDeposit[k].payout
                        obj.depositCountOhmLusd = ohmLusdDeposits[c].dayDeposit[i].hourDeposit[k].depositCount
                        obj.redeemCountOhmLusd = ohmLusdDeposits[c].dayDeposit[i].hourDeposit[k].redeemCount
                        obj.timestamp = ohmLusdDeposits[c].dayDeposit[i].hourDeposit[k].timestamp
                        ohmLusdArray.push(obj)
                    }
                }
            }
        }
        
        for(let beginTimestamp = startTimestamp, endTimestamp = startTimestamp + 3600; beginTimestamp < endTime; beginTimestamp += 3600, endTimestamp+=3600)
        {
            let obj = {
                amountDai: 0,
                amountEth: 0,
                amountFrax: 0,
                amountLusd: 0,
                amountOhmDai: 0,
                amountOhmFrax: 0,
                amountOhmLusd: 0,
                amountDaiAvg: 0,
                amountEthAvg: 0,
                amountLusdAvg: 0,
                amountFraxAvg: 0,
                amountOhmDaiAvg: 0,
                amountOhmFraxAvg:0,
                amountOhmLusdAvg: 0,
                payoutDai: 0,
                payoutEth: 0,
                payoutFrax: 0,
                payoutLusd: 0,
                payoutOhmDai: 0,
                payoutOhmFrax: 0,
                payoutOhmLusd: 0,
                depositCountDai: 0,
                depositCountEth: 0,
                depositCountLusd: 0,
                depositCountFrax: 0,
                depositCountOhmDai: 0,
                depositCountOhmFrax: 0,
                depositCountOhmLusd: 0,
                redeemCountDai: 0,
                redeemCountLusd: 0,
                redeemCountEth: 0,
                redeemCountFrax: 0,
                redeemCountOhmDai: 0,
                redeemCountOhmFrax: 0,
                redeemCountOhmLusd: 0,
                initBCVDai: 0,
                newBCVDai: 0,
                adjustmentDai: 0,
                initBCVEth: 0,
                newBCVEth: 0,
                adjustmentEth: 0,
                initBCVFrax: 0,
                newBCVFrax: 0,
                adjustmentFrax: 0,
                initBCVLusd: 0,
                newBCVLusd: 0,
                adjustmentLusd: 0,
                initBCVOhmDai: 0,
                newBCVOhmDai: 0,
                adjustmentOhmDai: 0,
                initBCVOhmFrax: 0,
                newBCVOhmFrax: 0,
                adjustmentOhmFrax: 0,
                initBCVOhmLusd: 0,
                newBCVOhmLusd: 0,
                adjustmentOhmLusd: 0,
                beginTimestamp: beginTimestamp,
                endTimestamp: endTimestamp
            }            
            for(let j = 0; j < daiArray.length; ++j)
            {  
                if(beginTimestamp <= daiArray[j].timestamp && daiArray[j].timestamp < endTimestamp)
                {
                    obj.initBCVDai = daiArray[j].initBCV
                    obj.newBCVDai = daiArray[j].newBCV
                    obj.adjustmentDai = daiArray[j].adjustment
                    obj.amountDai = daiArray[j].amountDai
                    obj.depositCountDai = daiArray[j].depositCountDai
                    obj.redeemCountDai = daiArray[j].redeemCountDai
                    obj.payoutDai = daiArray[j].payoutDai
                    if(daiArray[j].depositCountDai != 0)
                    {
                        obj.amountDaiAvg = daiArray[j].amountDai / daiArray[j].depositCountDai
                    }
                }

            }
            for(let j = 0; j < ethArray.length; ++j)
            {  
                if(beginTimestamp <= ethArray[j].timestamp && ethArray[j].timestamp < endTimestamp)
                {
                    obj.initBCVEth = ethArray[j].initBCV
                    obj.newBCVEth = ethArray[j].newBCV
                    obj.adjustmentEth = ethArray[j].adjustment

                    obj.amountEth = ethArray[j].amountEth
                    obj.depositCountEth = ethArray[j].depositCountEth
                    obj.redeemCountEth = ethArray[j].redeemCountEth
                    obj.payoutEth = ethArray[j].payoutEth
                    if(ethArray[j].depositCountEth != 0)
                    {
                        obj.amountEthAvg = ethArray[j].amountEth / ethArray[j].depositCountEth
                    }
                }

            }
            for(let j = 0; j < fraxArray.length; ++j)
            {  
                if(beginTimestamp <= fraxArray[j].timestamp && fraxArray[j].timestamp < endTimestamp)
                {
                    obj.initBCVFrax = fraxArray[j].initBCV
                    obj.newBCVFrax = fraxArray[j].newBCV
                    obj.adjustmentFrax = fraxArray[j].adjustment

                    obj.amountFrax = fraxArray[j].amountFrax
                    obj.depositCountFrax = fraxArray[j].depositCountFrax
                    obj.redeemCountFrax = fraxArray[j].redeemCountFrax
                    obj.payoutFrax = fraxArray[j].payoutFrax
                    if(fraxArray[j].depositCountFrax != 0)
                    {
                        obj.amountFraxAvg = fraxArray[j].amountFrax / fraxArray[j].depositCountFrax
                    }
                }
            }
            for(let j = 0; j < lusdArray.length; ++j)
            {  
                if(beginTimestamp <= lusdArray[j].timestamp && lusdArray[j].timestamp < endTimestamp)
                {
                    obj.initBCVLusd = lusdArray[j].initBCV
                    obj.newBCVLusd = lusdArray[j].newBCV
                    obj.adjustmentLusd = lusdArray[j].adjustment

                    obj.amountLusd = lusdArray[j].amountLusd
                    obj.depositCountLusd = lusdArray[j].depositCountLusd
                    obj.redeemCountLusd = lusdArray[j].redeemCountLusd
                    obj.payoutLusd = lusdArray[j].payoutLusd
                    if(lusdArray[j].depositCountLusd != 0)
                    {
                        obj.amountLusdAvg = lusdArray[j].amountLusd / lusdArray[j].depositCountLusd
                    }
                }
            }
            for(let j = 0; j < ohmDaiArray.length; ++j)
            {  
                if(beginTimestamp <= ohmDaiArray[j].timestamp && ohmDaiArray[j].timestamp < endTimestamp)
                {
                    obj.initBCVOhmDai = ohmDaiArray[j].initBCV
                    obj.newBCVOhmDai = ohmDaiArray[j].newBCV
                    obj.adjustmentOhmDai = ohmDaiArray[j].adjustment

                    obj.amountOhmDai = ohmDaiArray[j].amountOhmDai
                    obj.depositCountOhmDai = ohmDaiArray[j].depositCountOhmDai
                    obj.redeemCountOhmDai = ohmDaiArray[j].redeemCountOhmDai
                    obj.payoutOhmDai = ohmDaiArray[j].payoutOhmDai
                    if(ohmDaiArray[j].depositCountOhmDai != 0)
                    {
                        obj.amountOhmDaiAvg = ohmDaiArray[j].amountOhmDai / ohmDaiArray[j].depositCountOhmDai
                    }
                }
            }
            for(let j = 0; j < ohmFraxArray.length; ++j)
            {  
                if(beginTimestamp <= ohmFraxArray[j].timestamp && ohmFraxArray[j].timestamp < endTimestamp)
                {
                    obj.initBCVOhmFrax = ohmFraxArray[j].initBCV
                    obj.newBCVOhmFrax = ohmFraxArray[j].newBCV
                    obj.adjustmentOhmFrax = ohmFraxArray[j].adjustment

                    obj.amountOhmFrax = ohmFraxArray[j].amountOhmFrax
                    obj.depositCountOhmFrax = ohmFraxArray[j].depositCountOhmFrax
                    obj.redeemCountOhmFrax = ohmFraxArray[j].redeemCountOhmFrax
                    obj.payoutOhmFrax = ohmFraxArray[j].payoutOhmFrax
                    if(ohmFraxArray[j].depositCountOhmFrax != 0)
                    {
                        obj.amountOhmFraxAvg = ohmFraxArray[j].amountOhmFrax / ohmFraxArray[j].depositCountOhmFrax
                    }
                }
            }
            for(let j = 0; j < ohmLusdArray.length; ++j)
            {  
                if(beginTimestamp <= ohmLusdArray[j].timestamp && ohmLusdArray[j].timestamp < endTimestamp)
                {
                    obj.initBCVOhmLusd = ohmLusdArray[j].initBCV
                    obj.newBCVOhmLusd = ohmLusdArray[j].newBCV
                    obj.adjustmentOhmLusd = ohmLusdArray[j].adjustment

                    obj.amountOhmLusd = ohmLusdArray[j].amountOhmLusd
                    obj.depositCountOhmLusd = ohmLusdArray[j].depositCountOhmLusd
                    obj.redeemCountOhmLusd = ohmLusdArray[j].redeemCountOhmLusd
                    obj.payoutOhmLusd = ohmLusdArray[j].payoutOhmLusd
                    if(ohmLusdArray[j].depositCountOhmLusd != 0)
                    {
                        obj.amountOhmLusdAvg = ohmLusdArray[j].amountOhmLusd / ohmLusdArray[j].depositCountOhmLusd
                    }
                }
            }
            data.push(obj)
        }
        return data
    }
    catch(err)
    {
        console.log(err)
    }
}
/**

    * @dev : Get deposits (N hours)
    * @param startTimestamp - Start timestamp for query 
    * @param endTime - End timestamp for query
    * @param hours - Number of hours
*/
export async function getDepositsInfoNHours(startTimestamp, endTime, hours)
{
    let depositQuery = `
    {
        depositYearDaiEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"DAI"}) {
          
          dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
            
            hourDeposit(first: 24 orderBy:timestamp) {
              id
                  amount
                  timestamp
                  depositCount
                  redeemCount
                  payout
                  initBCV
                  newBCV
                  adjustment
      
            }
          }
        }
        depositYearETHEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"WETH"}) {
          
            dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
                
              hourDeposit(first: 24 orderBy:timestamp) {
                id
                    amount
                    timestamp
                    depositCount
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
              }
            }
          }
          depositYearFraxEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"FRAX"}) {
          
            dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
                
              hourDeposit(first: 24 orderBy:timestamp) {
                id
                    amount
                    timestamp
                    depositCount
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
              }
            }
          }
          depositYearLusdEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"LUSD"}) {
          
            dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
                
              hourDeposit(first: 24 orderBy:timestamp) {
                id
                    amount
                    timestamp
                    depositCount
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
              }
            }
          }
          depositYearOHMDAIEntities:depositYearEntities(first: 100 orderBy:timestamp where:{token:"OHM-DAI"}) {
          
            dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
                
              hourDeposit(first: 24 orderBy:timestamp) {
                id
                    amount
                    timestamp
                    depositCount
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
              }
            }
          }
          depositYearOHMFRAXEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"OHM-FRAX"}) {
          
            dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
                
              hourDeposit(first: 24 orderBy:timestamp) {
                id
                    amount
                    timestamp
                    depositCount
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
              }
            }
          }
          depositYearOHMLUSDEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"OHM-LUSD"}) {
          
            dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
                
              hourDeposit(first: 24 orderBy:timestamp) {
                id
                    amount
                    timestamp
                    depositCount
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
              }
            }
          }
      }
    
    `
    try{
        const depositData = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
            method: 'post',
            data: {
              query: depositQuery
            }
        }) 
        const daiDeposits = depositData.data.data.depositYearDaiEntities
        const ethDeposits = depositData.data.data.depositYearETHEntities
        const fraxDeposits = depositData.data.data.depositYearFraxEntities
        const lusdDeposits = depositData.data.data.depositYearLusdEntities
        const ohmDaiDeposits = depositData.data.data.depositYearOHMDAIEntities
        const ohmFraxDeposits = depositData.data.data.depositYearOHMFRAXEntities
        const ohmLusdDeposits = depositData.data.data.depositYearOHMLUSDEntities
        let data = []
        
        let daiArray = []
        let ethArray = []
        let fraxArray = []
        let lusdArray = []
        let ohmDaiArray = []
        let ohmFraxArray = []
        let ohmLusdArray = []

        if(daiDeposits.length != 0)
        {
            for(let c = 0; c < daiDeposits.length; ++c)
            {
                for(let i = 0; i < daiDeposits[0].dayDeposit.length; ++i)
                {
                    
                    for(let k = 0; k < daiDeposits[0].dayDeposit[i].hourDeposit.length; ++k)
                    {
                        let obj = {}
                        obj.adjustment = daiDeposits[c].dayDeposit[i].hourDeposit[k].adjustment
                        obj.initBCV = daiDeposits[c].dayDeposit[i].hourDeposit[k].initBCV
                        obj.newBCV = daiDeposits[c].dayDeposit[i].hourDeposit[k].newBCV
                        obj.amountDai = daiDeposits[c].dayDeposit[i].hourDeposit[k].amount
                        obj.payoutDai = daiDeposits[c].dayDeposit[i].hourDeposit[k].payout
                        obj.depositCountDai = daiDeposits[c].dayDeposit[i].hourDeposit[k].depositCount
                        obj.redeemCountDai = daiDeposits[c].dayDeposit[i].hourDeposit[k].redeemCount
                        obj.timestamp = daiDeposits[c].dayDeposit[i].hourDeposit[k].timestamp
                        daiArray.push(obj)
                    }
                }
            }
        }
        
        if(ethDeposits.length != 0)
        {
            for(let c = 0; c < ethDeposits.length; ++c)
            {
                for(let i = 0; i < ethDeposits[c].dayDeposit.length; ++i)
                {
                    for(let k = 0; k < ethDeposits[c].dayDeposit[i].hourDeposit.length; ++k)
                    {
                        let obj = {}
                        obj.adjustment = ethDeposits[c].dayDeposit[i].hourDeposit[k].adjustment
                        obj.initBCV = ethDeposits[c].dayDeposit[i].hourDeposit[k].initBCV
                        obj.newBCV = ethDeposits[c].dayDeposit[i].hourDeposit[k].newBCV

                        obj.amountEth = ethDeposits[c].dayDeposit[i].hourDeposit[k].amount
                        obj.payoutEth = ethDeposits[c].dayDeposit[i].hourDeposit[k].payout
                        obj.depositCountEth = ethDeposits[c].dayDeposit[i].hourDeposit[k].depositCount
                        obj.redeemCountEth = ethDeposits[c].dayDeposit[i].hourDeposit[k].redeemCount
                        obj.timestamp = ethDeposits[c].dayDeposit[i].hourDeposit[k].timestamp
                        ethArray.push(obj)
                    }
                }
            }
            
        }

        if(fraxDeposits.length != 0)
        {
            for(let c = 0; c < fraxDeposits.length; ++c)
            {
                for(let i = 0; i < fraxDeposits[c].dayDeposit.length; ++i)
                {
                    for(let k = 0; k < fraxDeposits[c].dayDeposit[i].hourDeposit.length; ++k)
                    {
                        let obj = {}
                        obj.adjustment = fraxDeposits[c].dayDeposit[i].hourDeposit[k].adjustment
                        obj.initBCV = fraxDeposits[c].dayDeposit[i].hourDeposit[k].initBCV
                        obj.newBCV = fraxDeposits[c].dayDeposit[i].hourDeposit[k].newBCV

                        obj.amountFrax = fraxDeposits[c].dayDeposit[i].hourDeposit[k].amount
                        obj.payoutFrax = fraxDeposits[c].dayDeposit[i].hourDeposit[k].payout
                        obj.depositCountFrax = fraxDeposits[c].dayDeposit[i].hourDeposit[k].depositCount
                        obj.redeemCountFrax = fraxDeposits[c].dayDeposit[i].hourDeposit[k].redeemCount
                        obj.timestamp = fraxDeposits[c].dayDeposit[i].hourDeposit[k].timestamp
                        fraxArray.push(obj)
                    }
                }
            } 
        }
        
        if(lusdDeposits.length != 0)
        {
            for(let c = 0; c < lusdDeposits.length; ++c)
            {
                for(let i = 0; i < lusdDeposits[c].dayDeposit.length; ++i)
                {
                    for(let k = 0; k < lusdDeposits[c].dayDeposit[i].hourDeposit.length; ++k)
                    {
                        let obj = {}
                        obj.adjustment = lusdDeposits[c].dayDeposit[i].hourDeposit[k].adjustment
                        obj.initBCV = lusdDeposits[c].dayDeposit[i].hourDeposit[k].initBCV
                        obj.newBCV = lusdDeposits[c].dayDeposit[i].hourDeposit[k].newBCV

                        obj.amountLusd = lusdDeposits[c].dayDeposit[i].hourDeposit[k].amount
                        obj.payoutLusd = lusdDeposits[c].dayDeposit[i].hourDeposit[k].payout
                        obj.depositCountLusd = lusdDeposits[c].dayDeposit[i].hourDeposit[k].depositCount
                        obj.redeemCountLusd = lusdDeposits[c].dayDeposit[i].hourDeposit[k].redeemCount
                        obj.timestamp = lusdDeposits[c].dayDeposit[i].hourDeposit[k].timestamp
                        lusdArray.push(obj)
                    }
                }
            }
            
        }
        
        if(ohmFraxDeposits.length != 0)
        {
            for(let c = 0; c < ohmDaiDeposits.length; ++c)
            {
                for(let i = 0; i < ohmDaiDeposits[c].dayDeposit.length; ++i)
                {
                    
                    for(let k = 0; k < ohmDaiDeposits[c].dayDeposit[i].hourDeposit.length; ++k)
                    {
                        let obj = {}
                        obj.adjustment = ohmDaiDeposits[c].dayDeposit[i].hourDeposit[k].adjustment
                        obj.initBCV = ohmDaiDeposits[c].dayDeposit[i].hourDeposit[k].initBCV
                        obj.newBCV = ohmDaiDeposits[c].dayDeposit[i].hourDeposit[k].newBCV

                        obj.amountOhmDai = ohmDaiDeposits[c].dayDeposit[i].hourDeposit[k].amount
                        obj.payoutOhmDai = ohmDaiDeposits[c].dayDeposit[i].hourDeposit[k].payout
                        obj.depositCountOhmDai = ohmDaiDeposits[c].dayDeposit[i].hourDeposit[k].depositCount
                        obj.redeemCountOhmDai = ohmDaiDeposits[c].dayDeposit[i].hourDeposit[k].redeemCount
                        obj.timestamp = ohmDaiDeposits[c].dayDeposit[i].hourDeposit[k].timestamp
                        ohmDaiArray.push(obj)
                    }
                }    
            }
        }
        
        if(ohmFraxDeposits.length != 0)
        {
            for(let c = 0; c < ohmFraxDeposits.length; ++c)
            {
                for(let i = 0; i < ohmFraxDeposits[c].dayDeposit.length; ++i)
                {
                    
                    for(let k = 0; k < ohmFraxDeposits[c].dayDeposit[i].hourDeposit.length; ++k)
                    {
                        let obj = {}
                        obj.adjustment = ohmFraxDeposits[c].dayDeposit[i].hourDeposit[k].adjustment
                        obj.initBCV = ohmFraxDeposits[c].dayDeposit[i].hourDeposit[k].initBCV
                        obj.newBCV = ohmFraxDeposits[c].dayDeposit[i].hourDeposit[k].newBCV

                        obj.amountOhmFrax = ohmFraxDeposits[c].dayDeposit[i].hourDeposit[k].amount
                        obj.payoutOhmFrax = ohmFraxDeposits[c].dayDeposit[i].hourDeposit[k].payout
                        obj.depositCountOhmFrax = ohmFraxDeposits[c].dayDeposit[i].hourDeposit[k].depositCount
                        obj.redeemCountOhmFrax = ohmFraxDeposits[c].dayDeposit[i].hourDeposit[k].redeemCount
                        obj.timestamp = ohmFraxDeposits[c].dayDeposit[i].hourDeposit[k].timestamp
                        ohmFraxArray.push(obj)
                    }
                }    
            }
        }

        if(ohmLusdDeposits.length != 0)
        {
            for(let c = 0; c < ohmLusdDeposits.length; ++c)
            {
                for(let i = 0; i < ohmLusdDeposits[c].dayDeposit.length; ++i)
                {
                    
                    for(let k = 0; k < ohmLusdDeposits[c].dayDeposit[i].hourDeposit.length; ++k)
                    {
                        let obj = {}
                        obj.adjustment = ohmLusdDeposits[c].dayDeposit[i].hourDeposit[k].adjustment
                        obj.initBCV = ohmLusdDeposits[c].dayDeposit[i].hourDeposit[k].initBCV
                        obj.newBCV = ohmLusdDeposits[c].dayDeposit[i].hourDeposit[k].newBCV

                        obj.amountOhmLusd = ohmLusdDeposits[c].dayDeposit[i].hourDeposit[k].amount
                        obj.payoutOhmLusd = ohmLusdDeposits[c].dayDeposit[i].hourDeposit[k].payout
                        obj.depositCountOhmLusd = ohmLusdDeposits[c].dayDeposit[i].hourDeposit[k].depositCount
                        obj.redeemCountOhmLusd = ohmLusdDeposits[c].dayDeposit[i].hourDeposit[k].redeemCount
                        obj.timestamp = ohmLusdDeposits[c].dayDeposit[i].hourDeposit[k].timestamp
                        ohmLusdArray.push(obj)
                    }
                }
            }
        }
        
        for(let beginTimestamp = startTimestamp, endTimestamp = startTimestamp + hours*3600; beginTimestamp < endTime; beginTimestamp += hours*3600, endTimestamp+=hours*3600)
        {
            let obj = {
                amountDai: 0,
                amountEth: 0,
                amountFrax: 0,
                amountLusd: 0,
                amountOhmDai: 0,
                amountOhmFrax: 0,
                amountOhmLusd: 0,
                amountDaiAvg: 0,
                amountEthAvg: 0,
                amountLusdAvg: 0,
                amountFraxAvg: 0,
                amountOhmDaiAvg: 0,
                amountOhmFraxAvg:0,
                amountOhmLusdAvg: 0,
                payoutDai: 0,
                payoutEth: 0,
                payoutFrax: 0,
                payoutLusd: 0,
                payoutOhmDai: 0,
                payoutOhmFrax: 0,
                payoutOhmLusd: 0,
                depositCountDai: 0,
                depositCountEth: 0,
                depositCountLusd: 0,
                depositCountFrax: 0,
                depositCountOhmDai: 0,
                depositCountOhmFrax: 0,
                depositCountOhmLusd: 0,
                redeemCountDai: 0,
                redeemCountLusd: 0,
                redeemCountEth: 0,
                redeemCountFrax: 0,
                redeemCountOhmDai: 0,
                redeemCountOhmFrax: 0,
                redeemCountOhmLusd: 0,
                initBCVDai: 0,
                newBCVDai: 0,
                adjustmentDai: 0,
                initBCVEth: 0,
                newBCVEth: 0,
                adjustmentEth: 0,
                initBCVFrax: 0,
                newBCVFrax: 0,
                adjustmentFrax: 0,
                initBCVLusd: 0,
                newBCVLusd: 0,
                adjustmentLusd: 0,
                initBCVOhmDai: 0,
                newBCVOhmDai: 0,
                adjustmentOhmDai: 0,
                initBCVOhmFrax: 0,
                newBCVOhmFrax: 0,
                adjustmentOhmFrax: 0,
                initBCVOhmLusd: 0,
                newBCVOhmLusd: 0,
                adjustmentOhmLusd: 0,
                beginTimestamp: beginTimestamp,
                endTimestamp: endTimestamp
            }            
            for(let j = 0; j < daiArray.length; ++j)
            {  
                if(beginTimestamp <= daiArray[j].timestamp && daiArray[j].timestamp < endTimestamp)
                {
                    obj.initBCVDai = daiArray[j].initBCV
                    obj.newBCVDai = daiArray[j].newBCV
                    obj.adjustmentDai = daiArray[j].adjustment
                    obj.amountDai += Number(daiArray[j].amountDai)
                    obj.depositCountDai += Number(daiArray[j].depositCountDai)
                    obj.redeemCountDai += Number(daiArray[j].redeemCountDai)
                    obj.payoutDai += Number(daiArray[j].payoutDai)
                    if(obj.depositCountDai != 0)
                    {
                        obj.amountDaiAvg = obj.amountDai / obj.depositCountDai
                    }
                }

            }
            for(let j = 0; j < ethArray.length; ++j)
            {  
                if(beginTimestamp <= ethArray[j].timestamp && ethArray[j].timestamp < endTimestamp)
                {
                    obj.initBCVEth = ethArray[j].initBCV
                    obj.newBCVEth = ethArray[j].newBCV
                    obj.adjustmentEth = ethArray[j].adjustment

                    obj.amountEth += Number(ethArray[j].amountEth)
                    obj.depositCountEth += Number(ethArray[j].depositCountEth)
                    obj.redeemCountEth += Number(ethArray[j].redeemCountEth)
                    obj.payoutEth += Number(ethArray[j].payoutEth)
                    if(obj.depositCountEth != 0)
                    {
                        obj.amountEthAvg = obj.amountEth / obj.depositCountEth
                    }
                }

            }
            for(let j = 0; j < fraxArray.length; ++j)
            {  
                if(beginTimestamp <= fraxArray[j].timestamp && fraxArray[j].timestamp < endTimestamp)
                {
                    obj.initBCVFrax = fraxArray[j].initBCV
                    obj.newBCVFrax = fraxArray[j].newBCV
                    obj.adjustmentFrax = fraxArray[j].adjustment

                    obj.amountFrax += Number(fraxArray[j].amountFrax)
                    obj.depositCountFrax += Number(fraxArray[j].depositCountFrax)
                    obj.redeemCountFrax += Number(fraxArray[j].redeemCountFrax)
                    obj.payoutFrax += Number(fraxArray[j].payoutFrax)
                    if(obj.depositCountFrax != 0)
                    {
                        obj.amountFraxAvg = obj.amountFrax / obj.depositCountFrax
                    }
                }
            }
            for(let j = 0; j < lusdArray.length; ++j)
            {  
                if(beginTimestamp <= lusdArray[j].timestamp && lusdArray[j].timestamp < endTimestamp)
                {
                    obj.initBCVLusd = lusdArray[j].initBCV
                    obj.newBCVLusd = lusdArray[j].newBCV
                    obj.adjustmentLusd = lusdArray[j].adjustment

                    obj.amountLusd += Number(lusdArray[j].amountLusd)
                    obj.depositCountLusd += Number(lusdArray[j].depositCountLusd)
                    obj.redeemCountLusd += Number(lusdArray[j].redeemCountLusd)
                    obj.payoutLusd += Number(lusdArray[j].payoutLusd)
                    if(obj.depositCountLusd != 0)
                    {
                        obj.amountLusdAvg = obj.amountLusd / obj.depositCountLusd
                    }
                }
            }
            for(let j = 0; j < ohmDaiArray.length; ++j)
            {  
                if(beginTimestamp <= ohmDaiArray[j].timestamp && ohmDaiArray[j].timestamp < endTimestamp)
                {
                    obj.initBCVOhmDai = ohmDaiArray[j].initBCV
                    obj.newBCVOhmDai = ohmDaiArray[j].newBCV
                    obj.adjustmentOhmDai = ohmDaiArray[j].adjustment

                    obj.amountOhmDai += Number(ohmDaiArray[j].amountOhmDai)
                    obj.depositCountOhmDai += Number(ohmDaiArray[j].depositCountOhmDai)
                    obj.redeemCountOhmDai += Number(ohmDaiArray[j].redeemCountOhmDai)
                    obj.payoutOhmDai += Number(ohmDaiArray[j].payoutOhmDai)
                    if(obj.depositCountOhmDai != 0)
                    {
                        obj.amountOhmDaiAvg = obj.amountOhmDai / obj.depositCountOhmDai
                    }
                }
            }
            for(let j = 0; j < ohmFraxArray.length; ++j)
            {  
                if(beginTimestamp <= ohmFraxArray[j].timestamp && ohmFraxArray[j].timestamp < endTimestamp)
                {
                    obj.initBCVOhmFrax = ohmFraxArray[j].initBCV
                    obj.newBCVOhmFrax = ohmFraxArray[j].newBCV
                    obj.adjustmentOhmFrax = ohmFraxArray[j].adjustment

                    obj.amountOhmFrax += Number(ohmFraxArray[j].amountOhmFrax)
                    obj.depositCountOhmFrax += Number(ohmFraxArray[j].depositCountOhmFrax)
                    obj.redeemCountOhmFrax += Number(ohmFraxArray[j].redeemCountOhmFrax)
                    obj.payoutOhmFrax += Number(ohmFraxArray[j].payoutOhmFrax)
                    if(obj.depositCountOhmFrax != 0)
                    {
                        obj.amountOhmFraxAvg = obj.amountOhmFrax / obj.depositCountOhmFrax
                    }
                }
            }
            for(let j = 0; j < ohmLusdArray.length; ++j)
            {  
                if(beginTimestamp <= ohmLusdArray[j].timestamp && ohmLusdArray[j].timestamp < endTimestamp)
                {
                    obj.initBCVOhmLusd = ohmLusdArray[j].initBCV
                    obj.newBCVOhmLusd = ohmLusdArray[j].newBCV
                    obj.adjustmentOhmLusd = ohmLusdArray[j].adjustment

                    obj.amountOhmLusd += Number(ohmLusdArray[j].amountOhmLusd)
                    obj.depositCountOhmLusd += Number(ohmLusdArray[j].depositCountOhmLusd)
                    obj.redeemCountOhmLusd += Number(ohmLusdArray[j].redeemCountOhmLusd)
                    obj.payoutOhmLusd += Number(ohmLusdArray[j].payoutOhmLusd)
                    if(obj.depositCountOhmLusd != 0)
                    {
                        obj.amountOhmLusdAvg = obj.amountOhmLusd / obj.depositCountOhmLusd
                    }
                }
            }
            data.push(obj)
        }
        return data
    }
    catch(err)
    {
        console.log(err)
    }
}

/**

    * @dev : Get deposits (minutes)
    * @param startTimestamp - Start timestamp for query 
    * @param endTime - End timestamp for query

*/
export async function getDepositsInfoMinutes(startTimestamp, endTime)
{
    let depositQueryDai = `
    {
        depositYearDaiEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"DAI"}) {
          
          dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} } ) {
            
            hourDeposit(first: 24 orderBy:timestamp) {
                minuteDeposit(first: 60 orderBy:timestamp)
                {
                    id
                    amount
                    depositCount
                    timestamp
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
                }
              
            }
          }
        }
      }
    
    `
    let depositQueryEth = `
    {
        depositYearETHEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"WETH"}) {
          
          dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} } ) {
            
            hourDeposit(first: 24 orderBy:timestamp) {
                minuteDeposit(first: 60 orderBy:timestamp)
                {
                    id
                    amount
                    depositCount
                    timestamp
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
                }
              
            }
          }
        }
      }
    
    `
    let depositQueryFrax = `
    {
        depositYearFraxEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"FRAX"}) {
          
          dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} } ) {
            
            hourDeposit(first: 24 orderBy:timestamp) {
                minuteDeposit(first: 60 orderBy:timestamp)
                {
                    id
                    amount
                    depositCount
                    timestamp
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
                }
              
            }
          }
        }
      }
    `
    let depositQueryLusd = `
    {
        depositYearLusdEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"LUSD"}) {
          
          dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} } ) {
            
            hourDeposit(first: 24 orderBy:timestamp) {
                minuteDeposit(first: 60 orderBy:timestamp)
                {
                    id
                    amount
                    depositCount
                    timestamp
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
                }
              
            }
          }
        }
      }
    `

    let depositQueryOhmDai = `
    {
        depositYearOHMDAIEntities:depositYearEntities(first: 100 orderBy:timestamp where:{token:"OHM-DAI"}) {
          
          dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} } ) {
            
            hourDeposit(first: 24 orderBy:timestamp) {
                minuteDeposit(first: 60 orderBy:timestamp)
                {
                    id
                    amount
                    depositCount
                    timestamp
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
                }
              
            }
          }
        }
      }
    `

    let depositQueryOhmFrax = `
    {
        depositYearOHMFRAXEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"OHM-FRAX"}) {
          
          dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} } ) {
            
            hourDeposit(first: 24 orderBy:timestamp) {
                minuteDeposit(first: 60 orderBy:timestamp)
                {
                    id
                    amount
                    depositCount
                    timestamp
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
                }
              
            }
          }
        }
      }
    `

    let depositQueryOhmLusd = `
    {
        depositYearOHMLUSDEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"OHM-LUSD"}) {
          
          dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} } ) {
            
            hourDeposit(first: 24 orderBy:timestamp) {
                minuteDeposit(first: 60 orderBy:timestamp)
                {
                    id
                    amount
                    depositCount
                    timestamp
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
                }
              
            }
          }
        }
      }
    `


    try
    {
        console.log(Date())

        const depositDataDai = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
            method: 'post',
            data: {
              query: depositQueryDai
            }
        }) 
        const depositDataEth = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
            method: 'post',
            data: {
              query: depositQueryEth
            }
        })
        const depositDataFrax = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
            method: 'post',
            data: {
              query: depositQueryFrax
            }
        })

        const depositDataLusd = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
            method: 'post',
            data: {
              query: depositQueryLusd
            }
        })
        const depositDataOhmDai = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
            method: 'post',
            data: {
              query: depositQueryOhmDai
            }
        })
        const depositDataOhmFrax = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
            method: 'post',
            data: {
              query: depositQueryOhmFrax
            }
        })
        const depositDataOhmLusd = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
            method: 'post',
            data: {
              query: depositQueryOhmLusd
            }
        })
        console.log(Date())
        const daiDeposits = depositDataDai.data.data.depositYearDaiEntities
        const ethDeposits = depositDataEth.data.data.depositYearETHEntities
        const fraxDeposits = depositDataFrax.data.data.depositYearFraxEntities 
        const lusdDeposits = depositDataLusd.data.data.depositYearLusdEntities
        const ohmDaiDeposits = depositDataOhmDai.data.data.depositYearOHMDAIEntities
        const ohmFraxDeposits = depositDataOhmFrax.data.data.depositYearOHMFRAXEntities
        const ohmLusdDeposits = depositDataOhmLusd.data.data.depositYearOHMLUSDEntities
        let data = []
        
        let daiArray = []
        let ethArray = []
        let fraxArray = []
        let lusdArray = []
        let ohmDaiArray = []
        let ohmFraxArray = []
        let ohmLusdArray = []
        if(daiDeposits.length != 0)
        {
            for(let c = 0; c < daiDeposits.length; ++c)
            {
                for(let i = 0; i < daiDeposits[c].dayDeposit.length; ++i)
                {
                    for(let j = 0; j < daiDeposits[c].dayDeposit[i].hourDeposit.length; ++j)
                    {
                        for(let k = 0; k < daiDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit.length; ++k)
                        {
                            
                            let obj = {}
                            obj.initBCV = daiDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].initBCV
                            obj.newBCV = daiDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].newBCV
                            obj.adjustment = daiDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].adjustment
                            obj.amountDai = daiDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].amount
                            obj.depositCountDai = daiDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].depositCount
                            obj.redeemCountDai = daiDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].redeemCount
                            obj.payoutDai = daiDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].payout
                            obj.timestamp = daiDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].timestamp
                            daiArray.push(obj)
            
                        }
                    }
                }    
            }
        }
        
        if(ethDeposits.length != 0)
        {
            for(let c = 0; c < ethDeposits.length; ++c)
            {
                for(let i = 0; i < ethDeposits[c].dayDeposit.length; ++i)
                {
                    for(let j = 0; j < ethDeposits[c].dayDeposit[i].hourDeposit.length; ++j)
                    {
                        for(let k = 0; k < ethDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit.length; ++k)
                        {
                            
                            let obj = {}
                            obj.initBCV = ethDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].initBCV
                            obj.newBCV = ethDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].newBCV
                            obj.adjustment = ethDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].adjustment

                            obj.amountEth = ethDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].amount
                            obj.depositCountEth = ethDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].depositCount
                            obj.redeemCountEth = ethDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].redeemCount
                            obj.payoutEth = ethDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].payout
                            obj.timestamp = ethDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].timestamp
                            ethArray.push(obj)
                        }
                    }
                }
            }
        }
        
        if(fraxDeposits.length != 0)
        {
            for(let c = 0; c < fraxDeposits.length; ++c)
            {
                for(let i = 0; i < fraxDeposits[c].dayDeposit.length; ++i)
                {
                    for(let j = 0; j < fraxDeposits[c].dayDeposit[i].hourDeposit.length; ++j)
                    {
                        for(let k = 0; k < fraxDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit.length; ++k)
                        {
                            
                            let obj = {}
                            obj.initBCV = fraxDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].initBCV
                            obj.newBCV = fraxDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].newBCV
                            obj.adjustment = fraxDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].adjustment


                            obj.amountFrax = fraxDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].amount
                            obj.depositCountFrax = fraxDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].depositCount
                            obj.redeemCountFrax = fraxDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].redeemCount
                            obj.payoutFrax = fraxDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].payout
                            obj.timestamp = fraxDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].timestamp
                            fraxArray.push(obj)
            
                        }
                    }
                }
            }   
        }
        
        if(lusdDeposits.length != 0)
        {
            for(let c = 0; c < lusdDeposits.length; ++c)
            {
                for(let i = 0; i < lusdDeposits[c].dayDeposit.length; ++i)
                {
                    for(let j = 0; j < lusdDeposits[c].dayDeposit[i].hourDeposit.length; ++j)
                    {
                        for(let k = 0; k < lusdDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit.length; ++k)
                        {
                            
                            let obj = {}
                            obj.initBCV = lusdDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].initBCV
                            obj.newBCV = lusdDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].newBCV
                            obj.adjustment = lusdDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].adjustment

                            obj.amountLusd = lusdDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].amount
                            obj.depositCountLusd = lusdDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].depositCount
                            obj.redeemCountLusd = lusdDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].redeemCount
                            obj.payoutLusd = lusdDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].payout
                            obj.timestamp = lusdDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].timestamp
                            lusdArray.push(obj)
            
                        }
                    }
                }    
            }
        }

        if(ohmDaiDeposits.length != 0)
        {
            for(let c = 0; c < ohmDaiDeposits.length; ++c)
            {
                for(let i = 0; i < ohmDaiDeposits[c].dayDeposit.length; ++i)
                {
                    for(let j = 0; j < ohmDaiDeposits[c].dayDeposit[i].hourDeposit.length; ++j)
                    {
                        for(let k = 0; k < ohmDaiDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit.length; ++k)
                        {
                            
                            let obj = {}
                            obj.initBCV = ohmDaiDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].initBCV
                            obj.newBCV = ohmDaiDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].newBCV
                            obj.adjustment = ohmDaiDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].adjustment

                            obj.amountOhmDai = ohmDaiDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].amount
                            obj.depositCountOhmDai = ohmDaiDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].depositCount
                            obj.redeemCountOhmDai = ohmDaiDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].redeemCount
                            obj.payoutOhmDai = ohmDaiDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].payout
                            obj.timestamp = ohmDaiDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].timestamp
                            ohmDaiArray.push(obj)
            
                        }
                    }
                }    
            }
        }
        
        if(ohmFraxDeposits.length != 0)
        {
            for(let c = 0; c < ohmFraxDeposits.length; ++c)
            {
                for(let i = 0; i < ohmFraxDeposits[c].dayDeposit.length; ++i)
                {
                    for(let j = 0; j < ohmFraxDeposits[c].dayDeposit[i].hourDeposit.length; ++j)
                    {
                        for(let k = 0; k < ohmFraxDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit.length; ++k)
                        {
                            
                            let obj = {}
                            obj.initBCV = ohmFraxDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].initBCV
                            obj.newBCV = ohmFraxDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].newBCV
                            obj.adjustment = ohmFraxDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].adjustment

                            obj.amountOhmFrax = ohmFraxDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].amount
                            obj.depositCountOhmFrax = ohmFraxDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].depositCount
                            obj.redeemCountOhmFrax = ohmFraxDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].redeemCount
                            obj.payoutOhmFrax = ohmFraxDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].payout
                            obj.timestamp = ohmFraxDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].timestamp
                            ohmFraxArray.push(obj)
                        }
                    }
                }
            }
        }
        if(ohmLusdDeposits.length != 0)
        {
            for(let c = 0; c < ohmLusdDeposits.length; ++c)
            {
                for(let i = 0; i < ohmLusdDeposits[c].dayDeposit.length; ++i)
                {
                    for(let j = 0; j < ohmLusdDeposits[c].dayDeposit[i].hourDeposit.length; ++j)
                    {
                        for(let k = 0; k < ohmLusdDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit.length; ++k)
                        {
                            
                            let obj = {}
                            obj.initBCV = ohmLusdDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].initBCV
                            obj.newBCV = ohmLusdDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].newBCV
                            obj.adjustment = ohmLusdDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].adjustment

                            obj.amountOhmLusd = ohmLusdDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].amount
                            obj.depositCountOhmLusd = ohmLusdDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].depositCount
                            obj.redeemCountOhmLusd = ohmLusdDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].redeemCount
                            obj.payoutOhmLusd = ohmLusdDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].payout
                            obj.timestamp = ohmLusdDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].timestamp
                            ohmLusdArray.push(obj)
                        }
                    }
                }
            }
        }
        // let beginTimestamp = startTimestamp 
        // let endTimestamp = startTimestamp + 60

        for(let beginTimestamp = startTimestamp, endTimestamp = startTimestamp + 60; beginTimestamp < endTime; beginTimestamp += 60, endTimestamp+=60)
        {
            let obj = {
                amountDai: 0,
                amountEth: 0,
                amountFrax: 0,
                amountLusd: 0,
                amountOhmDai: 0,
                amountOhmFrax: 0,
                amountDaiAvg: 0,
                amountEthAvg: 0,
                amountLusdAvg: 0,
                amountFraxAvg: 0,
                amountOhmDaiAvg: 0,
                amountOhmFraxAvg:0,
                payoutDai: 0,
                payoutEth: 0,
                payoutFrax: 0,
                payoutLusd: 0,
                payoutOhmDai: 0,
                payoutOhmFrax: 0,
                depositCountDai: 0,
                depositCountEth: 0,
                depositCountLusd: 0,
                depositCountFrax: 0,
                depositCountOhmDai: 0,
                depositCountOhmFrax: 0,
                redeemCountDai: 0,
                redeemCountLusd: 0,
                redeemCountEth: 0,
                redeemCountFrax: 0,
                redeemCountOhmDai: 0,
                redeemCountOhmFrax: 0,
                initBCVDai: 0,
                newBCVDai: 0,
                adjustmentDai: 0,
                initBCVEth: 0,
                newBCVEth: 0,
                adjustmentEth: 0,
                initBCVFrax: 0,
                newBCVFrax: 0,
                adjustmentFrax: 0,
                initBCVLusd: 0,
                newBCVLusd: 0,
                adjustmentLusd: 0,
                initBCVOhmDai: 0,
                newBCVOhmDai: 0,
                adjustmentOhmDai: 0,
                initBCVOhmFrax: 0,
                newBCVOhmFrax: 0,
                adjustmentOhmFrax: 0,
                initBCVOhmLusd: 0,
                newBCVOhmLusd: 0,
                adjustmentOhmLusd: 0,
                beginTimestamp: beginTimestamp,
                endTimestamp: endTimestamp
            }
            for(let j = 0; j < daiArray.length; ++j)
            {  
                if(beginTimestamp <= daiArray[j].timestamp && daiArray[j].timestamp < endTimestamp)
                {
                    obj.initBCVDai = daiArray[j].initBCV
                    obj.newBCVDai = daiArray[j].newBCV
                    obj.adjustmentDai = daiArray[j].adjustment
                    obj.amountDai = daiArray[j].amountDai
                    obj.depositCountDai = daiArray[j].depositCountDai
                    obj.payoutDai = daiArray[j].payoutDai
                    obj.redeemCountDai = daiArray[j].redeemCountDai
                    if(daiArray[j].depositCountDai != 0)
                    {
                        obj.amountDaiAvg = daiArray[j].amountDai / daiArray[j].depositCountDai
                    }
                }

            }
            for(let j = 0; j < ethArray.length; ++j)
            {  
                if(beginTimestamp <= ethArray[j].timestamp && ethArray[j].timestamp < endTimestamp)
                {
                    obj.initBCVEth = ethArray[j].initBCV
                    obj.newBCVEth = ethArray[j].newBCV
                    obj.adjustmentEth = ethArray[j].adjustment

                    obj.amountEth = ethArray[j].amountEth
                    obj.depositCountEth = ethArray[j].depositCountEth
                    obj.payoutEth = ethArray[j].payoutEth
                    obj.redeemCountEth = ethArray[j].redeemCountEth
                    if(ethArray[j].depositCountEth != 0)
                    {
                        obj.amountEthAvg = ethArray[j].amountEth / ethArray[j].depositCountEth
                    }
                }

            }
            for(let j = 0; j < fraxArray.length; ++j)
            {  
                if(beginTimestamp <= fraxArray[j].timestamp && fraxArray[j].timestamp < endTimestamp)
                {
                    obj.initBCVFrax = fraxArray[j].initBCV
                    obj.newBCVFrax = fraxArray[j].newBCV
                    obj.adjustmentFrax = fraxArray[j].adjustment

                    obj.amountFrax = fraxArray[j].amountFrax
                    obj.depositCountFrax = fraxArray[j].depositCountFrax
                    obj.payoutFrax = fraxArray[j].payoutFrax
                    obj.redeemCountFrax = fraxArray[j].redeemCountFrax
                    if(fraxArray[j].depositCountFrax != 0)
                    {
                        obj.amountFraxAvg = fraxArray[j].amountFrax / fraxArray[j].depositCountFrax
                    }
                }
            }
            for(let j = 0; j < lusdArray.length; ++j)
            {  
                if(beginTimestamp <= lusdArray[j].timestamp && lusdArray[j].timestamp < endTimestamp)
                {
                    obj.initBCVLusd = lusdArray[j].initBCV
                    obj.newBCVLusd = lusdArray[j].newBCV
                    obj.adjustmentLusd = lusdArray[j].adjustment

                    obj.amountLusd = lusdArray[j].amountLusd
                    obj.depositCountLusd = lusdArray[j].depositCountLusd
                    obj.payoutLusd = lusdArray[j].payoutLusd
                    obj.redeemCountLusd = lusdArray[j].redeemCountLusd
                    if(lusdArray[j].depositCountLusd != 0)
                    {
                        obj.amountLusdAvg = lusdArray[j].amountLusd / lusdArray[j].depositCountLusd
                    }
                }
            }
            for(let j = 0; j < ohmDaiArray.length; ++j)
            {  
                if(beginTimestamp <= ohmDaiArray[j].timestamp && ohmDaiArray[j].timestamp < endTimestamp)
                {
                    obj.initBCVOhmDai = ohmDaiArray[j].initBCV
                    obj.newBCVOhmDai = ohmDaiArray[j].newBCV
                    obj.adjustmentOhmDai = ohmDaiArray[j].adjustment

                    obj.amountOhmDai = ohmDaiArray[j].amountOhmDai
                    obj.depositCountOhmDai = ohmDaiArray[j].depositCountOhmDai
                    obj.payoutOhmDai = ohmDaiArray[j].payoutOhmDai
                    obj.redeemCountOhmDai = ohmDaiArray[j].redeemCountOhmDai
                    if(ohmDaiArray[j].depositCountOhmDai != 0)
                    {
                        obj.amountOhmDaiAvg = ohmDaiArray[j].amountOhmDai / ohmDaiArray[j].depositCountOhmDai
                    }
                }
            }
            for(let j = 0; j < ohmFraxArray.length; ++j)
            {  
                if(beginTimestamp <= ohmFraxArray[j].timestamp && ohmFraxArray[j].timestamp < endTimestamp)
                {
                    obj.initBCVOhmFrax = ohmFraxArray[j].initBCV
                    obj.newBCVOhmFrax = ohmFraxArray[j].newBCV
                    obj.adjustmentOhmFrax = ohmFraxArray[j].adjustment

                    obj.amountOhmFrax = ohmFraxArray[j].amountOhmFrax
                    obj.depositCountOhmFrax = ohmFraxArray[j].depositCountOhmFrax
                    obj.payoutOhmFrax = ohmFraxArray[j].payoutOhmFrax
                    obj.redeemCountOhmFrax = ohmFraxArray[j].redeemCountOhmFrax
                    if(ohmFraxArray[j].depositCountOhmFrax != 0)
                    {
                        obj.amountOhmFraxAvg = ohmFraxArray[j].amountOhmFrax / ohmFraxArray[j].depositCountOhmFrax
                    }
                }
            }
            for(let j = 0; j < ohmLusdArray.length; ++j)
            {  
                if(beginTimestamp <= ohmLusdArray[j].timestamp && ohmLusdArray[j].timestamp < endTimestamp)
                {
                    obj.initBCVOhmLusd = ohmLusdArray[j].initBCV
                    obj.newBCVOhmLusd = ohmLusdArray[j].newBCV
                    obj.adjustmentOhmLusd = ohmLusdArray[j].adjustment
                    obj.amountOhmLusd = ohmLusdArray[j].amountOhmLusd
                    obj.depositCountOhmLusd = ohmLusdArray[j].depositCountOhmLusd
                    obj.payoutOhmLusd = ohmLusdArray[j].payoutOhmLusd
                    obj.redeemCountOhmLusd = ohmLusdArray[j].redeemCountOhmLusd
                    if(ohmLusdArray[j].depositCountOhmLusd != 0)
                    {
                        obj.amountOhmLusdAvg = ohmLusdArray[j].amountOhmFrax / ohmLusdArray[j].depositCountOhmFrax
                    }
                }
            }
            data.push(obj)
        }
        console.log(Date())
        return data
    }
    catch(err)
    {
        console.log(err)
    }

}

/**

    * @dev : Get deposits (minutes)
    * @param startTimestamp - Start timestamp for query 
    * @param endTime - End timestamp for query

*/
export async function getDepositsInfoNMinutes(startTimestamp, endTime, minutes)
{
    let depositQueryDai = `
    {
        depositYearDaiEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"DAI"}) {
          
          dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} } ) {
            
            hourDeposit(first: 24 orderBy:timestamp) {
                minuteDeposit(first: 60 orderBy:timestamp)
                {
                    id
                    amount
                    depositCount
                    timestamp
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
                }
              
            }
          }
        }
      }
    
    `
    let depositQueryEth = `
    {
        depositYearETHEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"WETH"}) {
          
          dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} } ) {
            
            hourDeposit(first: 24 orderBy:timestamp) {
                minuteDeposit(first: 60 orderBy:timestamp)
                {
                    id
                    amount
                    depositCount
                    timestamp
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
                }
              
            }
          }
        }
      }
    
    `
    let depositQueryFrax = `
    {
        depositYearFraxEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"FRAX"}) {
          
          dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} } ) {
            
            hourDeposit(first: 24 orderBy:timestamp) {
                minuteDeposit(first: 60 orderBy:timestamp)
                {
                    id
                    amount
                    depositCount
                    timestamp
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
                }
              
            }
          }
        }
      }
    `
    let depositQueryLusd = `
    {
        depositYearLusdEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"LUSD"}) {
          
          dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} } ) {
            
            hourDeposit(first: 24 orderBy:timestamp) {
                minuteDeposit(first: 60 orderBy:timestamp)
                {
                    id
                    amount
                    depositCount
                    timestamp
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
                }
              
            }
          }
        }
      }
    `

    let depositQueryOhmDai = `
    {
        depositYearOHMDAIEntities:depositYearEntities(first: 100 orderBy:timestamp where:{token:"OHM-DAI"}) {
          
          dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} } ) {
            
            hourDeposit(first: 24 orderBy:timestamp) {
                minuteDeposit(first: 60 orderBy:timestamp)
                {
                    id
                    amount
                    depositCount
                    timestamp
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
                }
              
            }
          }
        }
      }
    `

    let depositQueryOhmFrax = `
    {
        depositYearOHMFRAXEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"OHM-FRAX"}) {
          
          dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} } ) {
            
            hourDeposit(first: 24 orderBy:timestamp) {
                minuteDeposit(first: 60 orderBy:timestamp)
                {
                    id
                    amount
                    depositCount
                    timestamp
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
                }
              
            }
          }
        }
      }
    `

    let depositQueryOhmLusd = `
    {
        depositYearOHMLUSDEntities:depositYearEntities(first: 100 orderBy:timestamp, where:{token:"OHM-LUSD"}) {
          
          dayDeposit(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} } ) {
            
            hourDeposit(first: 24 orderBy:timestamp) {
                minuteDeposit(first: 60 orderBy:timestamp)
                {
                    id
                    amount
                    depositCount
                    timestamp
                    redeemCount
                    payout
                    initBCV
                    newBCV
                    adjustment
        
                }
              
            }
          }
        }
      }
    `


    try
    {
        console.log(Date())

        const depositDataDai = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
            method: 'post',
            data: {
              query: depositQueryDai
            }
        }) 
        const depositDataEth = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
            method: 'post',
            data: {
              query: depositQueryEth
            }
        })
        const depositDataFrax = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
            method: 'post',
            data: {
              query: depositQueryFrax
            }
        })

        const depositDataLusd = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
            method: 'post',
            data: {
              query: depositQueryLusd
            }
        })
        const depositDataOhmDai = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
            method: 'post',
            data: {
              query: depositQueryOhmDai
            }
        })
        const depositDataOhmFrax = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
            method: 'post',
            data: {
              query: depositQueryOhmFrax
            }
        })
        const depositDataOhmLusd = await axios({
            url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
            method: 'post',
            data: {
              query: depositQueryOhmLusd
            }
        })
        console.log(Date())
        const daiDeposits = depositDataDai.data.data.depositYearDaiEntities
        const ethDeposits = depositDataEth.data.data.depositYearETHEntities
        const fraxDeposits = depositDataFrax.data.data.depositYearFraxEntities 
        const lusdDeposits = depositDataLusd.data.data.depositYearLusdEntities
        const ohmDaiDeposits = depositDataOhmDai.data.data.depositYearOHMDAIEntities
        const ohmFraxDeposits = depositDataOhmFrax.data.data.depositYearOHMFRAXEntities
        const ohmLusdDeposits = depositDataOhmLusd.data.data.depositYearOHMLUSDEntities
        let data = []
        
        let daiArray = []
        let ethArray = []
        let fraxArray = []
        let lusdArray = []
        let ohmDaiArray = []
        let ohmFraxArray = []
        let ohmLusdArray = []
        if(daiDeposits.length != 0)
        {
            for(let c = 0; c < daiDeposits.length; ++c)
            {
                for(let i = 0; i < daiDeposits[c].dayDeposit.length; ++i)
                {
                    for(let j = 0; j < daiDeposits[c].dayDeposit[i].hourDeposit.length; ++j)
                    {
                        for(let k = 0; k < daiDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit.length; ++k)
                        {
                            
                            let obj = {}
                            obj.initBCV = daiDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].initBCV
                            obj.newBCV = daiDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].newBCV
                            obj.adjustment = daiDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].adjustment
                            obj.amountDai = daiDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].amount
                            obj.depositCountDai = daiDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].depositCount
                            obj.redeemCountDai = daiDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].redeemCount
                            obj.payoutDai = daiDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].payout
                            obj.timestamp = daiDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].timestamp
                            daiArray.push(obj)
            
                        }
                    }
                }    
            }
        }
        
        if(ethDeposits.length != 0)
        {
            for(let c = 0; c < ethDeposits.length; ++c)
            {
                for(let i = 0; i < ethDeposits[c].dayDeposit.length; ++i)
                {
                    for(let j = 0; j < ethDeposits[c].dayDeposit[i].hourDeposit.length; ++j)
                    {
                        for(let k = 0; k < ethDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit.length; ++k)
                        {
                            
                            let obj = {}
                            obj.initBCV = ethDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].initBCV
                            obj.newBCV = ethDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].newBCV
                            obj.adjustment = ethDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].adjustment

                            obj.amountEth = ethDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].amount
                            obj.depositCountEth = ethDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].depositCount
                            obj.redeemCountEth = ethDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].redeemCount
                            obj.payoutEth = ethDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].payout
                            obj.timestamp = ethDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].timestamp
                            ethArray.push(obj)
                        }
                    }
                }
            }
        }
        
        if(fraxDeposits.length != 0)
        {
            for(let c = 0; c < fraxDeposits.length; ++c)
            {
                for(let i = 0; i < fraxDeposits[c].dayDeposit.length; ++i)
                {
                    for(let j = 0; j < fraxDeposits[c].dayDeposit[i].hourDeposit.length; ++j)
                    {
                        for(let k = 0; k < fraxDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit.length; ++k)
                        {
                            
                            let obj = {}
                            obj.initBCV = fraxDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].initBCV
                            obj.newBCV = fraxDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].newBCV
                            obj.adjustment = fraxDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].adjustment


                            obj.amountFrax = fraxDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].amount
                            obj.depositCountFrax = fraxDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].depositCount
                            obj.redeemCountFrax = fraxDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].redeemCount
                            obj.payoutFrax = fraxDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].payout
                            obj.timestamp = fraxDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].timestamp
                            fraxArray.push(obj)
            
                        }
                    }
                }
            }   
        }
        
        if(lusdDeposits.length != 0)
        {
            for(let c = 0; c < lusdDeposits.length; ++c)
            {
                for(let i = 0; i < lusdDeposits[c].dayDeposit.length; ++i)
                {
                    for(let j = 0; j < lusdDeposits[c].dayDeposit[i].hourDeposit.length; ++j)
                    {
                        for(let k = 0; k < lusdDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit.length; ++k)
                        {
                            
                            let obj = {}
                            obj.initBCV = lusdDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].initBCV
                            obj.newBCV = lusdDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].newBCV
                            obj.adjustment = lusdDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].adjustment

                            obj.amountLusd = lusdDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].amount
                            obj.depositCountLusd = lusdDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].depositCount
                            obj.redeemCountLusd = lusdDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].redeemCount
                            obj.payoutLusd = lusdDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].payout
                            obj.timestamp = lusdDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].timestamp
                            lusdArray.push(obj)
            
                        }
                    }
                }    
            }
        }

        if(ohmDaiDeposits.length != 0)
        {
            for(let c = 0; c < ohmDaiDeposits.length; ++c)
            {
                for(let i = 0; i < ohmDaiDeposits[c].dayDeposit.length; ++i)
                {
                    for(let j = 0; j < ohmDaiDeposits[c].dayDeposit[i].hourDeposit.length; ++j)
                    {
                        for(let k = 0; k < ohmDaiDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit.length; ++k)
                        {
                            
                            let obj = {}
                            obj.initBCV = ohmDaiDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].initBCV
                            obj.newBCV = ohmDaiDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].newBCV
                            obj.adjustment = ohmDaiDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].adjustment

                            obj.amountOhmDai = ohmDaiDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].amount
                            obj.depositCountOhmDai = ohmDaiDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].depositCount
                            obj.redeemCountOhmDai = ohmDaiDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].redeemCount
                            obj.payoutOhmDai = ohmDaiDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].payout
                            obj.timestamp = ohmDaiDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].timestamp
                            ohmDaiArray.push(obj)
            
                        }
                    }
                }    
            }
        }
        
        if(ohmFraxDeposits.length != 0)
        {
            for(let c = 0; c < ohmFraxDeposits.length; ++c)
            {
                for(let i = 0; i < ohmFraxDeposits[c].dayDeposit.length; ++i)
                {
                    for(let j = 0; j < ohmFraxDeposits[c].dayDeposit[i].hourDeposit.length; ++j)
                    {
                        for(let k = 0; k < ohmFraxDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit.length; ++k)
                        {
                            
                            let obj = {}
                            obj.initBCV = ohmFraxDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].initBCV
                            obj.newBCV = ohmFraxDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].newBCV
                            obj.adjustment = ohmFraxDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].adjustment

                            obj.amountOhmFrax = ohmFraxDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].amount
                            obj.depositCountOhmFrax = ohmFraxDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].depositCount
                            obj.redeemCountOhmFrax = ohmFraxDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].redeemCount
                            obj.payoutOhmFrax = ohmFraxDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].payout
                            obj.timestamp = ohmFraxDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].timestamp
                            ohmFraxArray.push(obj)
                        }
                    }
                }
            }
        }
        if(ohmLusdDeposits.length != 0)
        {
            for(let c = 0; c < ohmLusdDeposits.length; ++c)
            {
                for(let i = 0; i < ohmLusdDeposits[c].dayDeposit.length; ++i)
                {
                    for(let j = 0; j < ohmLusdDeposits[c].dayDeposit[i].hourDeposit.length; ++j)
                    {
                        for(let k = 0; k < ohmLusdDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit.length; ++k)
                        {
                            
                            let obj = {}
                            obj.initBCV = ohmLusdDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].initBCV
                            obj.newBCV = ohmLusdDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].newBCV
                            obj.adjustment = ohmLusdDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].adjustment

                            obj.amountOhmLusd = ohmLusdDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].amount
                            obj.depositCountOhmLusd = ohmLusdDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].depositCount
                            obj.redeemCountOhmLusd = ohmLusdDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].redeemCount
                            obj.payoutOhmLusd = ohmLusdDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].payout
                            obj.timestamp = ohmLusdDeposits[c].dayDeposit[i].hourDeposit[j].minuteDeposit[k].timestamp
                            ohmLusdArray.push(obj)
                        }
                    }
                }
            }
        }
        // let beginTimestamp = startTimestamp 
        // let endTimestamp = startTimestamp + 60

        for(let beginTimestamp = startTimestamp, endTimestamp = startTimestamp + minutes*60; beginTimestamp < endTime; beginTimestamp += minutes*60, endTimestamp+=minutes*60)
        {
            let obj = {
                amountDai: 0,
                amountEth: 0,
                amountFrax: 0,
                amountLusd: 0,
                amountOhmDai: 0,
                amountOhmFrax: 0,
                amountOhmLusd: 0,
                amountDaiAvg: 0,
                amountEthAvg: 0,
                amountLusdAvg: 0,
                amountFraxAvg: 0,
                amountOhmDaiAvg: 0,
                amountOhmFraxAvg:0,
                amountOhmLusdAvg: 0,
                payoutDai: 0,
                payoutEth: 0,
                payoutFrax: 0,
                payoutLusd: 0,
                payoutOhmDai: 0,
                payoutOhmFrax: 0,
                payoutOhmLusd: 0,
                depositCountDai: 0,
                depositCountEth: 0,
                depositCountLusd: 0,
                depositCountFrax: 0,
                depositCountOhmDai: 0,
                depositCountOhmFrax: 0,
                depositCountOhmLusd: 0,
                redeemCountDai: 0,
                redeemCountLusd: 0,
                redeemCountEth: 0,
                redeemCountFrax: 0,
                redeemCountOhmDai: 0,
                redeemCountOhmFrax: 0,
                redeemCountOhmLusd: 0,
                initBCVDai: 0,
                newBCVDai: 0,
                adjustmentDai: 0,
                initBCVEth: 0,
                newBCVEth: 0,
                adjustmentEth: 0,
                initBCVFrax: 0,
                newBCVFrax: 0,
                adjustmentFrax: 0,
                initBCVLusd: 0,
                newBCVLusd: 0,
                adjustmentLusd: 0,
                initBCVOhmDai: 0,
                newBCVOhmDai: 0,
                adjustmentOhmDai: 0,
                initBCVOhmFrax: 0,
                newBCVOhmFrax: 0,
                adjustmentOhmFrax: 0,
                initBCVOhmLusd: 0,
                newBCVOhmLusd: 0,
                adjustmentOhmLusd: 0,
                beginTimestamp: beginTimestamp,
                endTimestamp: endTimestamp
            }            
            for(let j = 0; j < daiArray.length; ++j)
            {  
                if(beginTimestamp <= daiArray[j].timestamp && daiArray[j].timestamp < endTimestamp)
                {
                    obj.initBCVDai = daiArray[j].initBCV
                    obj.newBCVDai = daiArray[j].newBCV
                    obj.adjustmentDai = daiArray[j].adjustment
                    obj.amountDai += Number(daiArray[j].amountDai)
                    obj.depositCountDai += Number(daiArray[j].depositCountDai)
                    obj.redeemCountDai += Number(daiArray[j].redeemCountDai)
                    obj.payoutDai += Number(daiArray[j].payoutDai)
                    if(obj.depositCountDai != 0)
                    {
                        obj.amountDaiAvg = obj.amountDai / obj.depositCountDai
                    }
                }

            }
            for(let j = 0; j < ethArray.length; ++j)
            {  
                if(beginTimestamp <= ethArray[j].timestamp && ethArray[j].timestamp < endTimestamp)
                {
                    obj.initBCVEth = ethArray[j].initBCV
                    obj.newBCVEth = ethArray[j].newBCV
                    obj.adjustmentEth = ethArray[j].adjustment

                    obj.amountEth += Number(ethArray[j].amountEth)
                    obj.depositCountEth += Number(ethArray[j].depositCountEth)
                    obj.redeemCountEth += Number(ethArray[j].redeemCountEth)
                    obj.payoutEth += Number(ethArray[j].payoutEth)
                    if(obj.depositCountEth != 0)
                    {
                        obj.amountEthAvg = obj.amountEth / obj.depositCountEth
                    }
                }

            }
            for(let j = 0; j < fraxArray.length; ++j)
            {  
                if(beginTimestamp <= fraxArray[j].timestamp && fraxArray[j].timestamp < endTimestamp)
                {
                    obj.initBCVFrax = fraxArray[j].initBCV
                    obj.newBCVFrax = fraxArray[j].newBCV
                    obj.adjustmentFrax = fraxArray[j].adjustment

                    obj.amountFrax += Number(fraxArray[j].amountFrax)
                    obj.depositCountFrax += Number(fraxArray[j].depositCountFrax)
                    obj.redeemCountFrax += Number(fraxArray[j].redeemCountFrax)
                    obj.payoutFrax += Number(fraxArray[j].payoutFrax)
                    if(obj.depositCountFrax != 0)
                    {
                        obj.amountFraxAvg = obj.amountFrax / obj.depositCountFrax
                    }
                }
            }
            for(let j = 0; j < lusdArray.length; ++j)
            {  
                if(beginTimestamp <= lusdArray[j].timestamp && lusdArray[j].timestamp < endTimestamp)
                {
                    obj.initBCVLusd = lusdArray[j].initBCV
                    obj.newBCVLusd = lusdArray[j].newBCV
                    obj.adjustmentLusd = lusdArray[j].adjustment

                    obj.amountLusd += Number(lusdArray[j].amountLusd)
                    obj.depositCountLusd += Number(lusdArray[j].depositCountLusd)
                    obj.redeemCountLusd += Number(lusdArray[j].redeemCountLusd)
                    obj.payoutLusd += Number(lusdArray[j].payoutLusd)
                    if(obj.depositCountLusd != 0)
                    {
                        obj.amountLusdAvg = obj.amountLusd / obj.depositCountLusd
                    }
                }
            }
            for(let j = 0; j < ohmDaiArray.length; ++j)
            {  
                if(beginTimestamp <= ohmDaiArray[j].timestamp && ohmDaiArray[j].timestamp < endTimestamp)
                {
                    obj.initBCVOhmDai = ohmDaiArray[j].initBCV
                    obj.newBCVOhmDai = ohmDaiArray[j].newBCV
                    obj.adjustmentOhmDai = ohmDaiArray[j].adjustment

                    obj.amountOhmDai += Number(ohmDaiArray[j].amountOhmDai)
                    obj.depositCountOhmDai += Number(ohmDaiArray[j].depositCountOhmDai)
                    obj.redeemCountOhmDai += Number(ohmDaiArray[j].redeemCountOhmDai)
                    obj.payoutOhmDai += Number(ohmDaiArray[j].payoutOhmDai)
                    if(obj.depositCountOhmDai != 0)
                    {
                        obj.amountOhmDaiAvg = obj.amountOhmDai / obj.depositCountOhmDai
                    }
                }
            }
            for(let j = 0; j < ohmFraxArray.length; ++j)
            {  
                if(beginTimestamp <= ohmFraxArray[j].timestamp && ohmFraxArray[j].timestamp < endTimestamp)
                {
                    obj.initBCVOhmFrax = ohmFraxArray[j].initBCV
                    obj.newBCVOhmFrax = ohmFraxArray[j].newBCV
                    obj.adjustmentOhmFrax = ohmFraxArray[j].adjustment

                    obj.amountOhmFrax += Number(ohmFraxArray[j].amountOhmFrax)
                    obj.depositCountOhmFrax += Number(ohmFraxArray[j].depositCountOhmFrax)
                    obj.redeemCountOhmFrax += Number(ohmFraxArray[j].redeemCountOhmFrax)
                    obj.payoutOhmFrax += Number(ohmFraxArray[j].payoutOhmFrax)
                    if(obj.depositCountOhmFrax != 0)
                    {
                        obj.amountOhmFraxAvg = obj.amountOhmFrax / obj.depositCountOhmFrax
                    }
                }
            }
            for(let j = 0; j < ohmLusdArray.length; ++j)
            {  
                if(beginTimestamp <= ohmLusdArray[j].timestamp && ohmLusdArray[j].timestamp < endTimestamp)
                {
                    obj.initBCVOhmLusd = ohmLusdArray[j].initBCV
                    obj.newBCVOhmLusd = ohmLusdArray[j].newBCV
                    obj.adjustmentOhmLusd = ohmLusdArray[j].adjustment

                    obj.amountOhmLusd += Number(ohmLusdArray[j].amountOhmLusd)
                    obj.depositCountOhmLusd += Number(ohmLusdArray[j].depositCountOhmLusd)
                    obj.redeemCountOhmLusd += Number(ohmLusdArray[j].redeemCountOhmLusd)
                    obj.payoutOhmLusd += Number(ohmLusdArray[j].payoutOhmLusd)
                    if(obj.depositCountOhmLusd != 0)
                    {
                        obj.amountOhmLusdAvg = obj.amountOhmLusd / obj.depositCountOhmLusd
                    }
                }
            }
            data.push(obj)
        }
        return data
    }
    catch(err)
    {
        console.log(err)
    }

}