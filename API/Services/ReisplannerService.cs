using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
// using API.Parsers;
using Domain;
using Microsoft.Extensions.Logging;
using Reisplanner.Adapter;

namespace API.Services
{
    public class ReisplannerService : IReisplannerService
    {
        private readonly ILogger<ReisplannerService> _logger;
        private ReisplannerGraaf _graaf;  

        public ReisplannerService(ILogger<ReisplannerService> logger)
        {
            _logger = logger;
        }

        public async Task PrepareGraphDataAsync(string filePath)
        {
            try
            {
                _logger.LogInformation("Starting to load graph data from file: {FilePath}", filePath);
                _graaf = await Task.Run(() => Utils.LeesGraaf(filePath));
                _logger.LogInformation("Graph data loaded successfully.");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to load graph data.");
                throw;  
            }
        }

        public async Task<Model> GetModelAsync(string van, string naar)
        {
            var reisplanner = new Planner(_graaf);
            var model = new Model();  // ModelId is set here

            try
            {
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
                model.ReisAdviezen.AddRange(adviezen);  // Assuming this adds ReisadviesResultaat instances

                var jsonifyModel = JsonSerializer.Serialize(model);
                _logger.LogInformation("Processed model with advice in JSON: {JsonifyModel}", jsonifyModel);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while processing the travel advice.");
                throw;
            }
            return model;  // Returns the model with the ID and advice data
        }


    }
}
