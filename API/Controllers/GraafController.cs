using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;



namespace API.Controllers;

[Route("api/[controller]")]

public class GraafController : ControllerBase
{
    private readonly ILogger<GraafController> _logger;
    private readonly IWebHostEnvironment _environment;
    private readonly string _targetFolder;

    public GraafController(IWebHostEnvironment environment, ILogger<GraafController> logger)
    {
        _environment = environment;
        _logger = logger;
        _targetFolder = Path.Combine(_environment.ContentRootPath, "Graaf");
    }

    [HttpPost("upload")]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("No file uploaded.");

        var filePath = Path.Combine(_targetFolder, file.FileName);

        // Ensure the directory exists
        Directory.CreateDirectory(_targetFolder);

        try
        {
            using (var stream = System.IO.File.Create(filePath))
            {
                await file.CopyToAsync(stream);
                // After copying the file to the stream
                _logger.LogInformation($"File {file.FileName} uploaded successfully to {filePath}");

                // Confirm the file exists
                if (System.IO.File.Exists(filePath))
                {
                    _logger.LogInformation($"Confirmed the file exists at {filePath}");
                }
                else
                {
                    _logger.LogError($"The file was not found at {filePath}");
                }

            }
        }
        catch (Exception ex)
        {
            // Log the exception
            // You might want to return a different type of ActionResult to indicate the error.
            _logger.LogError(ex, "Error uploading file.");
            return StatusCode(500, "Internal server error");
        }

        return Ok(new { filePath });
    }
}
