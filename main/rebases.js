import axios from 'axios'

/**

    * @dev : Get rebases (days)
    * @param startTimestamp - Start timestamp for query 
    * @param endTime - End timestamp for query

*/
export async function getRebasesInfoDays(startTimestamp, endTime)
{
    
    let rebaseQuery = `

    {
        rebaseYears(first: 3){
          dayRebase(first:365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }){
            percentage
            id
            timestamp
          }
        }
        
      }
      
    `
    try
    {
      const rebaseData = await axios({
          url: 'https://api.thegraph.com/subgraphs/id/QmVknJSJUdQEALEBciLHGoaTBQB6ndAxMViKcsjQAjSmne',
          method: 'post',
          data: {
            query: rebaseQuery
          }
      }) 
      const rebasesData = rebaseData.data.data.rebaseYears
      let data = []
      let lastApy = 0
      let resData = []
      for(let k = 0; k < rebasesData.length; ++k)
      {
        for(let i = 0; i < rebasesData[k].dayRebase.length; ++i)
        {
          let obj = {}
          obj.percentage = rebasesData[k].dayRebase[i].percentage
          let apy = Math.pow((1 + Number(rebasesData[k].dayRebase[i].percentage)), 1095)
          obj.apy = apy
          obj.timestamp = rebasesData[k].dayRebase[i].timestamp
          data.push(obj)
        }
      }

      let prevPercentage = 0
      let prevApy = 0
      for(let beginTimestamp = startTimestamp, endTimestamp = startTimestamp + 86400; beginTimestamp < endTime; beginTimestamp += 86400, endTimestamp+= 86400)
      {
        
        let obj = {
          beginTimestamp: beginTimestamp,
          endTimestamp: endTimestamp,
          percentage: prevPercentage,
          apy: prevApy,
        }
        for(let j = 0; j < data.length; ++j)
        {
          if(beginTimestamp <= data[j].timestamp && data[j].timestamp < endTimestamp)
          {
            if(Number(data[j].apy) < 1000)
            {
              obj.apy = data[j].apy
              obj.percentage = data[j].percentage
              prevPercentage = data[j].percentage
              prevApy = data[j].apy
            }            
          }
        }
        resData.push(obj)
      } 
      return resData
    }
    catch(err)
    {
        console.log(err)
    }
}

export async function getRebasesInfoNDays(startTimestamp, endTime, days)
{
    
    let rebaseQuery = `

    {
        rebaseYears(first: 3){
          dayRebase(first:365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }){
            percentage
            id
            timestamp
          }
        }
      }
      
    `
    try
    {
      const rebaseData = await axios({
          url: 'https://api.thegraph.com/subgraphs/id/QmVknJSJUdQEALEBciLHGoaTBQB6ndAxMViKcsjQAjSmne',
          method: 'post',
          data: {
            query: rebaseQuery
          }
      }) 
      const rebasesData = rebaseData.data.data.rebaseYears
      let data = []
      let resData = []
      for(let k = 0; k < rebasesData.length; ++k)
      {
        for(let i = 0; i < rebasesData[k].dayRebase.length; ++i)
        {
          
            let obj = {}
            obj.percentage = rebasesData[k].dayRebase[i].percentage
            obj.timestamp = rebasesData[k].dayRebase[i].timestamp
            data.push(obj)  
          
        }
      }
      let prevPercentage = 0
      let prevApy = 0
      for(let beginTimestamp = startTimestamp, endTimestamp = startTimestamp + days*86400; beginTimestamp < endTime; beginTimestamp += days*86400, endTimestamp+= days*86400)
      {
        let rebasesCount = 0 
        let percentageSum = 0

        let obj = {
          beginTimestamp: beginTimestamp,
          endTimestamp: endTimestamp,
          percentage: prevPercentage,
          apy: prevApy,
        }
        for(let j = 0; j < data.length; ++j)
        {
          if(beginTimestamp <= data[j].timestamp && data[j].timestamp < endTimestamp)
          {
            rebasesCount++
            percentageSum += data[j].percentage
          }
        }
        let apy = Math.pow((1 + (Number(percentageSum)/rebasesCount)), 1095)
        if(apy < 1000)
        {
          obj.apy = apy
          obj.percentage = Number(percentageSum)/rebasesCount
          prevPercentage = Number(percentageSum)/rebasesCount
          prevApy = apy
        }

        resData.push(obj)
      }      
      return resData
    }
    catch(err)
    {
      console.log(err)
    }
}


export async function getRebasesInfoHours(startTimestamp, endTime)
{
    
    let rebaseQuery = `

    {
        rebaseYears(first: 3){
          dayRebase(first:365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }){
            hourRebase(first: 24 orderBy:timestamp)
            {
              
                percentage
                id
                timestamp
              
            }
          }
        }
      }
      
    `
    try
    {
      const rebaseData = await axios({
          url: 'https://api.thegraph.com/subgraphs/id/QmVknJSJUdQEALEBciLHGoaTBQB6ndAxMViKcsjQAjSmne',
          method: 'post',
          data: {
            query: rebaseQuery
          }
      }) 
      const rebasesData = rebaseData.data.data.rebaseYears
      let data = []
      let resData = []
      for(let k = 0; k < rebasesData.length; ++k)
      {
        for(let i = 0; i < rebasesData[k].dayRebase.length; ++i)
        {
          for(let j = 0; j < rebasesData[k].dayRebase[i].hourRebase.length; ++j)
          {
            let obj = {}
            obj.percentage = rebasesData[k].dayRebase[i].hourRebase[j].percentage
            let apy = Math.pow((1 + Number(rebasesData[k].dayRebase[i].hourRebase[j].percentage)), 1095)
            
            obj.apy = apy
              
            obj.timestamp = rebasesData[k].dayRebase[i].hourRebase[j].timestamp
            data.push(obj)  
          }
        }
      }
      let prevPercentage = 0
      let prevApy = 0
      for(let beginTimestamp = startTimestamp, endTimestamp = startTimestamp + 3600; beginTimestamp < endTime; beginTimestamp += 3600, endTimestamp+= 3600)
      {
        
        let obj = {
          beginTimestamp: beginTimestamp,
          endTimestamp: endTimestamp,
          percentage: prevPercentage,
          apy: prevApy,
        }
        for(let j = 0; j < data.length; ++j)
        {
          if(beginTimestamp <= data[j].timestamp && data[j].timestamp < endTimestamp)
          {
            if(Number(data[j].apy) < 1000)
            {
              obj.apy = data[j].apy
              obj.percentage = data[j].percentage
              prevPercentage = data[j].percentage
              prevApy = data[j].apy
            }            
          }
        }
        resData.push(obj)
      }      
      return resData
    }
    catch(err)
    {
      console.log(err)
    }
}

export async function getRebasesInfoNHours(startTimestamp, endTime, hours)
{
    
    let rebaseQuery = `

    {
        rebaseYears(first: 3){
          dayRebase(first:365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }){
            hourRebase(first: 24 orderBy:timestamp)
            {
              
                percentage
                id
                timestamp
              
            }
          }
        }
      }
      
    `
    try
    {
      const rebaseData = await axios({
          url: 'https://api.thegraph.com/subgraphs/id/QmVknJSJUdQEALEBciLHGoaTBQB6ndAxMViKcsjQAjSmne',
          method: 'post',
          data: {
            query: rebaseQuery
          }
      }) 
      const rebasesData = rebaseData.data.data.rebaseYears
      let data = []
      let resData = []
      for(let k = 0; k < rebasesData.length; ++k)
      {
        for(let i = 0; i < rebasesData[k].dayRebase.length; ++i)
        {
          for(let j = 0; j < rebasesData[k].dayRebase[i].hourRebase.length; ++j)
          {
            let obj = {}
            obj.percentage = rebasesData[k].dayRebase[i].hourRebase[j].percentage
              
            obj.timestamp = rebasesData[k].dayRebase[i].hourRebase[j].timestamp
            data.push(obj)  
          }
        }
      }
      let prevPercentage = 0
      let prevApy = 0
      for(let beginTimestamp = startTimestamp, endTimestamp = startTimestamp + hours*3600; beginTimestamp < endTime; beginTimestamp += hours*3600, endTimestamp+= hours*3600)
      {
        let rebasesCount = 0 
        let percentageSum = 0

        let obj = {
          beginTimestamp: beginTimestamp,
          endTimestamp: endTimestamp,
          percentage: prevPercentage,
          apy: prevApy,
        }
        for(let j = 0; j < data.length; ++j)
        {
          if(beginTimestamp <= data[j].timestamp && data[j].timestamp < endTimestamp)
          {
            rebasesCount++
            percentageSum += data[j].percentage
          }
        }
        let apy = Math.pow((1 + (Number(percentageSum)/rebasesCount)), 1095)
        if(apy < 1000)
        {
          obj.apy = apy
          obj.percentage = Number(percentageSum)/rebasesCount
          prevPercentage = Number(percentageSum)/rebasesCount
          prevApy = apy
        }

        resData.push(obj)
      }      
      return resData
    }
    catch(err)
    {
      console.log(err)
    }
}

export async function getRebasesInfoMinutes(startTimestamp, endTime)
{
    
    let rebaseQuery = `

    {
        rebaseYears(first: 3){
          dayRebase(first:365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }){
            hourRebase(first: 24 orderBy:timestamp)
            {
              minuteRebase(first:60 orderBy:timestamp)
              {
                percentage
                id
                timestamp
  
              }
            }
          }
        }
      }
      
    `
    try
    {
      const rebaseData = await axios({
          url: 'https://api.thegraph.com/subgraphs/id/QmVknJSJUdQEALEBciLHGoaTBQB6ndAxMViKcsjQAjSmne',
          method: 'post',
          data: {
            query: rebaseQuery
          }
      }) 
      const rebasesData = rebaseData.data.data.rebaseYears
      let data = []
      let resData = []
      for(let k = 0; k < rebasesData.length; ++k)
      {
        for(let i = 0; i < rebasesData[k].dayRebase.length; ++i)
        {
          for(let j = 0; j < rebasesData[k].dayRebase[i].hourRebase.length; ++j)
          {
            for(let c = 0; c < rebasesData[k].dayRebase[i].hourRebase[j].minuteRebase.length; ++c)
            {
              let obj = {}
              obj.percentage = rebasesData[k].dayRebase[i].hourRebase[j].minuteRebase[c].percentage
              let apy = Math.pow((1 + Number(rebasesData[k].dayRebase[i].hourRebase[j].minuteRebase[c].percentage)), 1095)
              
              obj.apy = apy
                
              obj.timestamp = rebasesData[k].dayRebase[i].hourRebase[j].minuteRebase[c].timestamp
              data.push(obj)  
  
            }
          }
        }
      }
      let prevPercentage = 0
      let prevApy = 0
      for(let beginTimestamp = startTimestamp, endTimestamp = startTimestamp + 60; beginTimestamp < endTime; beginTimestamp += 60, endTimestamp+= 60)
      {
        let obj = {
          beginTimestamp: beginTimestamp,
          endTimestamp: endTimestamp,
          percentage: prevPercentage,
          apy: prevApy,
        }
        for(let j = 0; j < data.length; ++j)
        {
          if(beginTimestamp <= data[j].timestamp && data[j].timestamp < endTimestamp)
          {
            if(Number(data[j].apy) < 1000)
            {
              obj.apy = data[j].apy
              obj.percentage = data[j].percentage
              prevPercentage = data[j].percentage
              prevApy = data[j].apy
            }            
          }
        }
        resData.push(obj)
      }      
      return resData
    }
    catch(err)
    {
      console.log(err)
    }
}

export async function getRebasesInfoNMinutes(startTimestamp, endTime, minutes)
{
    
    let rebaseQuery = `

    {
        rebaseYears(first: 3){
          dayRebase(first:365 orderBy:timestamp where:{timestamp_gte: ${startTimestamp}, timestamp_lt:${endTime} }){
            hourRebase(first: 24 orderBy:timestamp)
            {
              minuteRebase(first:60 orderBy:timestamp)
              {
                percentage
                id
                timestamp
  
              }
            }
          }
        }
      }
      
    `
    try
    {
      const rebaseData = await axios({
          url: 'https://api.thegraph.com/subgraphs/id/QmVknJSJUdQEALEBciLHGoaTBQB6ndAxMViKcsjQAjSmne',
          method: 'post',
          data: {
            query: rebaseQuery
          }
      }) 
      const rebasesData = rebaseData.data.data.rebaseYears
      let data = []
      let resData = []
      for(let k = 0; k < rebasesData.length; ++k)
      {
        for(let i = 0; i < rebasesData[k].dayRebase.length; ++i)
        {
          for(let j = 0; j < rebasesData[k].dayRebase[i].hourRebase.length; ++j)
          {
            for(let c = 0; c < rebasesData[k].dayRebase[i].hourRebase[j].minuteRebase.length; ++c)
            {
              let obj = {}
              obj.percentage = rebasesData[k].dayRebase[i].hourRebase[j].minuteRebase[c].percentage
              let apy = Math.pow((1 + Number(rebasesData[k].dayRebase[i].hourRebase[j].minuteRebase[c].percentage)), 1095)
              
              obj.apy = apy
                
              obj.timestamp = rebasesData[k].dayRebase[i].hourRebase[j].minuteRebase[c].timestamp
              data.push(obj)  
  
            }
          }
        }
      }
      let prevPercentage = 0
      let prevApy = 0
      for(let beginTimestamp = startTimestamp, endTimestamp = startTimestamp + minutes*60; beginTimestamp < endTime; beginTimestamp += minutes*60, endTimestamp+= minutes*60)
      {
        let rebasesCount = 0 
        let percentageSum = 0

        let obj = {
          beginTimestamp: beginTimestamp,
          endTimestamp: endTimestamp,
          percentage: prevPercentage,
          apy: prevApy,
        }
        for(let j = 0; j < data.length; ++j)
        {
          if(beginTimestamp <= data[j].timestamp && data[j].timestamp < endTimestamp)
          {
            rebasesCount++
            percentageSum += data[j].percentage
          }
        }
        let apy = Math.pow((1 + (Number(percentageSum)/rebasesCount)), 1095)
        if(apy < 1000)
        {
          obj.apy = apy
          obj.percentage = Number(percentageSum)/rebasesCount
          prevPercentage = Number(percentageSum)/rebasesCount
          prevApy = apy
        }

        resData.push(obj)
      }      
      return resData
    }
    catch(err)
    {
      console.log(err)
    }
}