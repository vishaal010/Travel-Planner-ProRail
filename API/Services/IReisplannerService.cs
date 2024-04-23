namespace API.Services
{
    public interface IReisplannerService
    {
        Task PrepareGraphDataAsync(string filePath);
        Task<Model> GetModelAsync(string van, string naar);  // Updated return type
    }
}