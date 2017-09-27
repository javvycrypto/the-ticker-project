# the-ticker-project
The current serving endpoint is <code>your_server.com:8080/crowdsale/:contractAddress</code>
Example:
<code>http://127.0.0.1:8080/crowdsale/0xf73f86418fdbF00E40639858752d93572F6F049D</code>

By default it operates on mainnet, to switch to ropsten pass the following argument in the API request:

<code>"network":"ropsten"</code>


# How to run it
1. Clone the project
2. Run <code>npm install</code>
3. Create an account on <a href="https://infura.io/">Infura</a>
4. Place parameters you get from infura in config.json
5. Run <code>node tickerServer.js</code>
6. Send API requests
