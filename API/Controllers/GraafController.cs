using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Threading.Tasks;
using API.Services;
using Reisplanner.Adapter;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GraafController : ControllerBase
    {
        private readonly ILogger<GraafController> _logger;
        private readonly IWebHostEnvironment _environment;
        private readonly IReisplannerService _reisplannerService;
        private readonly string _targetFolder;

        public GraafController(IWebHostEnvironment environment, ILogger<GraafController> logger, IReisplannerService reisplannerService)
        {
            _environment = environment;
            _logger = logger;
            _reisplannerService = reisplannerService;
            _targetFolder = Path.Combine(_environment.ContentRootPath, "Graaf");
        }

        [HttpPost("upload")]
        public async Task<IActionResult> Upload(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                _logger.LogWarning("Upload attempted with no file.");
                return BadRequest("No file uploaded.");
            }

            var filePath = Path.Combine(_targetFolder, file.FileName);
            Directory.CreateDirectory(_targetFolder); // Ensure directory exists

            try
            {
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                _logger.LogInformation($"File {file.FileName} uploaded successfully to {filePath}");

                var processingResult = await _reisplannerService.ProcessGraphAndGetAdviceAsync(filePath);
                return Ok(processingResult);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading file.");
                return StatusCode(500, "Internal server error during file upload.");
            }
        }
    }
}
