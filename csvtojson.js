const downloadJsonAsCsv = (jsonArray, fileName) => {
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

    const convertToCsv = (json) => {
        if (!Array.isArray(json) || json.length === 0) {
            return '';
        }
        const flattenedArray = json.map((obj) => flattenObject(obj));
        const headers = Object.keys(flattenedArray[0]).join(',');
        const rows = flattenedArray.map((obj) =>
            Object.values(obj)
                .map((value) => `"${value}"`)
                .join(',')
        );
        return `${headers}\n${rows.join('\n')}`;
    };

    const csvContent = convertToCsv(jsonArray);
    if (!csvContent) {
        console.error('Invalid JSON array');
        return;
    }
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export default downloadJsonAsCsv;
