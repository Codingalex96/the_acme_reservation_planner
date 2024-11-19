const express = require("express");
const { 
  client, 
  createTables, 
  createCustomer, 
  createRestaurant, 
  fetchCustomers, 
  fetchRestaurants, 
  createReservation, 
  fetchReservations, 
  destroyReservation, 
  seed 
} = require("./db");

const app = express();
const PORT = 3000;

// Middleware to parse JSON
app.use(express.json());

// RESTful Routes

app.get("/api/customers", async (req, res) => {
  try {
    const customers = await fetchCustomers();
    res.status(200).json(customers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch customers" });
  }
});


app.get("/api/restaurants", async (req, res) => {
  try {
    const restaurants = await fetchRestaurants();
    res.status(200).json(restaurants);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch restaurants" });
  }
});


app.get("/api/reservations", async (req, res) => {
  try {
    const reservations = await fetchReservations();
    res.status(200).json(reservations);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reservations" });
  }
});

app.post("/api/restaurants", async (req, res) => {
    const { name } = req.body;
  
    try {
      const newRestaurant = await createRestaurant(name);
      res.status(201).json(newRestaurant); // Respond with the newly created restaurant
    } catch (err) {
      res.status(500).json({ error: "Failed to create restaurant" });
    }
  });


app.post("/api/customers/:id/reservations", async (req, res) => {
  const { id } = req.params; // customer_id
  const { restaurant_id, date, party_count } = req.body;

  try {
    const reservation = await createReservation(date, party_count, restaurant_id, id);
    res.status(201).json(reservation);
  } catch (err) {
    res.status(500).json({ error: "Failed to create reservation" });
  }
});


app.delete("/api/customers/:customer_id/reservations/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await destroyReservation(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete reservation" });
  }
});

app.post("/api/customers", async (req, res) => {
    const { name } = req.body; 
  
    if (!name) {
      return res.status(400).json({ error: "Customer name is required" });
    }
  
    try {
      const newCustomer = await createCustomer(name);
      res.status(201).json(newCustomer);
    } catch (err) {
      res.status(500).json({ error: "Failed to create customer" });
    }
  });

// Initialize the server and database
const init = async () => {
  try {
    console.log("Connecting to database...");
    await client.connect();
    console.log("Connected to database");

    console.log("Creating tables...");
    await createTables();

    console.log("Seeding database with sample data...");
    await seed(); // Calling the seed function

    // Starting the server
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Error initializing the app:", err);
  }
};

init();