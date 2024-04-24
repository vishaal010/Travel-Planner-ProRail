using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Nodes;
using API.Services;
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
    
    public async Task<List<string>> GetStationNamesAsync(string filePath)
    {
        if (!_cache.TryGetValue(filePath, out ReisplannerGraaf graaf))
        {
            // Load the graph if it's not in the cache
            graaf = await Task.Run(() => Utils.LeesGraaf(filePath));
            _cache.Set(filePath, graaf, TimeSpan.FromHours(1));
            _logger.LogInformation("Graph data loaded and cached successfully for {FilePath}", filePath);
        }
        else
        {
            _logger.LogInformation("Graph data retrieved from cache for {FilePath}", filePath);
        }

        // Convert the dictionary values to a list and return
        return graaf.StationVolledigeNamen.Values.ToList();
    }



    public async Task PrepareGraphDataAsync(string filePath)
    {
        try
        {
            _logger.LogInformation("Starting to load graph data from file: {FilePath}", filePath);
        
            // Check if the graph is already in cache
            if (!_cache.TryGetValue(filePath, out ReisplannerGraaf graaf))
            {
                // Load the graph as it's not in the cache
                graaf = await Task.Run(() => Utils.LeesGraaf(filePath));
                _logger.LogInformation("test {test}", graaf.StationVolledigeNamen );
                // Set the graph in the cache with a 1-hour expiration
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


    public async Task<Model> GetModelAsync(string van, string naar, string filePath)
    {
        if (!_cache.TryGetValue(filePath, out ReisplannerGraaf graaf))
        {
            _logger.LogError("Graph data not found in cache for {FilePath}", filePath);
            throw new InvalidOperationException("Graph data not found.");
        }

        var reisplanner = new Planner(graaf);
        var model = new Model(); // Initialize your model here

        // Extract file name without extension
        var fileName = Path.GetFileNameWithoutExtension(filePath);
        model.ModelNaam = fileName;

        var aanvraag = new ReisadviesAanvraag
        {
            Van = van,
            Naar = naar,
            MaxReisadviezen = 1,
            Bandbreedte = 10
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
        model.ReisAdviezen.AddRange(adviezen);

        // Specify JsonSerializerOptions with indentation enabled
        var indentOptions = new JsonSerializerOptions() { WriteIndented = true };

        // Serialize your model object to JSON with indentation
        var jsonifyModel = JsonSerializer.Serialize(model, indentOptions);
        _logger.LogInformation("Serialized Model: {JsonifyModel}", jsonifyModel);

        // Parse the JSON string into a JsonNode
        var node = JsonNode.Parse(jsonifyModel);
        _logger.LogInformation("JsonNode contents: {NodeJson}", node.ToJsonString());

        // Modify properties in the JsonNode as needed
        // Ensure the keys match the case used in your JSON structure
        node["ReisAdviezen"][0]["ReisadviesId"] = "ReisadviesId123";
        _logger.LogInformation("Modified ReisadviesId in JSON.");

        node["ReisAdviezen"][0]["Reisadviezen"][0]["Segmenten"][0]["SegmentId"] = "SegmentId123";
        _logger.LogInformation("Modified SegmentId in JSON.");

        // Convert the modified JsonNode back to a JSON string
        // Convert the modified JsonNode back to a JSON string
        var modifiedJson = node.ToJsonString();
        _logger.LogInformation("Serialized Modified Model: {ModifiedJson}", modifiedJson);

        return modifiedJson;
    }


}
