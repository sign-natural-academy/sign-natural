// src/utils/group.js

export function groupByTypeAndChunk(data, chunkSize = 3) {
    const groups = {};
  
    // Group by type
    data.forEach((item) => {
      if (!groups[item.type]) groups[item.type] = [];
      groups[item.type].push(item);
    });
  
    // Chunk each group
    const chunkedRows = [];
  
    Object.entries(groups).forEach(([type, items]) => {
      for (let i = 0; i < items.length; i += chunkSize) {
        chunkedRows.push({ type, items: items.slice(i, i + chunkSize) });
      }
    });
  
    return chunkedRows;
  }
  