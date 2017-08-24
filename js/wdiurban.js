  let convert = function(x)
  {
    if(isNaN(x)) {
      throw new Error('Not a number');
    }
    // adding fs module
    let fs = require('fs');
    // adding readline module
    let readline = require('readline');
    // path for the csv file
    let path = '../inputdata/indicators.csv';
    // var read_stream = fs.createReadStream('');
    // interface to read each line until eof
    let rl = readline.createInterface({
      input: fs.createReadStream(path)
    });
    // created required variables
    let country;
    let type;
    let year;
    let value;
    let count = 0;
    let result = [];
    let ruralPop = 0;
    let urbanPop = 0;
    let ruralPer = 0;
    let urbanPer = 0;
    const re = /,(?=(?:(?:[^']*'){2})*[^']+$)/;
    // var i=0;
    /* rl.on('data', (chunk) => {
    console.log(`Received ${chunk.length} bytes of data.`);
    }); */
    rl.on('line', function(line) {
      // temp.push(line.split('\n'));
      // console.log(temp);
      line = line.split(re);
      // to run it only once of index row
      if(count === 0) {
        // below are the columns indexes taken out by the names
        country = line.indexOf('CountryName');
        type = line.indexOf('IndicatorName');
        year = line.indexOf('Year');
        value = line.indexOf('Value');
        //  console.log(country+ ' '+ type+ ' ' + year+ ' ' +value);
        count = 1; }
        // filter as per requirement
        if(line[country] === 'India') {
          // if(typeof(line[year])===Number){
          if(line[type] === 'Urban population') {
          //  console.log(line[value] + ' ' + line[type] + ' year is ' + line[year]);
          urbanPop = line[value];}
          if(line[type] === 'Rural population') {
          // console.log(line[value] + ' ' + line[type] +' year is ' + line[year]);
          ruralPop = line[value];}
          // condition until both populations are not found while traversing line  by line.
          if(Number(ruralPop) !== 0 && Number(urbanPop) !== 0)
          {
            // total population for one particular year
            let totPop = Number(ruralPop) + Number(urbanPop);
            // formula
            ruralPer = Number(ruralPop / totPop) * 100;
            // adding deciaml limit of 2
            ruralPer = ruralPer.toFixed(2);
            urbanPer = Number(urbanPop / totPop) * 100;
            urbanPer = urbanPer.toFixed(2);
            /*  the below code will push the result into the
            variable as an object which will be written
            into JSON format/file later */
            result.push({country: line[country],
              ruralPop: ruralPer, year: line[year], urbanPop: urbanPer});
            ruralPop = 0;
            urbanPop = 0;
      // console.log('After India condition')
          }
          // console.log(ruralPer + ' is rural percent');
          // console.log(urbanPer + ' is urban percent');
        }
      });
      rl.on('close', function() {
        //  console.log(result);
        //  console.log(result[9]);
        // writting the object into file
        fs.writeFile('../outputdata/wdiurbanParam.json', JSON.stringify(result), (err) =>{
          if(err) {
          throw err;}
          return 'file has been saved';
//          console.log('JSON written successfully')
        });
      });
//      return 'JSON written successfully';
  };
  // convert(2);
  module.exports = convert(2004);
