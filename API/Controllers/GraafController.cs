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
                    await _reisplannerService.PrepareGraphDataAsync(filePath);
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
    }
}
