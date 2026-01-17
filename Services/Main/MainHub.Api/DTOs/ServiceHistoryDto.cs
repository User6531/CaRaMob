namespace MainHub.Api.DTOs
{
    public class ServiceHistoryDto
    {
        public required Guid Id { get; set; }

        public required string Title { get; set; }
        public required decimal Price { get; set; }

        public required DateTime CreatedDate { get; set; }
    }

}
