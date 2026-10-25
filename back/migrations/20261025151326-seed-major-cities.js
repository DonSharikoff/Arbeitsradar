const { readFileSync } = require('fs');
const { join } = require('path');

function loadCities() {
  return JSON.parse(
    readFileSync(join(__dirname, 'major-cities.seed.json'), 'utf-8'),
  );
}

// German cities with population >= 50,000, sourced from GeoNames
// (cities15000 + postal code export, CC BY 4.0). Reference data for the
// city search/filter feature, not fetched-on-demand cache - rerun after
// updating the seed file, upserts are idempotent.
module.exports = {
  async up(db) {
    for (const city of loadCities()) {
      await db
        .collection('cities')
        .updateOne({ name: city.name }, { $set: city }, { upsert: true });
    }
  },

  async down(db) {
    const names = loadCities().map((city) => city.name);
    await db.collection('cities').deleteMany({ name: { $in: names } });
  },
};
