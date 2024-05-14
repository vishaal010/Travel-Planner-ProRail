using System.Text.Json;
using API.Services;
using MediatR;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
});

// Register ReisplannerService for dependency injection
builder.Services.AddSingleton<IReisplannerService, ReisplannerService>();
builder.Services.AddMemoryCache();

// builder.Services.AddSingleton<FileStorageService>();

// Configure CORS (if needed)
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

// Register other services
// Uncomment and modify as needed
// builder.Services.AddMediatR(cfg => {
//     cfg.RegisterServicesFromAssembly(typeof(GetModelsQueryHandler).Assembly);
// });


// Add Swagger/OpenAPI service registration if in development environment
if (builder.Environment.IsDevelopment())
{
    builder.Services.AddSwaggerGen(c =>
    {
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });
    });
}

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("CorsPolicy");

app.UseAuthorization();

app.MapControllers();

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;


app.Run();