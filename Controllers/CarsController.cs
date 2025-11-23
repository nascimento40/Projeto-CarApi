using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CarApi.Data;
using CarApi.Models;

namespace CarApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CarsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public CarsController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Car>>> GetAll() => await _db.Cars.ToListAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<Car>> Get(int id)
        {
            var car = await _db.Cars.FindAsync(id);
            if (car == null) return NotFound();
            return car;
        }

        [HttpPost]
        public async Task<ActionResult<Car>> Create(Car car)
        {
            _db.Cars.Add(car);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = car.Id }, car);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Car car)
        {
            if (id != car.Id) return BadRequest();
            _db.Entry(car).State = EntityState.Modified;

            try { await _db.SaveChangesAsync(); }
            catch (DbUpdateConcurrencyException)
            {
                if (!await _db.Cars.AnyAsync(c => c.Id == id)) return NotFound();
                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var car = await _db.Cars.FindAsync(id);
            if (car == null) return NotFound();

            _db.Cars.Remove(car);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
