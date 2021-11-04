// const axios = require('axios')
import {getStakesInfoDays, getStakesInfoHour, getStakesInfoMinute, getStakesInfoNHour, getStakesInfoNDays, getStakesInfoNMinute} from './stakes.js'
import {getDepositsInfoDays, getDepositsInfoHours, getDepositsInfoMinutes, getDepositsInfoNHours, getDepositsInfoNDays, getDepositsInfoNMinutes} from './deposits.js'
import {getRebasesInfoDays, getRebasesInfoHours, getRebasesInfoMinutes, getRebasesInfoNHours, getRebasesInfoNMinutes} from './rebases.js'

async function main()
{
    // const stakeData = await getStakesInfo(1632268840, 3600, 24)
    // const depositData = 
    const deposit = await getRebasesInfoNMinutes(1629936000, 1630108800, 120)
    
    for(let i = 0; i < deposit.length; ++i)
    {

        console.log(deposit[i])
        
    }
    console.log(deposit.length)

    
}

main()