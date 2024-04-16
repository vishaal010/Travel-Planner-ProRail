using Reisplanner.Adapter;

namespace Application.Reisplanner;

public class Reisplanner
{
    public static void Main() 
    {
        var graaf = Utils.LeesGraaf("../Graaf/Basismodel-tbv-jaarplak-2021.txtpb");

        var aanvraag = new ReisadviesAanvraag()
        {
            Van = "Ut",
            Naar = "Asd",
            MaxReisadviezen = 1,
            DeltaTijdReisadviezen = -1,
            ReisplannerGraaf = graaf,
        };

        var instellingen = new Instellingen()
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
}