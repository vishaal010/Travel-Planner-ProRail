using Domain;


namespace Application.Services
{
    public class MockDataService
    {
        public List<ReisadviesResultaat> GetMockReisadviesResultaten()
        {
            var cardTrainData = new List<ReisadviesResultaat>
            {
                new ReisadviesResultaat
                {
                    ModelNaam = "A12q",
                    ModelId = 1,
                    ReisAdviezen = new List<ReisadviesSegment>
                    {
                        new ReisadviesSegment
                        {
                            AdviesId = 1,
                            ReisDuur = 90,
                            UurPatroon = "10|20|10|20",
                            Frequentie = 2,
                            AantalOverstappen = 1,
                            Segmenten = new List<Segment>
                            {
                                new Segment
                                {
                                    SegmentId = 1,
                                    SegmentDuur = 15,
                                    TreinType = "Intercity",
                                    TreinId = "IC1234",
                                    SerieNaam = "A120",
                                    Stappen = new List<ReisadviesStap>
                                    {
                                        new ReisadviesStap
                                        {
                                            StapType = ReisAdviesStapType.Vertrek,
                                            StationNaam = "Rotterdam Centraal",
                                            Tijd = "10:30",
                                            Spoor = "5"
                                        },
                                        new ReisadviesStap
                                        {
                                            StapType = ReisAdviesStapType.Aankomst,
                                            StationNaam = "Amsterdam Centraal",
                                            Tijd = "10:45",
                                            Spoor = "5"
                                        },
                                        new ReisadviesStap
                                        {
                                            StapType = ReisAdviesStapType.Vertrek,
                                            StationNaam = "Amsterdam Centraal",
                                            Tijd = "10:30",
                                            Spoor = "5"
                                        },
                                        new ReisadviesStap
                                        {
                                            StapType = ReisAdviesStapType.Aankomst,
                                            StationNaam = "Utrecht Centraal",
                                            Tijd = "10:45",
                                            Spoor = "5"
                                        },
                                        // Add more steps as required...
                                    },
                                },
                                 {
                                new Segment
                                {
                                    SegmentId = 2,
                                    SegmentDuur = 15,
                                    TreinType = "Intercity",
                                    TreinId = "IC1234",
                                    SerieNaam = "A120",
                                    Stappen = new List<ReisadviesStap>
                                    {
                                        new ReisadviesStap
                                        {
                                            StapType = ReisAdviesStapType.Vertrek,
                                            StationNaam = "Utrecht Centraal",
                                            Tijd = "10:30",
                                            Spoor = "5"
                                        },
                                        new ReisadviesStap
                                        {
                                            StapType = ReisAdviesStapType.Aankomst,
                                            StationNaam = "Holendrecht",
                                            Tijd = "10:45",
                                            Spoor = "5"
                                        },
                                        new ReisadviesStap
                                        {
                                            StapType = ReisAdviesStapType.Vertrek,
                                            StationNaam = "Holendrecht",
                                            Tijd = "10:30",
                                            Spoor = "5"
                                        },
                                        new ReisadviesStap
                                        {
                                            StapType = ReisAdviesStapType.Aankomst,
                                            StationNaam = "Zwolle",
                                            Tijd = "10:45",
                                            Spoor = "5"
                                        },
                                    },
                                }
                            }
                            },
                            
                        },
                        new ReisadviesSegment
                        {
                            AdviesId = 2,
                            ReisDuur = 85,
                            UurPatroon = "15|25|15|25",
                            Frequentie = 2,
                            AantalOverstappen = 0,
                            Segmenten = new List<Segment>
                            {
                                new Segment
                                {
                                    SegmentId = 1,
                                    SegmentDuur = 15,
                                    TreinType = "Intercity",
                                    TreinId = "IC1234",
                                    SerieNaam = "A120",
                                    Stappen = new List<ReisadviesStap>
                                    {
                                        new ReisadviesStap
                                        {
                                            StapType = ReisAdviesStapType.Vertrek,
                                            StationNaam = "Rotterdam Centraal",
                                            Tijd = "10:30",
                                            Spoor = "5"
                                        },
                                        new ReisadviesStap
                                        {
                                            StapType = ReisAdviesStapType.Aankomst,
                                            StationNaam = "Amsterdam Centraal",
                                            Tijd = "10:45",
                                            Spoor = "5"
                                        },
                                    }
                                }
                            }
                        }
                    }
                }
            };
            

            return cardTrainData;
        }
    }
}
