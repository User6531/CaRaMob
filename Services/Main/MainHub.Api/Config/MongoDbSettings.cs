namespace MainHub.Api.Config
{
  /// <summary>
  /// Represents the configuration settings required to connect to a MongoDB database.
  /// </summary>
  public class MongoDbSettings
  {
    /// <summary>
    /// Gets or sets the connection string used to connect to the MongoDB server.
    /// </summary>
    public string ConnectionString { get; set; } = null!;

    /// <summary>
    /// Gets or sets the name of the MongoDB database.
    /// </summary>
    public string DatabaseName { get; set; } = null!;

    /// <summary>
    /// Gets or sets the name of the collection that stores user data.
    /// </summary>
    public string UserCollectionName { get; set; } = null!;

    /// <summary>
    /// Gets or sets the name of the collection that stores vehicle data.
    /// </summary>
    public string VehicleCollectionName { get; set; } = null!;

    /// <summary>
    /// Gets or sets the name of the collection that stores service history data.
    /// </summary>
    public string ServiceHistoryCollectionName { get; set; } = null!;

    /// <summary>
    /// Gets or sets the name of the collection that stores refresh tokens.
    /// </summary>
    public string RefreshTokenCollectionName { get; set; } = null!;
  }
}
