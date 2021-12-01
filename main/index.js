// const axios = require('axios')
import {
    getStakesInfoNHous,
    getStakesInfoNDays,
    getStakesInfoNMinutes,
} from './stakes.js'
import {
    getDepositsInfoNHours,
    getDepositsInfoNDays,
    getDepositsInfoNMinutes,
} from './deposits.js'
import {
    getRebasesInfoNDays,
    getRebasesInfoNHours,
    getRebasesInfoNMinutes,
} from './rebases.js'

async function main() {
    // const stakeData = await getStakesInfo(1632268840, 3600, 24)
    // const depositData =
    const deposit = await getRebasesInfoNDays(1636329600, 1636502400, 7)

    for (let i = 0; i < deposit.length; ++i) {
        console.log(deposit[i])
    }
    console.log(deposit.length)
}

main()
