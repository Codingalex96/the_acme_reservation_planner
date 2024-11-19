const pg = require('pg');

// Database connection
const client = new pg.Client(
  "postgres://Almig:Jodahoale3@@localhost/the_acme_reservation_planner"
);

// Method to drop and create tables
const createTables = async () => {
  try {
    await client.query(`
      DROP TABLE IF EXISTS reservations;
      DROP TABLE IF EXISTS customers;
      DROP TABLE IF EXISTS restaurants;

      CREATE TABLE customers (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL
      );

      CREATE TABLE restaurants (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL
      );

      CREATE TABLE reservations (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        date DATE NOT NULL,
        party_count INT NOT NULL,
        restaurant_id UUID REFERENCES restaurants(id) NOT NULL,
        customer_id UUID REFERENCES customers(id) NOT NULL
      );
    `);
    console.log("Tables dropped and created successfully!");
  } catch (err) {
    console.error("Error creating tables:", err);
  }
};

// Method to create a customer
const createCustomer = async (name) => {
  try {
    const result = await client.query(
      `INSERT INTO customers (name) VALUES ($1) RETURNING *`,
      [name]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error creating customer:", err);
  }
};

// Method to create a restaurant
const createRestaurant = async (name) => {
  try {
    const result = await client.query(
      `INSERT INTO restaurants (name) VALUES ($1) RETURNING *`,
      [name]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error creating restaurant:", err);
  }
};

// Method to create a reservation
const createReservation = async (date, partyCount, restaurantId, customerId) => {
  try {
    const result = await client.query(
      `INSERT INTO reservations (date, party_count, restaurant_id, customer_id) VALUES ($1, $2, $3, $4) RETURNING *`,
      [date, partyCount, restaurantId, customerId]
    );
    return result.rows[0];
  } catch (err) {
    console.error("Error creating reservation:", err);
  }
};

const fetchCustomers = async () => {
    try {
      const result = await client.query(`SELECT * FROM customers`);
      return result.rows;
    } catch (err) {
      console.error("Error fetching customers:", err);
    }
  };

  const fetchRestaurants = async () => {
    try {
      const result = await client.query(`SELECT * FROM restaurants`);
      return result.rows;
    } catch (err) {
      console.error("Error fetching restaurants:", err);
    }
  };

  const fetchReservations = async () => {
    try {
      const result = await client.query(`SELECT * FROM reservations`);
      return result.rows;  
    } catch (err) {
      console.error("Error fetching reservations:", err);
      throw err;  
    }
  };


const seed = async () => {
  try {
    console.log("Seeding database...");
    
    await createTables();

    
    const customer1 = await createCustomer("John Doe");
    const customer2 = await createCustomer("Jane Smith");

    
    const restaurant1 = await createRestaurant("The Fancy Fork");
    const restaurant2 = await createRestaurant("Casual Eats");

    
    await createReservation("2024-11-20", 4, restaurant1.id, customer1.id);
    await createReservation("2024-11-21", 2, restaurant2.id, customer2.id);

    console.log("Database seeded successfully!");
  } catch (err) {
    console.error("Error seeding database:", err);
  }
};

// Exporting the client, methods, and seed function
module.exports = {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  createReservation,
  fetchCustomers,
  fetchRestaurants,
  fetchReservations,
  seed,
};