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
    

    public ReisplannerService(ILogger<ReisplannerService> logger,  IMemoryCache cache)
    {
        _logger = logger;
        _cache = cache;
    }
    
    
    public void ClearCache()
    {
        _cacheTokenSource.Cancel();
        
        _cacheTokenSource = new CancellationTokenSource();

        _logger.LogInformation("Cache cleared successfully.");
    }

    public void SetCache(string key, object value, TimeSpan duration)
    {
        var options = new MemoryCacheEntryOptions()
            .SetAbsoluteExpiration(duration)
            .AddExpirationToken(new CancellationChangeToken(_cacheTokenSource.Token));

        _cache.Set(key, value, options);
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

       foreach (var reisAdviesNode in node["Data"].AsArray())
       {
           reisAdviesNode["ReisadviesId"] = Guid.NewGuid().ToString();
    

           foreach (var segmentNode in reisAdviesNode["Reisadviezen"].AsArray())
           {
               segmentNode["SegmentId"] = $"SegmentId_{reisAdviesCounter++}";

               var stappenArray = segmentNode["Segmenten"].AsArray();
               string lastStation = null, lastTrack = null;
               for (int i = 0; i < stappenArray.Count; i++)
               {
                   var stapNode = stappenArray[i];
                   stapNode["StappenId"] = $"StappenId_{stapCounter++}";

                   if (i > 0 && lastStation != null)
                   {
                       var currentStapNode = stappenArray[i]["Stappen"].AsArray()[0]; 
                       var currentStation = (string)currentStapNode["Station"];
                       var currentTrack = (string)currentStapNode["Spoor"];

                  
                       if (lastStation == currentStation)
                       {
                           var overstaptijdInSeconds = graaf.MinOverstaptijden[new(lastStation, lastTrack, currentTrack)];
                           var overstaptijdInMinutes = overstaptijdInSeconds / 60; // Convert seconds to minutes
                           stapNode["Overstaptijd"] = overstaptijdInMinutes;
                           _logger.LogInformation($"Calculated overstaptijd: {overstaptijdInMinutes} minutes between track {lastTrack} and {currentTrack} at {lastStation}");
                       }
                   }

                   var lastStep = stapNode["Stappen"].AsArray().Last();
                   lastStation = (string)lastStep["Station"];
                   lastTrack = (string)lastStep["Spoor"];

                   foreach (var step in stapNode["Stappen"].AsArray())
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

                   _logger.LogInformation($"Last station updated to {lastStation}, track {lastTrack}");
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
        List<StationName> stationNamesWithKeys = new List<StationName>();

        bool shouldExecute = false;
        lock (Lock)
        {
            if (!_isExecuted)
            {
                _isExecuted = true;
                shouldExecute = true;
            }
        }

        if (shouldExecute)
        {
            _logger.LogInformation("Invoked GetStationNamesAsync with filePath: {FilePath}", filePath);

            if (!_cache.TryGetValue(filePath, out ReisplannerGraaf graaf))
            {
                graaf = await Task.Run(() => Utils.LeesGraaf(filePath));
                _cache.Set(filePath, graaf, TimeSpan.FromHours(1));
                _logger.LogInformation("Graph data loaded and cached for {FilePath}", filePath);
            }
            else
            {
                _logger.LogInformation("Graph data retrieved from cache for {FilePath}", filePath);
            }

            if (graaf != null && graaf.StationVolledigeNamen != null)
            {
                stationNamesWithKeys = graaf.StationVolledigeNamen
                    .Select(kv => new StationName { Key = kv.Key, Value = kv.Value })
                    .ToList();
                _logger.LogInformation("Retrieved station names with keys: {StationNamesWithKeys}", stationNamesWithKeys);
            }
            else
            {
                _logger.LogWarning("No station names found or graaf object is null for {FilePath}", filePath);
            }
        }
        else
        {
            _logger.LogInformation("Skipping execution as the function has already been executed.");
        }

        return stationNamesWithKeys;
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

    
}
