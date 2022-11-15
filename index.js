const axios = require("axios");
const { JSDOM } = require("jsdom");
const fs = require("fs");

//breaking from 2 loops

function findRecordTable(tables) {
  //this function returns table with th
  for (table of tables) {
    const headings = table.querySelectorAll("th");
    for (heading of headings) {
      //getting the table with No. and there is only 1
      if (heading.textContent.includes("No.")) {
        return table;
      }
    }
  }
  return null;
}

async function scrapeRecordTable(url) {
  //console.log('HI');

  const response = await axios.get(url);
  const html = response.data;
  //console.log(html);
  const jsdom = new JSDOM(html);
  const document = jsdom.window.document;
  // console.log(document);
  const tables = document.querySelectorAll("table");
  let tableToScrape = findRecordTable(tables);
  if (!tableToScrape) return; //console.log("Table not found for", url)
  // console.log(tableToScrape);

  //headings operators
  const [headings, ...rows] = tableToScrape.querySelectorAll("tr");
  //console.log(rows)
  //202 for 201 fights and heading
  //console.log(rows.length)

  let record = [];

  for (row of rows) {
    //if you get undefined and there is one element do text content, if it is a node list then loop
    const [
      Number,
      Result,
      Record,
      Opponent,
      Type,
      RoundTime,
      Date,
      Age,
      Location,
      Notes,
    ] = row.querySelectorAll("td");

    //all opponents don't have links so better not do a
    //const opponentName = Opponent.querySelector('td')?.textContent;
    //const opponentName = Opponent.querySelector('a')?.textContent;
    const opponentName = Opponent.textContent;
    //console.log(opponentName)
    //console.log(opponentName.length)
    const serialNumber = Number?.textContent;
    const fightResult = Result?.textContent;
    const tally = Record?.textContent;
    const foughtAgainst = Opponent?.textContent;
    const winType = Type?.textContent;
    const endRound = RoundTime?.textContent;
    const fightDate = Date?.textContent;
    const fighterAge = Age?.textContent;
    const fightLocation = Location?.textContent;
    const remarks = Notes?.textContent;

    //console.log(serialNumber, fightResult,tally,foughtAgainst, winType,endRound,fightDate,fighterAge,fightLocation,remarks);

    const boxerRecord = {
      No: serialNumber,
      Result: fightResult,
      Record: tally,
      Opponent: foughtAgainst,
      Type: winType,
      Round_Time: endRound,
      Date: fightDate,
      Age: fighterAge,
      Locatin: fightLocation,
      Notes: remarks,
    };
    //console.log(sugarRayRecord)
    record.push(boxerRecord);
  }

  ////regex tested
  // const recordBoxer = url.match(/\d{4}/);
  //const recordBoxer = url.match(/^([^0-9]*)$/);
  // const recordBoxer = url.match(\/([\w%]+))

  const recordBoxer = url.split("https://en.wikipedia.org/wiki/");
  fs.writeFileSync(`${recordBoxer}.json`, JSON.stringify(record));

  //console.log(record);
}

async function scrapeChampions() {
  const response = await axios.get(
    "https://en.wikipedia.org/wiki/List_of_world_welterweight_boxing_champions"
  );
  const html = response.data;
  const jsdom = new JSDOM(html);
  const document = jsdom.window.document;
  const tables = document.querySelectorAll("table");
  const championTables = [];

  for (table of tables) {
    if (table.querySelector("th").textContent.includes("Date won")) {
      championTables.push(table);
    }
  }
  //console.log(championTables);

  const champions = [];
  for (tableToScrape of championTables) {
    const [headings, ...rows] = tableToScrape.querySelectorAll("tr");
    for (row of rows) {
      const cells = row.querySelectorAll("td");
      //fighterLink.push(wikilink);
      //console.log("cells", cells[2]?.textContent);
      const nameCell = cells[2];
      const link = nameCell?.querySelectorAll("a")[1];
      // console.log("link", link?.href);
      if (link) {
        champions.push(link?.href);
      }
    }
  }
  //console.log(champions);
  //   for (const link of champions) {
  //     scrapeRecordTable(`https://en.wikipedia.org${link}`);
  //   }
}

scrapeChampions();
