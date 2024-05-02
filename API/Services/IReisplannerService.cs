using Domain;

public interface IReisplannerService
{
    Task PrepareGraphDataAsync(string filePath);
    Task<string> GetModelAsync(string van, string naar,  string filePath, int maxReisadviezen, int bandBreedte);
    
    Task<List<StationName>> GetStationNamesAsync(string filePath);

}