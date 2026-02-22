using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Vevada.Data.Entities;

namespace Vevada.Data.Constants;

public static class AppRoles
{
    public static readonly Role Client = new() { Name = "Client", NormalizedName = "CLIENT" };
    public static readonly Role Manufacturer = new() { Name = "Manufacturer", NormalizedName = "MANUFACTURER" };
    public static readonly Role ProductManager = new() { Name = "ProductManager", NormalizedName = "PRODUCTMANAGER" };
    public static readonly Role Analyst = new() { Name = "Analyst", NormalizedName = "ANALYST" };
    public static readonly Role SuperAdmin = new() { Name = "SuperAdmin", NormalizedName = "SUPERADMIN" };

    public static IEnumerable<Role> All =>
        new[] { Client, Manufacturer, ProductManager, Analyst, SuperAdmin };
}
