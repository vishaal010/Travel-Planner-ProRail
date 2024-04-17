using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Services
{
    public interface IReisplannerService
    {
        Task<IEnumerable<string>> ProcessGraphAndGetAdviceAsync(string filePath);
    }
}