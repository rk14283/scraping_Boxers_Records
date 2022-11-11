const axios = require('axios')
const { JSDOM } = require('jsdom')
const fs = require('fs')

//breaking from 2 loops

function findRecordTable(tables){
    //this function returns table with th
    for(table of tables){
        const headings = table.querySelectorAll("th")
        for (heading of headings){
        //getting the table with No. and there is only 1
        if(heading.textContent.includes("No.")){
            return table 
        }

        }
    }
    return null; 
}


async function scrape(){
    //console.log('HI'); 
    const url = "https://en.wikipedia.org/wiki/Sugar_Ray_Robinson"; 
    const response = await axios.get(url);
    const html = response.data;  
    //console.log(html); 
    const jsdom = new JSDOM(html)
    const document = jsdom.window.document; 
   // console.log(document); 
    const tables = document.querySelectorAll("table");
    let tableToScrape =  findRecordTable(tables); 
    if (!tableToScrape) return console.log("Table not found for", url)
    console.log(tableToScrape); 
    
    //headings operators 
    const [headings, ...rows] = tableToScrape.querySelectorAll('tr'); 
    console.log(rows)
    //202 for 201 fights and heading 
    //console.log(rows.length)

    let record = []

    for (row of rows){
        //if you get undefined and there is one element do text content, if it is a node list then loop
        const [Number, Result, Record, Opponent, Type,RoundTime, Date, Age, Location, Notes] = 
        row.querySelectorAll('td')

        //all opponents don't have links so better not do a 
        //const opponentName = Opponent.querySelector('td')?.textContent; 
        //const opponentName = Opponent.querySelector('a')?.textContent; 
        const opponentName = Opponent.textContent;
        //console.log(opponentName)
        //console.log(opponentName.length)
        const serialNumber = (Number.textContent); 
        const fightResult = (Result.textContent)
        const tally = (Record.textContent)
        const foughtAgainst = (Opponent.textContent)
        const winType = (Type.textContent)
        const endRound = (RoundTime.textContent)
        const fightDate = (Date.textContent)
        const fighterAge = (Age.textContent)
        const fightLocation = (Location.textContent)
        const remarks = (Notes.textContent)

        //console.log(serialNumber, fightResult,tally,foughtAgainst, winType,endRound,fightDate,fighterAge,fightLocation,remarks); 
 
    const sugarRayRecord = {
        No: serialNumber,
        Result: fightResult,
        Record: tally, 
        Opponent: foughtAgainst,
        Type:    winType,
        Round_Time: endRound, 
        Date: fightDate, 
        Age: fighterAge, 
        Locatin: fightLocation, 
        Notes: remarks
    }; 
    record.push(sugarRayRecord)
    //console.log(sugarRayRecord)
    
}  

  
  console.log(record);
  fs.writeFileSync("sugarRayRecord.json", JSON.stringify(record)); 
  //const recordBoxer = url.match(/^([^0-9]*)$/)[0];  
  //fs.writeFileSync(`${recordBoxer}.json`, JSON.stringify(record));
  
     
}

scrape()
