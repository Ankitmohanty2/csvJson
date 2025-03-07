const fs = require('fs');

const args = process.argv;
let csvFile, jsonFile;

if (args.length === 4) {
    csvFile = args[2];
    jsonFile = args[3];
} else if (args.length === 3) {
    csvFile = args[2];
    jsonFile = 'output.json';
} else {
    console.log('Usage - node csvtojson.js inputfile.csv output.json');
    process.exit(1);
}

try {
    const fileContent = fs.readFileSync(csvFile, 'utf8').trim().split('\n');
    const headers = fileContent[0].split(',');

    const data = [];
    for (let i = 1; i < fileContent.length; i++) {
        const line = fileContent[i].split(',');
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = line[j] || ''; // Handle empty values
        }
        data.push(obj);
    }

    const jsonOutput = { data };
    fs.writeFileSync(jsonFile, JSON.stringify(jsonOutput, null, 2));
    console.log('Done, bro—JSON’s tight now!');
} catch (err) {
    console.error('Something’s off, bro:', err.message);
}