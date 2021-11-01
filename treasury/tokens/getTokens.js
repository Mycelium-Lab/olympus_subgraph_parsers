import axios from 'axios'
import { token } from '../config.js';

// graphql request for the Graph
const query=
`
{
    tokens(first:1000){
         id
       }
 }
`


/**
 * 
 * @returns all using tokens
 */
export async function getTokens(){
    try{
        return ( await getTokensFromGraph()).map(function(token){
            return token.id
        });
    }
    catch(err)
    {
        console.log(err)
    }
}




async function getTokensFromGraph(){
    try{
        const dayData = await axios({
            url: `https://api.thegraph.com/subgraphs/id/${token}`,//QmRpuXnecL1xjHgUUMSBaeok9Ggkpdep9KJNMLJxSbDvxZ
            method: 'post',
            data: {
              query: query
            }
          })
        return dayData.data.data.tokens;
    }
    catch(err)
    {
        console.log(err)
    }
}