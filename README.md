<div align="center">
  <a href="https://app.olympusdao.finance/#/dashboard" target="_blank">
    <img width="150" src="./__img/android-chrome-192x192.png">
  </a>
  <h1>Olympus Monitoring Subgraph Parsers (Queries)</h1>
</div>
Our «Parsers» are required for creating queries/processing response data to/from our subgraphs so we can utilize the transformed data in our visualizations. We use them on the Front End in <a href="https://github.com/Mycelium-Lab/olympus_frontend/tree/master/src/dataFetch">this</a> section, so most of the code you see in this repo is already there and the latter may even sometimes include a more up-to-date version. Some parsers are yet to be integrated (e.g., Treasury Token Balances) when required. Finally, some parsing (e.g., sOHM index data) is done directly on the Back End, so on the Front End we merely utilize a Back End endpoint and perform minor data mappings. The objective is to transfer all parsing/queries to the Back End as it will allow us to properly integrate Auth logic, which is fully done on our Back End, into our Front End. 

<br></br>

Parsers in this repository are JS (non Back End) parsers only split into 3 groups/folders:
<ul>
<li>main (staking, bonds, rebases)</li>
<li>sushiswap-ohm (ohm price)</li>
<li>treasury (deposits, withdrawals, treasury token balances)</li>
</ul>