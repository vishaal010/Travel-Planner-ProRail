using Reisplanner.Adapter;

public class Model
{
    public Guid ModelId { get; set; }  // Unique identifier for the model
    public List<ReisadviesResultaat> ReisAdviezen { get; set; }  // List to hold multiple ReisadviesResultaat

    public Model()
    {
        ModelId = Guid.NewGuid();  // Automatically generate a new unique ID upon creation
        ReisAdviezen = new List<ReisadviesResultaat>();  // Initialize the list
    }
}