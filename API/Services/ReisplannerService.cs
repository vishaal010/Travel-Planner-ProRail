using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Reisplanner.Adapter;

namespace API.Services
{
    public class ReisplannerService : IReisplannerService
    {
        private readonly ILogger<ReisplannerService> _logger;

        public ReisplannerService(ILogger<ReisplannerService> logger)
        {
            _logger = logger;
        }

        public async Task<IEnumerable<string>> ProcessGraphAndGetAdviceAsync(string filePath)
        {
            var output = new List<string>();
            try
            {
                var hardcodedPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "../../../Graaf/Basismodel-tbv-jaarplak-2021.txtpb");
                _logger.LogInformation("Starting to process the graph from file: {FilePath}", hardcodedPath);

                var graaf = Utils.LeesGraaf(hardcodedPath);



                var aanvraag = new ReisadviesAanvraag
                {
                    Van = "Ut",
                    Naar = "Asd",
                    MaxReisadviezen = 1,
                    DeltaTijdReisadviezen = -1,
                    ReisplannerGraaf = graaf
                };

                _logger.LogInformation("ReisadviesAanvraag created: {ReisadviesAanvraag}", aanvraag);

                var instellingen = new Instellingen
                {
                    LogAanvraagInfo = true,
                    LogExecutieTijd = true,
                    LogGraafInfo = true,
                    LogTussenStops = false,
                    LogVertexExpansies = true,
                };

                _logger.LogInformation("Instellingen set for Reisadvies.");

                var adviezen = Reisadvies.GeefReisAdviezen(aanvraag, instellingen);
                _logger.LogInformation("Reisadviezen received.");

                foreach (var advies in adviezen)
                {
                    var adviesOutput = advies.ToString(); 
                    output.Add(adviesOutput);
                    _logger.LogInformation("Processed advies: {Advies}", adviesOutput);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while processing the graph.");
                output.Add($"An error occurred: {ex.Message}");
            }
            return output;
        }
    }
}