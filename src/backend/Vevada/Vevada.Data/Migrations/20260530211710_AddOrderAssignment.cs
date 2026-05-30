using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vevada.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddOrderAssignment : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "AssignedManufacturerId",
                table: "Orders",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "CancellationRequested",
                table: "Orders",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_Orders_AssignedManufacturerId",
                table: "Orders",
                column: "AssignedManufacturerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_AspNetUsers_AssignedManufacturerId",
                table: "Orders",
                column: "AssignedManufacturerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_AspNetUsers_AssignedManufacturerId",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_AssignedManufacturerId",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "AssignedManufacturerId",
                table: "Orders");

            migrationBuilder.DropColumn(
                name: "CancellationRequested",
                table: "Orders");
        }
    }
}
