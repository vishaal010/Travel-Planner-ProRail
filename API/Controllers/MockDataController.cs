using Application.Models.Queries;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Domain;


namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ModelController : BaseApiController
{
    [HttpGet]
    public async Task<IActionResult> GetModels()
    {
        var query = new GetModelsQuery();
        var result = await Mediator.Send(query);
        return Ok(result);
    }
}
