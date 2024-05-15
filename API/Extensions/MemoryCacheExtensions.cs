using Microsoft.Extensions.Caching.Memory;
using System.Collections.Generic;
using System.Reflection;

public static class MemoryCacheExtensions
{
    public static IEnumerable<object> GetKeys(this IMemoryCache memoryCache)
    {
        if (memoryCache is MemoryCache cache)
        {
            var entriesField = typeof(MemoryCache).GetProperty("EntriesCollection", BindingFlags.NonPublic | BindingFlags.Instance);
            if (entriesField != null)
            {
                var entriesCollection = entriesField.GetValue(cache) as dynamic;
                foreach (var entry in entriesCollection)
                {
                    yield return entry.GetType().GetProperty("Key").GetValue(entry, null);
                }
            }
        }
    }
}