namespace Vevada.Data.Entities;

public class AdminDetails
{
    public int UserId { get; set; }
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public virtual User User { get; set; } = null!;
}
