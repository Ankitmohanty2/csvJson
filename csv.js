const fs = require('fs');

const flattenObject = (obj, parentKey = '', result = {}) => {
    for (const [key, value] of Object.entries(obj)) {
        const newKey = parentKey ? `${parentKey}.${key}` : key;
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
            flattenObject(value, newKey, result);
        } else {
            result[newKey] = value;
        }
    }
    return result;
};

const escapeCSV = (value) => {
    if (value === null || value === undefined) {
        return '""';
    }
    
    const stringValue = String(value);
    
    if (stringValue.includes('"') || stringValue.includes(',') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    }
    
    return `"${stringValue}"`;
};

const convertToCsv = (json) => {
    if (!Array.isArray(json) || json.length === 0) {
        return '';
    }

    const flattenedArray = json.map(obj => flattenObject(obj));
    const headers = Array.from(new Set(
        flattenedArray.reduce((keys, obj) => [...keys, ...Object.keys(obj)], [])
    )).sort();

    const headerRow = headers.map(header => escapeCSV(header)).join(',');
    const rows = flattenedArray.map(obj => {
        return headers.map(header => {
            const value = obj[header];
            return escapeCSV(value);
        }).join(',');
    });

    return `${headerRow}\n${rows.join('\n')}`;
};

// Get input and output filenames from command line arguments
const inputFile = process.argv[2];
const outputFile = process.argv[3];

// Check if input file is provided
if (!inputFile) {
    console.error('Please provide an input JSON file path.');
    console.log('Usage: node converter.js <input-json-file> [output-csv-file]');
    process.exit(1);
}

try {
    // Read and parse the JSON file
    const jsonData = JSON.parse(fs.readFileSync(inputFile, 'utf8'));
    
    // Convert to CSV
    const csvContent = convertToCsv(jsonData);
    
    // Determine output file name (use input filename with .csv if not specified)
    const finalOutputFile = outputFile || inputFile.replace('.json', '.csv');
    
    // Save to file with UTF-8 encoding and BOM
    const BOM = '\uFEFF';
    fs.writeFileSync(finalOutputFile, BOM + csvContent, 'utf8');
    
    console.log(`CSV file has been created: ${finalOutputFile}`);
} catch (error) {
    if (error.code === 'ENOENT') {
        console.error(`Error: Input file "${inputFile}" not found`);
    } else if (error instanceof SyntaxError) {
        console.error('Error: Invalid JSON format in input file');
    } else {
        console.error('Error:', error.message);
    }
    process.exit(1);
}