using Domain;

public interface IReisplannerService
{
    Task PrepareGraphDataAsync(string filePath);
    // Update the GetModelAsync method to include the filePath parameter
    Task<string> GetModelAsync(string van, string naar, string filePath);
    
    Task<List<StationName>> GetStationNamesAsync(string filePath);

}