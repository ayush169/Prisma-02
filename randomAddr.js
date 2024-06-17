// Randomly select a value from an array
function getRandomValueFromArray(array) {
  const randomIndex = Math.floor(Math.random() * array.length);
  return array[randomIndex];
}

// Generate a random number between min and max (inclusive)
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate a random address
function generateRandomAddress() {
  const streets = ["Main Street", "First Avenue", "Oak Road", "Elm Street"];
  const cities = ["New York", "Los Angeles", "Chicago", "San Francisco"];
  const states = ["NY", "CA", "IL", "TX"];
  const zipCode = getRandomNumber(10000, 99999);

  const street = getRandomValueFromArray(streets);
  const city = getRandomValueFromArray(cities);
  const state = getRandomValueFromArray(states);

  return `${street} ${city} ${state} ${zipCode}`;
}

// Example usage
module.exports = generateRandomAddress;
