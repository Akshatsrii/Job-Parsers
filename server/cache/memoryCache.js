let historyCache = [];

export function getHistoryFromCache() {
  return [...historyCache];
}

export function saveToCache(item) {
  // Ensure item has a unique id if not present
  const enrichedItem = {
    _id: item._id || item.id || Math.random().toString(36).substring(2, 11),
    ...item,
    parsedAt: item.parsedAt || new Date().toISOString(),
  };
  
  // Prepend to array, capping history at 50 items
  historyCache = [enrichedItem, ...historyCache].slice(0, 50);
  return enrichedItem;
}

export function deleteFromCache(id) {
  const initialLength = historyCache.length;
  historyCache = historyCache.filter((item) => item._id !== id && item.id !== id);
  return historyCache.length < initialLength;
}

export function clearCache() {
  historyCache = [];
}
