const fs = require('fs');
const { parse } = require('csv-parse/sync');

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
    const csvContent = fs.readFileSync(csvFile, 'utf8');
    const records = parse(csvContent, {
        columns: true,
        skip_empty_lines: true
    });

    const jsonOutput = { data: records };
    fs.writeFileSync(jsonFile, JSON.stringify(jsonOutput, null, 2));
    console.log('Done, bro—JSON’s straight fire!');
} catch (err) {
    console.error('Crash alert, bro:', err.message);
}