public interface IReisplannerService
{
    Task PrepareGraphDataAsync(string filePath);
    // Update the GetModelAsync method to include the filePath parameter
    Task<string> GetModelAsync(string van, string naar, string filePath);
    
    Task<List<string>> GetStationNamesAsync(string filePath); // Add this line

}