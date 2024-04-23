// using API.Parsers;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;

[ApiController]
[Route("api/[controller]")]
public class ReisplannerController : ControllerBase
{
    private readonly IReisplannerService _reisplannerService;
    private readonly ILogger<ReisplannerController> _logger;

    public ReisplannerController(IReisplannerService reisplannerService, ILogger<ReisplannerController> logger)
    {
        _reisplannerService = reisplannerService;
        _logger = logger;
    }

    [HttpGet("adviezen")]
    public async Task<IActionResult> GetAdviezen([FromQuery] string van, [FromQuery] string naar)
    {
        

        _logger.LogInformation("Fetching adviezen for Van: {Van} and Naar: {Naar}", van, naar); 
        try
        {
            var model = await _reisplannerService.GetModelAsync(van, naar);
            _logger.LogInformation("Fetching adviezen for lol: {model} ", model); 

            return Ok(model); 
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while fetching adviezen");
            return StatusCode(StatusCodes.Status500InternalServerError, new { error = ex.Message });
        }
    }
}