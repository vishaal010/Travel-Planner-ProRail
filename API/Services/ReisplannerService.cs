using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Nodes;
using API.Services;
using Domain;
using Microsoft.Extensions.Caching.Memory;
using Reisplanner.Adapter;

public class ReisplannerService : IReisplannerService
{
    private readonly ILogger<ReisplannerService> _logger;
    private Dictionary<string, ReisplannerGraaf> graphs = new Dictionary<string, ReisplannerGraaf>();
    private IMemoryCache _cache;

    

    public ReisplannerService(ILogger<ReisplannerService> logger,  IMemoryCache cache)
    {
        _logger = logger;
        _cache = cache;
    }
    

public async Task<string> GetModelAsync(string van, string naar, string filePath,int maxReisadviezen = 5, int bandbreedte = 20)
    {
         if (!_cache.TryGetValue(filePath, out ReisplannerGraaf graaf))
        {
            _logger.LogError("Graph data not found in cache for {FilePath}", filePath);
            throw new InvalidOperationException("Graph data not found.");
        }
         _logger.LogInformation("Geef mij station namen {graaf}",graaf.StationVolledigeNamen);
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

        // Specify JsonSerializerOptions with indentation enabled
        var indentOptions = new JsonSerializerOptions() { WriteIndented = true };

        // Serialize your model object to JSON with indentation
        var jsonifyModel = JsonSerializer.Serialize(model, indentOptions);
        _logger.LogInformation("Serialized Model: {JsonifyModel}", jsonifyModel);

        var node = JsonNode.Parse(jsonifyModel);
        _logger.LogInformation("JsonNode contents: {NodeJson}", node.ToJsonString());

        int reisAdviesCounter = 0;
        int stapCounter = 0;  // Initialize a counter for each Stappen array

        foreach (var reisAdviesNode in node["Data"].AsArray())
        {
            reisAdviesNode["ReisadviesId"] = Guid.NewGuid().ToString();

            foreach (var segmentNode in reisAdviesNode["Reisadviezen"].AsArray())
            {
                segmentNode["SegmentId"] = $"SegmentId_{reisAdviesCounter++}";

                foreach (var stapNode in segmentNode["Segmenten"].AsArray())
                {
                    // Assign a unique StappenId to each Stappen array
                    stapNode["StappenId"] = $"StappenId_{stapCounter++}";

                    foreach (var step in stapNode["Stappen"].AsArray())
                    {
                        var station = (string)step["Station"];
                        _logger.LogInformation("Original Station Name: {OriginalStationName}", station);

                        if (graaf.StationVolledigeNamen.ContainsKey(station))
                        {
                            var updatedStationName = graaf.StationVolledigeNamen[station];
                            step["Station"] = updatedStationName;
                            _logger.LogInformation("Updated Station Name: {UpdatedStationName}", updatedStationName);
                        }
                        else
                        {
                            _logger.LogInformation("Station name not found in dictionary: {StationName}", station);
                        }
                    }
                }
            }
        }


        _logger.LogInformation("Modified Reisadviezen in JSON with unique SegmentIds.");

        _logger.LogInformation("Modified Reisadviezen in JSON with SegmentIds.");

// Convert the modified JsonNode back to a JSON string
        var modifiedJson = node.ToJsonString();
        _logger.LogInformation("Serialized Modified Model: {ModifiedJson}", modifiedJson);

        return modifiedJson;
    }
    
    private static bool _isExecuted = false;
    private static readonly object Lock = new object();

   
    public async Task<List<StationName>> GetStationNamesAsync(string filePath)
    {
        List<StationName> stationNamesWithKeys = new List<StationName>();

        // Check and update the _isExecuted flag within the lock statement
        bool shouldExecute = false;
        lock (Lock)
        {
            if (!_isExecuted)
            {
                _isExecuted = true;
                shouldExecute = true;
            }
        }

        // Proceed with processing outside the lock if shouldExecute is true
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
                _cache.Set(filePath, graaf, TimeSpan.FromHours(1));
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
