namespace MainHub.Api.DTOs
{
    public class ServiceHistoryResponse
    {
        public string Id { get; set; }
        public string VehicleId { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }

        public DateTime CreatedDate { get; set; }
        public DateTime UpdatedDate { get; set; }
    }

}
