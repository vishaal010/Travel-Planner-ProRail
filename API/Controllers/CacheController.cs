using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class CacheController : ControllerBase
{
    private readonly IReisplannerService _reisplannerService;

    public CacheController(IReisplannerService reisplannerService)
    {
        _reisplannerService = reisplannerService;
    }
    
    

    [HttpPost("clear")]
    public IActionResult ClearCache()
    {
        _reisplannerService.ClearCache();
        return Ok(new { message = "Cache cleared successfully!" });
    }
}