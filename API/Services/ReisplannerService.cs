using System.Text.Json;
using System.Text.Json.Nodes;
using Domain;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Primitives;
using Reisplanner.Adapter;

public class ReisplannerService : IReisplannerService
{
    private readonly ILogger<ReisplannerService> _logger;
    private Dictionary<string, ReisplannerGraaf> graphs = new Dictionary<string, ReisplannerGraaf>();
    private IMemoryCache _cache;
    private CancellationTokenSource _cacheTokenSource = new CancellationTokenSource();
    private List<string> graphCacheKeys = new List<string>(); // List to track graph keys


    public ReisplannerService(ILogger<ReisplannerService> logger,  IMemoryCache cache)
    {
        _logger = logger;
        _cache = cache;
    }
    
    
    public void ClearCache()
    {
        _cacheTokenSource.Cancel();
        
        _cacheTokenSource = new CancellationTokenSource();
        
        graphCacheKeys.Clear(); // Clear the keys list when the cache is cleared


        _logger.LogInformation("Cache cleared successfully.");
    }

    public void SetCache(string key, object value, TimeSpan duration)
    {
        var options = new MemoryCacheEntryOptions().SetAbsoluteExpiration(duration).AddExpirationToken(new CancellationChangeToken(_cacheTokenSource.Token));
        _cache.Set(key, value, options);
        if (!graphCacheKeys.Contains(key))
            graphCacheKeys.Add(key); // Track the key
    }

    public async Task<string> GetModelAsync(string van, string naar, string filePath,int maxReisadviezen = 5, int bandbreedte = 20)
    {
         if (!_cache.TryGetValue(filePath, out ReisplannerGraaf graaf))
         {
             _logger.LogError("Graph data not found in cache for {FilePath}", filePath);
             throw new InvalidOperationException("Graph data not found.");
         }
         var reisplanner = new Planner(graaf);
         var model = new Model(); 


         var fileName = Path.GetFileNameWithoutExtension(filePath);
         model.ModelNaam = fileName;
        

         var aanvraag = new ReisadviesAanvraag
         {
             Van = van,
             Naar = naar,
             MaxReisadviezen = maxReisadviezen   ,
             Bandbreedte = bandbreedte
         };

         _logger.LogInformation($"ReisadviesAanvraag created for Van: {van} to Naar: {naar}");

         var instellingen = new Instellingen
         {
             LogAanvraagInfo = true,
             LogPlanningStatistieken = true,
             LogGraafInfo = true,
             LogTussenStops = false,
             LogResultaten = true,
         };
        

         var adviezen = reisplanner.GeefReisAdviezen(aanvraag, instellingen);
         model.Data.AddRange(adviezen);

         var indentOptions = new JsonSerializerOptions() { WriteIndented = true };

         var jsonifyModel = JsonSerializer.Serialize(model, indentOptions);
         _logger.LogInformation("Serialized Model: {JsonifyModel}", jsonifyModel);

         var node = JsonNode.Parse(jsonifyModel);
         _logger.LogInformation("JsonNode contents: {NodeJson}", node.ToJsonString());

         int reisAdviesCounter = 0;
int stapCounter = 0;
string lastStation = null, lastTrack = null;
int lastTime = 0; // Assuming time is managed as an integer for simplicity

foreach (var reisAdviesNode in node["Data"].AsArray())
{
    reisAdviesNode["ReisadviesId"] = Guid.NewGuid().ToString();

    foreach (var segmentNode in reisAdviesNode["Reisadviezen"].AsArray())
    {
        segmentNode["SegmentId"] = $"SegmentId_{reisAdviesCounter++}";

        var stappenArray = segmentNode["Segmenten"].AsArray();
        for (int i = 0; i < stappenArray.Count; i++)
        {
            var stapNode = stappenArray[i];
            stapNode["StappenId"] = $"StappenId_{stapCounter++}";

            var steps = stapNode["Stappen"].AsArray();
            if (i > 0 && lastStation != null)
            {
                var currentStapNode = steps[0];  // First step of current segment
                var currentStation = (string)currentStapNode["Station"];
                var currentTrack = (string)currentStapNode["Spoor"];
                int currentTime = int.Parse(currentStapNode["Tijd"].ToString());

                if (currentTime < lastTime) {  // Handle clock rollover
                    currentTime += 60;
                }
                int transferTime = currentTime - lastTime;
                stapNode["Overstaptijd"] = transferTime;  // Calculate the actual transfer time between steps

                // Ensuring it's the same station for a valid transfer time calculation
                if (lastStation == currentStation)
                {
                    if (lastStation == currentStation)
                    {
                        var overstaptijdInSeconds = graaf.MinOverstaptijden[new(lastStation, lastTrack, currentTrack)];
                        var overstaptijdInMinutes = overstaptijdInSeconds / 60; // Convert seconds to minutes
                        stapNode["Wandeltijd"] = overstaptijdInMinutes;
                        _logger.LogInformation($"Calculated overstaptijd: {overstaptijdInMinutes} minutes between track {lastTrack} and {currentTrack} at {lastStation}");
                    }
                }
            }
            
            foreach (var step in steps)
            {
                var station = (string)step["Station"];
                if (graaf.StationVolledigeNamen.ContainsKey(station))
                {
                    var updatedStationName = graaf.StationVolledigeNamen[station];
                    step["Station"] = updatedStationName;
                    _logger.LogInformation("Updated Station Name from {OriginalStationName} to {UpdatedStationName}", station, updatedStationName);
                }
                else
                {
                    _logger.LogInformation("Station name not found in dictionary: {StationName}", station);
                }
            }



            // Update lastStation, lastTrack, and lastTime to current segment's last step for the next iteration
            var lastStep = steps.Last();
            lastStation = (string)lastStep["Station"];
            lastTrack = (string)lastStep["Spoor"];
            lastTime = int.Parse(lastStep["Tijd"].ToString());
        }
    }
}

       _logger.LogInformation("Modified Reisadviezen in JSON with unique SegmentIds.");
       _logger.LogInformation("Modified Reisadviezen in JSON with SegmentIds.");
       var modifiedJson = node.ToJsonString();
       _logger.LogInformation("Serialized Modified Model: {ModifiedJson}", modifiedJson);

       return modifiedJson;
}
    
    private static bool _isExecuted = false;
    private static readonly object Lock = new object();

    
   
    public async Task<List<StationName>> GetStationNamesAsync(string filePath)
    {
        // First, try to get station names from cache to avoid reloading if not necessary.
        var cacheKey = $"StationNames_{filePath}";
        if (!_cache.TryGetValue(cacheKey, out List<StationName> stationNames))
        {
            _logger.LogInformation("Cache miss. Loading station names from graph for: {FilePath}", filePath);

            // Check if the graph is already loaded; if not, load it.
            if (!_cache.TryGetValue(filePath, out ReisplannerGraaf graaf))
            {
                if (!File.Exists(filePath))
                {
                    _logger.LogWarning("File not found: {FilePath}", filePath);
                    return new List<StationName>();
                }

                graaf = await Task.Run(() => Utils.LeesGraaf(filePath));
                _cache.Set(filePath, graaf, new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromHours(1)));
            }

            if (graaf != null && graaf.StationVolledigeNamen != null)
            {
                stationNames = graaf.StationVolledigeNamen.Select(kv => new StationName { Key = kv.Key, Value = kv.Value }).ToList();
                _cache.Set(cacheKey, stationNames, new MemoryCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromMinutes(30)));
                _logger.LogInformation("Station names loaded and cached for {FilePath}", filePath);
            }
            else
            {
                _logger.LogWarning("No station names found or graaf object is null for {FilePath}", filePath);
                stationNames = new List<StationName>();
            }
        }
        else
        {
            _logger.LogInformation("Cache hit. Retrieved station names from cache for {FilePath}", filePath);
        }

        return stationNames;
    }

    public async Task PrepareGraphDataAsync(string filePath)
    {
        try
        {
            _logger.LogInformation("Starting to load graph data from file: {FilePath}", filePath);
    
            if (!_cache.TryGetValue(filePath, out ReisplannerGraaf graaf))
            {
                graaf = await Task.Run(() => Utils.LeesGraaf(filePath));
                SetCache(filePath, graaf, TimeSpan.FromHours(1));
                _logger.LogInformation("Graph data loaded and cached successfully for {FilePath}", filePath);
            }
            else
            {
                _logger.LogInformation("Graph data retrieved from cache for {FilePath}", filePath);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to load graph data from {FilePath}", filePath);
            throw;  
        }
    }
    
    public bool AreStationsValid(string van, string naar)
    {
        foreach (var key in graphCacheKeys)
        {
            if (_cache.TryGetValue(key, out ReisplannerGraaf graaf))
            {
                if (!graaf.StationVolledigeNamen.ContainsKey(van) || !graaf.StationVolledigeNamen.ContainsKey(naar))
                {
                    return false;
                }
            }
        }
        return true;
    }

    
}
