const downloadJsonAsCsv = (jsonArray, fileName) => {
    // Helper function to flatten a nested object
    const flattenObject = (obj, parentKey = '', result = {}) => {
      for (const [key, value] of Object.entries(obj)) {
        const newKey = parentKey ? ${parentKey}.${key} : key;
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          flattenObject(value, newKey, result);
        } else {
          result[newKey] = value;
        }
      }
      return result;
    };
  
    // Convert JSON to CSV format
    const convertToCsv = (json) => {
      if (!Array.isArray(json) || json.length === 0) {
        return '';
      }
  
      // Flatten all objects in the array
      const flattenedArray = json.map((obj) => flattenObject(obj));
  
      // Extract headers from keys of the first flattened object
      const headers = Object.keys(flattenedArray[0]).join(',');
  
      // Map each flattened object to a CSV row
      const rows = flattenedArray.map((obj) =>
        Object.values(obj)
          .map((value) => "${value}") // Escape values with quotes
          .join(',')
      );
  
      // Combine headers and rows with line breaks
      return ${headers}\n${rows.join('\n')};
    };
  
    // Generate CSV content
    const csvContent = convertToCsv(jsonArray);
  
    if (!csvContent) {
      console.error('Invalid JSON array');
      return;
    }
  
    // Create a Blob for the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
    // Generate a download link and trigger the download
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = ${fileName}.csv;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  export default downloadJsonAsCsv;
