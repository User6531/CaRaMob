using MongoDB.Driver;
using Microsoft.Extensions.Options;
using MainHub.Api.Models;
using MainHub.Api.Config;

namespace MainHub.Api.Repositories;

/// <summary>
/// Defines methods for managing vehicle entities in the data store.
/// </summary>
public interface IVehicleRepository
{

}

public class VehicleRepository : IVehicleRepository
{
  private readonly IMongoCollection<VehicleEntity> _vehicles;


  public VehicleRepository(IMongoClient client, IOptions<MongoDbSettings> settings)
  {
    var database = client.GetDatabase(settings.Value.DatabaseName);
    _vehicles = database.GetCollection<VehicleEntity>(settings.Value.VehicleCollectionName);
  }


}
