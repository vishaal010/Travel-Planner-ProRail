namespace Domain
{
    public enum ReisAdviesStapType
    {
        Aankomst,
        Vertrek
    }


    public class ReisadviesResultaat
    {
        public string ModelNaam { get; set; } 
        public int ModelId { get; set; } 
        public List<ReisadviesSegment> ReisAdviezen { get; set; } = new List<ReisadviesSegment>();
    }

    public class ReisadviesSegment
    {
        public int AdviesId { get; set; } 
        public int ReisDuur { get; set; } 
        public string UurPatroon { get; set; } 
        public int Frequentie { get; set; } 
        public int AantalOverstappen { get; set; } 
        public List<Segment> Segmenten { get; set; } = new List<Segment>(); 
    }

    public class Segment
    {
        public int SegmentId { get; set; } 
        public int SegmentDuur { get; set; } 
        public string TreinType { get; set; } 
        public string TreinId { get; set; } 
        public string SerieNaam { get; set; } 
        public List<ReisadviesStap> Stappen { get; set; } = new List<ReisadviesStap>(); 
    }

    public class ReisadviesStap
    {
        public ReisAdviesStapType StapType { get; set; } 
        public string StationNaam { get; set; } 
        public string Tijd { get; set; } 
        public string Spoor { get; set; }
    }
}
