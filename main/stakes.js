import axios from 'axios'

/**

    * @dev : Get stakes (days)
    * @param startTimestamp - Start timestamp for query 
    * @param endTime - End timestamp for query

*/
export async function getStakesInfoDays(startTimestamp, endTime)
{
    
    let stakeQuery = `

    {
        stakeYears(first: 100 orderBy:timestamp) {
      
          dayStake(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
      
            id
            amountStaked
            amountUnstaked
            currentStaked
            timestamp
            stakeCount
            unstakeCount
            stakeMax
            unstakeMax
          }
        }
      }
    `

    try
    {
      const stakeData = await axios({
          url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
          method: 'post',
          data: {
            query: stakeQuery
          }
      }) 
      const stakesData = stakeData.data.data.stakeYears
      let data = []
      let stakes = []
      for(let k = 0; k < stakesData.length; ++k)
      {
        for(let i = 0; i < stakesData[k].dayStake.length; ++i)
        {
          let obj = {
          }
          obj.stakeCount = stakesData[k].dayStake[i].stakeCount
          obj.unstakeCount = stakesData[k].dayStake[i].unstakeCount
          obj.amountStaked = stakesData[k].dayStake[i].amountStaked
          obj.amountUnstaked = stakesData[k].dayStake[i].amountUnstaked
          obj.timestamp = stakesData[k].dayStake[i].timestamp
          obj.currentStaked = stakesData[k].dayStake[i].currentStaked
          obj.stakeMax = stakesData[k].dayStake[i].stakeMax
          obj.unstakeMax = stakesData[k].dayStake[i].unstakeMax
          stakes.push(obj)
        }
      }
      
    let beginTimestamp = startTimestamp
    let endTimestamp = startTimestamp + 86400
    let startIndexingTimestamp = 0
    for(let j = 0; j < stakes.length; ++j)
    {
      if(beginTimestamp <= Number(stakes[j].timestamp) && Number(stakes[j].timestamp) < endTimestamp)
      {
        let obj = {
          beginTimestamp: beginTimestamp,
          endTimestamp: endTimestamp
        }
        obj.stakeCount = stakes[j].stakeCount
        obj.unstakeCount = stakes[j].unstakeCount
        obj.amountStaked = stakes[j].amountStaked
        obj.amountUnstaked = stakes[j].amountUnstaked
        obj.currentStaked = stakes[j].currentStaked
        obj.timestamp = stakes[j].timestamp
        obj.stakeMax = stakes[j].stakeMax
        obj.unstakeMax = stakes[j].unstakeMax
        obj.stakeAvg = stakes[j].amountStaked / stakes[j].stakeCount
        obj.unstakeAvg = stakes[j].amountUnstaked / stakes[j].unstakeCount
        obj.unstakedToStakedPercent = 100 * (stakes[j].amountUnstaked/stakes[j].amountStaked)
        obj.unstakedToTotalStakedPercent = 100 * (stakes[j].amountUnstaked / stakes[j].currentStaked)

        beginTimestamp += 86400
        endTimestamp += 86400

        if(startIndexingTimestamp === 0)
        {
          startIndexingTimestamp = stakes[j].timestamp
        }
        data.push(obj)  
      }
      else
      {
        while(endTimestamp <= Number(stakes[j].timestamp))
        {
          let obj = {
            beginTimestamp: beginTimestamp,
            endTimestamp: endTimestamp,
            stakeCount: 0,
            unstakeCount: 0,
            amountStaked: 0,
            amountUnstaked: 0,
            currentStaked: 0,
            stakeMax: 0,
            unstakeMax: 0,
            stakeAvg: 0,
            unstakeAvg: 0,
            unstakedToStakedPercent: 0,
            unstakedToTotalStakedPercent: 0
          }
          
          data.push(obj)
          
          beginTimestamp += 86400
          endTimestamp += 86400
          
        }
        if(beginTimestamp <= Number(stakes[j].timestamp) && Number(stakes[j].timestamp) < endTimestamp )
        {
          let obj = {
            beginTimestamp: beginTimestamp,
            endTimestamp: endTimestamp
          }
          obj.stakeCount = stakes[j].stakeCount
          obj.unstakeCount = stakes[j].unstakeCount
          obj.amountStaked = stakes[j].amountStaked
          obj.amountUnstaked = stakes[j].amountUnstaked
          obj.currentStaked = stakes[j].currentStaked
          obj.timestamp = stakes[j].timestamp
          obj.stakeMax = stakes[j].stakeMax
          obj.unstakeMax = stakes[j].unstakeMax
          obj.stakeAvg = stakes[j].amountStaked / stakes[j].stakeCount
          obj.unstakeAvg = stakes[j].amountUnstaked / stakes[j].unstakeCount
          obj.unstakedToStakedPercent = 100 * (stakes[j].amountUnstaked/stakes[j].amountStaked)
          obj.unstakedToTotalStakedPercent = 100 * (stakes[j].amountUnstaked / stakes[j].currentStaked)
  
          beginTimestamp += 86400
          endTimestamp += 86400
          
          data.push(obj)
        }
        
      }
    }
    while(data.length < (endTime - startTimestamp) / (60*60*24))
    {
      data.push(
        {
          beginTimestamp: beginTimestamp,
          endTimestamp: endTimestamp,
          stakeCount: 0,
          unstakeCount: 0,
          amountStaked: 0,
          amountUnstaked: 0,
          currentStaked: 0,
          stakeMax: 0,
          unstakeMax: 0,
          stakeAvg: 0,
          unstakeAvg: 0,
          unstakedToStakedPercent: 0,
          unstakedToTotalStakedPercent: 0
        }
      )
      beginTimestamp += 86400
      endTimestamp += 86400
    }
    return data
    }
    catch(err)
    {
        console.log(err)
    }
}
/**

    * @dev : Get stakes (N days)
    * @param startTimestamp - Start timestamp for query 
    * @param endTime - End timestamp for query
    * @param days - Number of days

*/
export async function getStakesInfoNDays(startTimestamp, endTime, days)
{
  let stakeQuery = `

  {
      stakeYears(first: 100 orderBy:timestamp) {
    
        dayStake(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
          id
          amountStaked
          amountUnstaked
          currentStaked
          timestamp
          stakeCount
          unstakeCount
          stakeMax
          unstakeMax
        }
      }
    }
  `
  
  try
  {
    const stakeData = await axios({
        url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
        method: 'post',
        data: {
          query: stakeQuery
        }
    }) 
    const stakesData = stakeData.data.data.stakeYears
    let data = []
    let stakes = []
    for(let k = 0; k < stakesData.length; ++k)
    {
      for(let i = 0; i < stakesData[k].dayStake.length; ++i)
      {
      
        let obj = {
        }
        obj.stakeCount = stakesData[k].dayStake[i].stakeCount
        obj.unstakeCount = stakesData[k].dayStake[i].unstakeCount
        obj.amountStaked = stakesData[k].dayStake[i].amountStaked
        obj.amountUnstaked = stakesData[k].dayStake[i].amountUnstaked
        obj.timestamp = stakesData[k].dayStake[i].timestamp
        obj.currentStaked = stakesData[k].dayStake[i].currentStaked
        obj.stakeMax = stakesData[k].dayStake[i].stakeMax
        obj.unstakeMax = stakesData[k].dayStake[i].unstakeMax
        stakes.push(obj)
      }
    }
    
    for(let beginTimestamp = startTimestamp, endTimestamp = startTimestamp + days*86400; beginTimestamp < endTime; beginTimestamp += days*86400, endTimestamp+=days*86400)
    {
      
      let obj = {
        beginTimestamp: beginTimestamp,
        endTimestamp: endTimestamp,
        stakeCount: 0,
        unstakeCount: 0,
        amountStaked: 0,
        amountUnstaked: 0,
        currentStaked: 0,
        stakeMax: 0,
        unstakeMax: 0,
        stakeAvg: 0,
        unstakeAvg: 0,
        unstakedToStakedPercent: 0,
        unstakedToTotalStakedPercent: 0
      }
      for(let j = 0; j < stakes.length; ++j)
      {
        
        if(beginTimestamp <= stakes[j].timestamp && stakes[j].timestamp < endTimestamp)
        {
          obj.stakeCount += Number(stakes[j].stakeCount)
          obj.unstakeCount += Number(stakes[j].unstakeCount)
          obj.amountStaked += Number(stakes[j].amountStaked)
          obj.amountUnstaked += Number(stakes[j].amountUnstaked)
          obj.currentStaked = Number(stakes[j].currentStaked)
          if(stakes[j].stakeMax > obj.stakeMax)
          {
            obj.stakeMax = Number(stakes[j].stakeMax)
          }
          if(stakes[j].unstakeMax > obj.unstakeMax)
          {
            obj.unstakeMax = Number(stakes[j].unstakeMax)
          }
          obj.stakeAvg = obj.amountStaked / obj.stakeCount
          obj.unstakeAvg = obj.amountUnstaked / obj.unstakeCount
          obj.unstakedToStakedPercent = 100 * (obj.amountUnstaked / obj.amountStaked)
          obj.unstakedToTotalStakedPercent = 100 * (obj.amountUnstaked / obj.currentStaked)
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

    * @dev : Get stakes (hours)
    * @param startTimestamp - Start timestamp for query 
    * @param endTime - End timestamp for query

*/
export async function getStakesInfoHour(startTimestamp, endTime)
{
  let stakeQuery = `

  {
      stakeYears(first: 100 orderBy:timestamp) {
    
        dayStake(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
          hourStake(first: 24, orderBy:timestamp)
          {
            id
            amountStaked
            amountUnstaked
            currentStaked
            timestamp
            stakeCount
            unstakeCount
            stakeMax
            unstakeMax
          }
          
        }
      }
    }
  `
  
  try
  {
    const stakeData = await axios({
        url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
        method: 'post',
        data: {
          query: stakeQuery
        }
    }) 
    const stakesData = stakeData.data.data.stakeYears
    let data = []
    let stakes = []
    for(let k = 0; k < stakesData.length; ++k)
    {
      for(let i = 0; i < stakesData[k].dayStake.length; ++i)
      {
        for(let j = 0; j < stakesData[k].dayStake[i].hourStake.length; ++j)
        {
          let obj = {
          }
          obj.stakeCount = stakesData[k].dayStake[i].hourStake[j].stakeCount
          obj.unstakeCount = stakesData[k].dayStake[i].hourStake[j].unstakeCount
          obj.amountStaked = stakesData[k].dayStake[i].hourStake[j].amountStaked
          obj.amountUnstaked = stakesData[k].dayStake[i].hourStake[j].amountUnstaked
          obj.timestamp = stakesData[k].dayStake[i].hourStake[j].timestamp
          obj.currentStaked = stakesData[k].dayStake[i].hourStake[j].currentStaked
          obj.stakeMax = stakesData[k].dayStake[i].hourStake[j].stakeMax
          obj.unstakeMax = stakesData[k].dayStake[i].hourStake[j].unstakeMax
          stakes.push(obj)
        }
      }
    }
    
    let beginTimestamp = startTimestamp
    let endTimestamp = startTimestamp + 3600
    let startIndexingTimestamp = 0
    for(let j = 0; j < stakes.length; ++j)
    {
      if(beginTimestamp <= Number(stakes[j].timestamp) && Number(stakes[j].timestamp) < endTimestamp)
      {
        let obj = {
          beginTimestamp: beginTimestamp,
          endTimestamp: endTimestamp
        }
        obj.stakeCount = stakes[j].stakeCount
        obj.unstakeCount = stakes[j].unstakeCount
        obj.amountStaked = stakes[j].amountStaked
        obj.amountUnstaked = stakes[j].amountUnstaked
        obj.currentStaked = stakes[j].currentStaked
        obj.timestamp = stakes[j].timestamp
        obj.stakeMax = stakes[j].stakeMax
        obj.unstakeMax = stakes[j].unstakeMax
        obj.stakeAvg = stakes[j].amountStaked / stakes[j].stakeCount
        obj.unstakeAvg = stakes[j].amountUnstaked / stakes[j].unstakeCount
        obj.unstakedToStakedPercent = 100 * (stakes[j].amountUnstaked/stakes[j].amountStaked)
        obj.unstakedToTotalStakedPercent = 100 * (stakes[j].amountUnstaked / stakes[j].currentStaked)

        beginTimestamp += 3600
        endTimestamp += 3600

        if(startIndexingTimestamp === 0)
        {
          startIndexingTimestamp = stakes[j].timestamp
        }
        data.push(obj)  
      }
      else
      {
        while(endTimestamp <= Number(stakes[j].timestamp))
        {
          let obj = {
            beginTimestamp: beginTimestamp,
            endTimestamp: endTimestamp,
            stakeCount: 0,
            unstakeCount: 0,
            amountStaked: 0,
            amountUnstaked: 0,
            currentStaked: 0,
            stakeMax: 0,
            unstakeMax: 0,
            stakeAvg: 0,
            unstakeAvg: 0,
            unstakedToStakedPercent: 0,
            unstakedToTotalStakedPercent: 0
          }
          
          data.push(obj)
          
          beginTimestamp += 3600
          endTimestamp += 3600
          
        }
        if(beginTimestamp <= Number(stakes[j].timestamp) && Number(stakes[j].timestamp) < endTimestamp )
        {
          let obj = {
            beginTimestamp: beginTimestamp,
            endTimestamp: endTimestamp
          }
          obj.stakeCount = stakes[j].stakeCount
          obj.unstakeCount = stakes[j].unstakeCount
          obj.amountStaked = stakes[j].amountStaked
          obj.amountUnstaked = stakes[j].amountUnstaked
          obj.currentStaked = stakes[j].currentStaked
          obj.timestamp = stakes[j].timestamp
          obj.stakeMax = stakes[j].stakeMax
          obj.unstakeMax = stakes[j].unstakeMax
          obj.stakeAvg = stakes[j].amountStaked / stakes[j].stakeCount
          obj.unstakeAvg = stakes[j].amountUnstaked / stakes[j].unstakeCount
          obj.unstakedToStakedPercent = 100 * (stakes[j].amountUnstaked/stakes[j].amountStaked)
          obj.unstakedToTotalStakedPercent = 100 * (stakes[j].amountUnstaked / stakes[j].currentStaked)
  
          beginTimestamp += 3600
          endTimestamp += 3600
          
          data.push(obj)
        }
        
      }
    }
    while(data.length < (endTime - startTimestamp) / (60*60))
    {
      data.push(
        {
          beginTimestamp: beginTimestamp,
          endTimestamp: endTimestamp,
          stakeCount: 0,
          unstakeCount: 0,
          amountStaked: 0,
          amountUnstaked: 0,
          currentStaked: 0,
          stakeMax: 0,
          unstakeMax: 0,
          stakeAvg: 0,
          unstakeAvg: 0,
          unstakedToStakedPercent: 0,
          unstakedToTotalStakedPercent: 0
        }
      )
      beginTimestamp += 3600
      endTimestamp += 3600
    }
    return data
  }
  catch(err)
  {
      console.log(err)
  }
    
}
/**

    * @dev : Get stakes (N hours)
    * @param startTimestamp - Start timestamp for query 
    * @param endTime - End timestamp for query
    * @param hours - Number of hours

*/
export async function getStakesInfoNHour(startTimestamp, endTime, hours)
{
  let stakeQuery = `

  {
      stakeYears(first: 100 orderBy:timestamp) {
    
        dayStake(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) {
          hourStake(first: 24, orderBy:timestamp)
          {
            id
            amountStaked
            amountUnstaked
            currentStaked
            timestamp
            stakeCount
            unstakeCount
            stakeMax
            unstakeMax
          }
          
        }
      }
    }
  `
  
  try
  {
    const stakeData = await axios({
        url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
        method: 'post',
        data: {
          query: stakeQuery
        }
    }) 
    const stakesData = stakeData.data.data.stakeYears
    let data = []
    let stakes = []
    for(let k = 0; k < stakesData.length; ++k)
    {
      for(let i = 0; i < stakesData[k].dayStake.length; ++i)
      {
        for(let j = 0; j < stakesData[k].dayStake[i].hourStake.length; ++j)
        {
          let obj = {
          }
          obj.stakeCount = stakesData[k].dayStake[i].hourStake[j].stakeCount
          obj.unstakeCount = stakesData[k].dayStake[i].hourStake[j].unstakeCount
          obj.amountStaked = stakesData[k].dayStake[i].hourStake[j].amountStaked
          obj.amountUnstaked = stakesData[k].dayStake[i].hourStake[j].amountUnstaked
          obj.timestamp = stakesData[k].dayStake[i].hourStake[j].timestamp
          obj.currentStaked = stakesData[k].dayStake[i].hourStake[j].currentStaked
          obj.stakeMax = stakesData[k].dayStake[i].hourStake[j].stakeMax
          obj.unstakeMax = stakesData[k].dayStake[i].hourStake[j].unstakeMax
          stakes.push(obj)
        }
      }
    }
    
    for(let beginTimestamp = startTimestamp, endTimestamp = startTimestamp + hours*3600; beginTimestamp < endTime; beginTimestamp += hours*3600, endTimestamp+=hours*3600)
    {
      
      let obj = {
        beginTimestamp: beginTimestamp,
        endTimestamp: endTimestamp,
        stakeCount: 0,
        unstakeCount: 0,
        amountStaked: 0,
        amountUnstaked: 0,
        currentStaked: 0,
        stakeMax: 0,
        unstakeMax: 0,
        stakeAvg: 0,
        unstakeAvg: 0,
        unstakedToStakedPercent: 0,
        unstakedToTotalStakedPercent: 0
      }
      for(let j = 0; j < stakes.length; ++j)
      {
        
        if(beginTimestamp <= stakes[j].timestamp && stakes[j].timestamp < endTimestamp)
        {
          obj.stakeCount += Number(stakes[j].stakeCount)
          obj.unstakeCount += Number(stakes[j].unstakeCount)
          obj.amountStaked += Number(stakes[j].amountStaked)
          obj.amountUnstaked += Number(stakes[j].amountUnstaked)
          obj.currentStaked = Number(stakes[j].currentStaked)
          if(stakes[j].stakeMax > obj.stakeMax)
          {
            obj.stakeMax = Number(stakes[j].stakeMax)
          }
          if(stakes[j].unstakeMax > obj.unstakeMax)
          {
            obj.unstakeMax = Number(stakes[j].unstakeMax)
          }
          obj.stakeAvg = obj.amountStaked / obj.stakeCount
          obj.unstakeAvg = obj.amountUnstaked / obj.unstakeCount
          obj.unstakedToStakedPercent = 100 * (obj.amountUnstaked / obj.amountStaked)
          obj.unstakedToTotalStakedPercent = 100 * (obj.amountUnstaked / obj.currentStaked)
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

    * @dev : Get stakes (minutes)
    * @param startTimestamp - Start timestamp for query 
    * @param endTime - End timestamp for query

*/
export async function getStakesInfoMinute(startTimestamp, endTime)
{
  let stakeQuery = `

  {
      stakeYears(first: 100 orderBy:timestamp) {
    
        dayStake(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} } ) {
          hourStake(first: 24, orderBy:timestamp)
          {
            minuteStake(first:60 orderBy:timestamp)
            {
              id
              amountStaked
              amountUnstaked
              currentStaked
              timestamp
              stakeCount
              unstakeCount
              stakeMax
              unstakeMax
            }
          }
          
        }
      }
    }
  `

  try
  {
    const stakeData = await axios({
      url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
      method: 'post',
      data: {
        query: stakeQuery
      }
    }) 
    const stakesData = stakeData.data.data.stakeYears
    let data = []
    let stakes = []
    for(let k = 0; k < stakesData.length; ++k)
    {
      for(let i = 0; i < stakesData[k].dayStake.length; ++i)
      {
        for(let j = 0; j < stakesData[k].dayStake[i].hourStake.length; ++j)
        {
          for(let c = 0; c < stakesData[k].dayStake[i].hourStake[j].minuteStake.length; ++c)
          {
            let obj = {
            }
            obj.stakeCount = stakesData[k].dayStake[i].hourStake[j].minuteStake[c].stakeCount
            obj.unstakeCount = stakesData[k].dayStake[i].hourStake[j].minuteStake[c].unstakeCount
            obj.amountStaked = stakesData[k].dayStake[i].hourStake[j].minuteStake[c].amountStaked
            obj.amountUnstaked = stakesData[k].dayStake[i].hourStake[j].minuteStake[c].amountUnstaked
            obj.timestamp = stakesData[k].dayStake[i].hourStake[j].minuteStake[c].timestamp
            obj.currentStaked = stakesData[k].dayStake[i].hourStake[j].minuteStake[c].currentStaked
            obj.stakeMax = stakesData[k].dayStake[i].hourStake[j].minuteStake[c].stakeMax
            obj.unstakeMax = stakesData[k].dayStake[i].hourStake[j].minuteStake[c].unstakeMax
            stakes.push(obj)
          }
        }
      }
    }
    
    let beginTimestamp = startTimestamp
    let endTimestamp = startTimestamp + 60
    let startIndexingTimestamp = 0
    for(let j = 0; j < stakes.length; ++j)
    {
      if(beginTimestamp <= Number(stakes[j].timestamp) && Number(stakes[j].timestamp) < endTimestamp)
      {
        let obj = {
          beginTimestamp: beginTimestamp,
          endTimestamp: endTimestamp
        }
        obj.stakeCount = stakes[j].stakeCount
        obj.unstakeCount = stakes[j].unstakeCount
        obj.amountStaked = stakes[j].amountStaked
        obj.amountUnstaked = stakes[j].amountUnstaked
        obj.currentStaked = stakes[j].currentStaked
        obj.timestamp = stakes[j].timestamp
        obj.stakeMax = stakes[j].stakeMax
        obj.unstakeMax = stakes[j].unstakeMax
        obj.stakeAvg = stakes[j].amountStaked / stakes[j].stakeCount
        obj.unstakeAvg = stakes[j].amountUnstaked / stakes[j].unstakeCount
        obj.unstakedToStakedPercent = 100 * (stakes[j].amountUnstaked/stakes[j].amountStaked)
        obj.unstakedToTotalStakedPercent = 100 * (stakes[j].amountUnstaked / stakes[j].currentStaked)

        beginTimestamp += 60
        endTimestamp += 60

        if(startIndexingTimestamp === 0)
        {
          startIndexingTimestamp = stakes[j].timestamp
        }
        data.push(obj)  
      }
      else
      {
        while(endTimestamp <= Number(stakes[j].timestamp))
        {
          let obj = {
            beginTimestamp: beginTimestamp,
            endTimestamp: endTimestamp,
            stakeCount: 0,
            unstakeCount: 0,
            amountStaked: 0,
            amountUnstaked: 0,
            currentStaked: 0,
            stakeMax: 0,
            unstakeMax: 0,
            stakeAvg: 0,
            unstakeAvg: 0,
            unstakedToStakedPercent: 0,
            unstakedToTotalStakedPercent: 0
          }
          
          data.push(obj)
          
          beginTimestamp += 60
          endTimestamp += 60
          
        }
        if(beginTimestamp <= Number(stakes[j].timestamp) && Number(stakes[j].timestamp) < endTimestamp )
        {
          let obj = {
            beginTimestamp: beginTimestamp,
            endTimestamp: endTimestamp
          }
          obj.stakeCount = stakes[j].stakeCount
          obj.unstakeCount = stakes[j].unstakeCount
          obj.amountStaked = stakes[j].amountStaked
          obj.amountUnstaked = stakes[j].amountUnstaked
          obj.currentStaked = stakes[j].currentStaked
          obj.timestamp = stakes[j].timestamp
          obj.stakeMax = stakes[j].stakeMax
          obj.unstakeMax = stakes[j].unstakeMax
          obj.stakeAvg = stakes[j].amountStaked / stakes[j].stakeCount
          obj.unstakeAvg = stakes[j].amountUnstaked / stakes[j].unstakeCount
          obj.unstakedToStakedPercent = 100 * (stakes[j].amountUnstaked/stakes[j].amountStaked)
          obj.unstakedToTotalStakedPercent = 100 * (stakes[j].amountUnstaked / stakes[j].currentStaked)
  
          beginTimestamp += 60
          endTimestamp += 60
          
          data.push(obj)
        }
        
      }
    }
    while(data.length < (endTime - startTimestamp) / 60)
    {
      data.push(
        {
          beginTimestamp: beginTimestamp,
          endTimestamp: endTimestamp,
          stakeCount: 0,
          unstakeCount: 0,
          amountStaked: 0,
          amountUnstaked: 0,
          currentStaked: 0,
          stakeMax: 0,
          unstakeMax: 0,
          stakeAvg: 0,
          unstakeAvg: 0,
          unstakedToStakedPercent: 0,
          unstakedToTotalStakedPercent: 0
        }
      )
      beginTimestamp += 60
      endTimestamp += 60
    }
    return data
  }
  catch(err)
  {
    console.log(err)
  }   
}

/**

    * @dev : Get stakes (N minutes)
    * @param startTimestamp - Start timestamp for query 
    * @param endTime - End timestamp for query
    * @param minutes - Number of minutes

*/
export async function getStakesInfoNMinute(startTimestamp, endTime, minutes)
{
  let stakeQuery = `

  {
      stakeYears(first: 100 orderBy:timestamp) {
    
        dayStake(first: 365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }) 
        {
          hourStake(first: 24, orderBy:timestamp)
          {
            minuteStake(first: 60 orderBy:timestamp)
            {
              id
              amountStaked
              amountUnstaked
              currentStaked
              timestamp
              stakeCount
              unstakeCount
              stakeMax
              unstakeMax  
            }
          }
        }
      }
    }
  `
  
  try
  {
    const stakeData = await axios({
        url: 'https://api.thegraph.com/subgraphs/name/limenal/olympus-stake',
        method: 'post',
        data: {
          query: stakeQuery
        }
    }) 
    const stakesData = stakeData.data.data.stakeYears
    let data = []
    let stakes = []
    for(let k = 0; k < stakesData.length; ++k)
    {
      for(let i = 0; i < stakesData[k].dayStake.length; ++i)
      {
        for(let j = 0; j < stakesData[k].dayStake[i].hourStake.length; ++j)
        {
          for(let c = 0; c < stakesData[k].dayStake[i].hourStake[j].minuteStake.length; ++c)
          {
            let obj = {
            }
            obj.stakeCount = stakesData[k].dayStake[i].hourStake[j].minuteStake[c].stakeCount
            obj.unstakeCount = stakesData[k].dayStake[i].hourStake[j].minuteStake[c].unstakeCount
            obj.amountStaked = stakesData[k].dayStake[i].hourStake[j].minuteStake[c].amountStaked
            obj.amountUnstaked = stakesData[k].dayStake[i].hourStake[j].minuteStake[c].amountUnstaked
            obj.timestamp = stakesData[k].dayStake[i].hourStake[j].minuteStake[c].timestamp
            obj.currentStaked = stakesData[k].dayStake[i].hourStake[j].minuteStake[c].currentStaked
            obj.stakeMax = stakesData[k].dayStake[i].hourStake[j].minuteStake[c].stakeMax
            obj.unstakeMax = stakesData[k].dayStake[i].hourStake[j].minuteStake[c].unstakeMax
            stakes.push(obj)
          }
        }
      }
    }
    
    for(let beginTimestamp = startTimestamp, endTimestamp = startTimestamp + minutes*60; beginTimestamp < endTime; beginTimestamp += minutes*60, endTimestamp+=minutes*60)
    {
      
      let obj = {
        beginTimestamp: beginTimestamp,
        endTimestamp: endTimestamp,
        stakeCount: 0,
        unstakeCount: 0,
        amountStaked: 0,
        amountUnstaked: 0,
        currentStaked: 0,
        stakeMax: 0,
        unstakeMax: 0,
        stakeAvg: 0,
        unstakeAvg: 0,
        unstakedToStakedPercent: 0,
        unstakedToTotalStakedPercent: 0
      }
      for(let j = 0; j < stakes.length; ++j)
      {
        
        if(beginTimestamp <= stakes[j].timestamp && stakes[j].timestamp < endTimestamp)
        {
          obj.stakeCount += Number(stakes[j].stakeCount)
          obj.unstakeCount += Number(stakes[j].unstakeCount)
          obj.amountStaked += Number(stakes[j].amountStaked)
          obj.amountUnstaked += Number(stakes[j].amountUnstaked)
          obj.currentStaked = Number(stakes[j].currentStaked)
          if(stakes[j].stakeMax > obj.stakeMax)
          {
            obj.stakeMax = Number(stakes[j].stakeMax)
          }
          if(stakes[j].unstakeMax > obj.unstakeMax)
          {
            obj.unstakeMax = Number(stakes[j].unstakeMax)
          }
          obj.stakeAvg = obj.amountStaked / obj.stakeCount
          obj.unstakeAvg = obj.amountUnstaked / obj.unstakeCount
          obj.unstakedToStakedPercent = 100 * (obj.amountUnstaked / obj.amountStaked)
          obj.unstakedToTotalStakedPercent = 100 * (obj.amountUnstaked / obj.currentStaked)
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
