namespace MainHub.Api.DTOs
{
    public class CreateHistoryDto
    {
        public required string Title { get; set; }
        public required string Description { get; set; }   
        public required decimal Price { get; set; }
    }

   
}
