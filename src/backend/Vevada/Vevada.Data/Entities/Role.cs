using Microsoft.AspNetCore.Identity;
using Vevada.Data.Entities.Base;

namespace Vevada.Data.Entities;

public class Role : IdentityRole<int>, IEntity;
