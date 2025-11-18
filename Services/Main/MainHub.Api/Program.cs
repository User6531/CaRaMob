using Microsoft.OpenApi.Models;
using MongoDB.Driver;
using MainHub.Api.Config;
using MainHub.Api.Repositories;
using MainHub.Api.Services;
using MainHub.Api.Endpoints;
using MainHub.Api.Validators;
using MainHub.Api.Filters;
using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// 🟦 Load MongoDB settings from configuration file
builder.Services.Configure<MongoDbSettings>(
    builder.Configuration.GetSection("MongoDbSettings")
);

// 🟦 Load JWT settings from configuration file
builder.Services.Configure<JwtSettings>(
    builder.Configuration.GetSection("JwtSettings")
);

// 🟦 Register MongoDB client as a singleton
builder.Services.AddSingleton<IMongoClient>(sp =>
{
    var settings = builder.Configuration.GetSection("MongoDbSettings").Get<MongoDbSettings>();
    if (settings == null || string.IsNullOrEmpty(settings.ConnectionString))
    {
        throw new InvalidOperationException("MongoDbSettings or ConnectionString is not configured properly.");
    }
    return new MongoClient(settings.ConnectionString);
});

// 🟦 Register application services and repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<ITokenService, TokenService>();

// 🟦 Register FluentValidation validators
builder.Services.AddValidatorsFromAssemblyContaining<UpdateUserDtoValidator>();

// 🟦 Add controllers and Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "MainHub API", Version = "v1" });

    // Add the "Authorization" header input field
    c.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Enter JWT token like: Bearer {your token}"
    });

    // Apply it globally 
    c.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// 🟦 Configure JWT Settings
var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();
if (jwtSettings == null || string.IsNullOrEmpty(jwtSettings.SecretKey))
{
    throw new InvalidOperationException("JwtSettings or SecretKey is not configured properly.");
}

var jwtSecretKey = Encoding.UTF8.GetBytes(jwtSettings.SecretKey);

// 🟦 Authentication Configuration
// Azure AD and Internal JWT authentication schemes
builder.Services.AddAuthentication(options =>
{
    // Default to Azure AD (entry point for authentication)
    options.DefaultAuthenticateScheme = "AzureAD";
    options.DefaultChallengeScheme = "AzureAD";
})
    // Azure AD JWT Authentication (for initial authentication)
    .AddJwtBearer("AzureAD", options =>
    {
        options.Authority = "https://login.microsoftonline.com/common/v2.0";
        options.Audience = "0200db18-ed94-4544-925a-d307b6de8603"; // backend client ID

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,

            // Accept any Microsoft tenant issuer
            IssuerValidator = (issuer, token, parameters) =>
            {
                if (issuer.StartsWith("https://login.microsoftonline.com/"))
                    return issuer;
                throw new SecurityTokenInvalidIssuerException($"Invalid issuer: {issuer}");
            }
        };
    })
    // Internal JWT Authentication (for custom tokens)
    .AddJwtBearer("InternalJwt", options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(jwtSecretKey),
            ClockSkew = TimeSpan.Zero // Remove delay of expiration validation
        };
    });

// Authorization policies
builder.Services.AddAuthorization(options =>
{
    // Policy that only accepts Azure AD tokens (for token generation endpoints)
    options.AddPolicy("RequireAzureAD", policy =>
    {
        policy.AuthenticationSchemes.Add("AzureAD");
        policy.RequireAuthenticatedUser();
    });

    // Policy that only accepts Internal JWT tokens (for regular API calls)
    options.AddPolicy("RequireInternalJwt", policy =>
    {
        policy.AuthenticationSchemes.Add("InternalJwt");
        policy.RequireAuthenticatedUser();
    });
});

var app = builder.Build();


// 🟦 Enable Swagger for testing APIs
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapAuthEndpoints();
app.MapUserEndpoints();

app.Run();
