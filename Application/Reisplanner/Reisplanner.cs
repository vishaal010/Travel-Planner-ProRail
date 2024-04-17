using Reisplanner.Adapter;

namespace Application.Reisplanner;

public class Reisplanner
{
    public static void Main() 
    {
        try
        {
            var graaf = Utils.LeesGraaf(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Graaf", "Basismodel-tbv-jaarplak-2021.txtpb"));
            var aanvraag = new ReisadviesAanvraag
            {
                Van = "Ut",
                Naar = "Asd",
                MaxReisadviezen = 1,
                DeltaTijdReisadviezen = -1,
                ReisplannerGraaf = graaf,
            };

            var instellingen = new Instellingen
            {
                LogAanvraagInfo = false,
                LogExecutieTijd = false,
                LogGraafInfo = false,
                LogTussenStops = true,
                LogVertexExpansies = false,
            };

            var adviezen = Reisadvies.GeefReisAdviezen(aanvraag, instellingen);
            foreach (var advies in adviezen)
            {
                Console.WriteLine(advies.ToString(instellingen));
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"An error occurred: {ex.Message}");
        }
    }

}