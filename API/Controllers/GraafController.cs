using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Collections.Generic;
using System.Threading.Tasks;
using API.Services;
using Microsoft.AspNetCore.Http;

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

        // Static list to hold file paths for simplicity
        public static List<string> UploadedFilePaths = new List<string>();

        [HttpPost("upload")]
        public async Task<IActionResult> Upload(List<IFormFile> files)
        {
            if (files == null || files.Count == 0)
            {
                return BadRequest("No files uploaded.");
            }

            List<object> responses = new List<object>();

            foreach (IFormFile file in files)
            {
                if (file.Length == 0)
                {
                    responses.Add(new { fileName = file.FileName, message = "File is empty." });
                    continue;
                }

                var filePath = Path.Combine(_targetFolder, file.FileName);
                Directory.CreateDirectory(Path.GetDirectoryName(filePath));

                try
                {
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }
                    // Save the path in the static list or a more persistent storage
                    UploadedFilePaths.Add(filePath);
                    await _reisplannerService.PrepareGraphDataAsync(filePath); // Optionally prepare data immediately
                    responses.Add(new { fileName = file.FileName, message = "File uploaded and processed successfully." });
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error uploading file {FileName}.", file.FileName);
                    responses.Add(new { fileName = file.FileName, error = ex.Message });
                }
            }

            return Ok(responses);
        }


        [HttpGet("adviezen")]
        public async Task<IActionResult> GetAdviezen([FromQuery] string van, [FromQuery] string naar)
        {
            try
            {
                List<Model> models = new List<Model>();
                foreach (var filePath in UploadedFilePaths)
                {
                    var model = await _reisplannerService.GetModelAsync(van, naar, filePath);
                    models.Add(model);
                }
                return Ok(models);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while fetching data");
                return StatusCode(StatusCodes.Status500InternalServerError, new { error = ex.Message });
            }
        }

        [HttpGet("station-names")]
        public async Task<IActionResult> GetStationNames([FromQuery] string filePath)
        {
            try
            {
                var stationNames = await _reisplannerService.GetStationNamesAsync(filePath);
                return Ok(stationNames);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get station names.");
                return StatusCode(StatusCodes.Status500InternalServerError, new { error = ex.Message });
            }
        }

    }
}
