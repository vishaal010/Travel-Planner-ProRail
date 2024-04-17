using Microsoft.AspNetCore.Mvc;
using API.Services;
using System.Threading.Tasks;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReisplannerController : ControllerBase
    {
        private readonly IReisplannerService _reisplannerService;

        public ReisplannerController(IReisplannerService reisplannerService)
        {
            _reisplannerService = reisplannerService;
        }

        [HttpGet("adviezen")]
        public async Task<IActionResult> GetAdviezenAsync(string filePath)
        {
            // This endpoint now expects a filePath query parameter, for example:
            // GET /api/reisplanner/adviezen?filePath=some/path/to/your/graph.txtpb
            var adviezen = await _reisplannerService.ProcessGraphAndGetAdviceAsync(filePath);
            return Ok(adviezen);
        }
    }
}