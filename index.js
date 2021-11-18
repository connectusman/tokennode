



const axios = require('axios')
const cheerio = require('cheerio');
var list = [];
var tokholders = [];
async function scraper(res) {
    console.log("********************************\n")

            const poolurl = "https://bscscan.com/address/0x07ddae60a99421eb948ae5f299117f8f8fe86a66"
            const page2 = await axios.get(poolurl)
            const $2 = cheerio.load(page2.data)
            var price = []
            var symbol = []
            var tokenaddress = [];
            var lpaddress = "";
            var contractvarified = false
            var holders = 0

            var values = $2('#ContentPlaceHolder1_tokenbalance').find('span[class="list-amount link-hover__item hash-tag hash-tag--md text-truncate"]')
            var priceandname = $2(values[0]).text().trim().split(' ')
            var alltok = ""
            priceandname[0].split(',').forEach(tok => {
                alltok += tok
            })
            price.push(Number(alltok))
            symbol.push(priceandname[1])
            priceandname = $2(values[1]).text().trim().split(' ')
            alltok = ""
            priceandname[0].split(',').forEach(tok => {
                alltok += tok
            })
            price.push(Number(alltok))
            symbol.push(priceandname[1])
            
                values = $2('#ContentPlaceHolder1_tokenbalance').find('a[class="link-hover d-flex justify-content-between align-items-center"]')
                var tokenandlp = $2(values[0]).attr("href")
                tokenaddress.push(tokenandlp.split("/token/")[1].split("?a=")[0])
                lpaddress = tokenandlp.split("/token/")[1].split("?a=")[1]
                tokenandlp = $2(values[1]).attr("href")
                tokenaddress.push(tokenandlp.split("/token/")[1].split("?a=")[0])

                const pageholder = await axios.get("https://bscscan.com/token/tokenholderchart/" + tokenaddress[1])
                const $pt2 = cheerio.load(pageholder.data)
                holders = Number($pt2('div[class="col-md-6 u-ver-divider u-ver-divider--left u-ver-divider--none-md"] > span').text().split("Token Holders: ")[1])
                const pagetoken = await axios.get("https://bscscan.com/token/" + tokenaddress[1] + "#balances")
                const $pt = cheerio.load(pagetoken.data)
                contractvarified = $pt('#ContentPlaceHolder1_tabReadContract').text().length > 0
                const sup=$pt('span[class="hash-tag text-truncate"]').text().split(',');
                var supply='';
                for(let i=0;i<sup.length;i++)
                {
                    supply+=sup[i];
                }
                //console.log(list.includes(tokenaddress[1]) + "    " + tokenaddress[1])
                
                    
                        console.log(symbol[0] + " " + price[0] + "    " + tokenaddress[0])
                        console.log(symbol[1] + " " + price[1] + "    " + tokenaddress[1])
                        console.log("holders: " + holders + "   varified:" + contractvarified)
                        console.log("Increase:" + holders / tokholders[list.indexOf(tokenaddress[1])])

                
                //else
                //console.log("less than 5 holder:"+holders)

            
            //else
            //	console.log("less than 0.01 BNB liquidity")
            let tp=price[0]/price[1]
            res.status(201).send({"holders":holders,"price":tp,"marketcap":tp*Number(supply),supply:supply})
      
}


const express = require('express')
const app = express();
var PORT = process.env.PORT|5000;
const cors = require('cors');
app.use(cors());
app.use(express.json())


app.get('/getStat', (req, res) => {
    scraper(res);
    
})
app.listen(PORT, () => {
    console.log("listening on port:" + PORT)
})