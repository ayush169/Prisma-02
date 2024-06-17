const express = require("express");
const app = express();
const { PrismaClient } = require("@prisma/client");
const { v4: uuidv4 } = require("uuid");

const prisma = new PrismaClient();

const generateRandomAddress = require("./randomAddr");

app.use(express.json());

// Get all users
app.get("/", async (req, res) => {
  const allUsers = await prisma.user.findMany({
    include: {
      houseOwned: false,
      houseBuilt: false,
    },
    // select: {
    //   age: true,
    //   firstName: true,
    // },
    where: {
      age: {
        gt: 25,
      },
    },
  });
  res.json(allUsers);
});

//get all houses
app.get("/houses", async (req, res) => {
  const allHouses = await prisma.house.findMany({
    include: {
      owner: true,
      builtBy: true,
    },
  });
  res.json(allHouses);
});

//get house by id
app.get("/house/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const house = await prisma.house.findUnique({
      where: { id },
      include: {
        owner: true,
        builtBy: true,
      },
    });
    res.json(house);
  } catch (error) {
    res.status(404).json({ error: "House not found" });
  }
});

//create a new user
app.post("/user", async (req, res) => {
  try {
    const id = uuidv4();
    const newUser = await prisma.user.create({
      data: { id, ...req.body },
    });
    res.json(newUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

//create multiple users
app.post("/users", async (req, res) => {
  try {
    const usersWithId = req.body.map((user) => {
      return { id: uuidv4(), ...user };
    });

    const newUsers = await prisma.user.createMany({
      data: usersWithId,
    });
    res.status(201).json(newUsers);
  } catch (error) {
    console.error("Error creating users:", error);
    res.status(500).json({ error: "Failed to create users" });
  }
});

//get a user by id

app.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        houseOwned: true,
        houseBuilt: true,
      },
    });
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: "User not found" });
  }
});

//update a user by id

app.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { age } = req.body;
    const user = await prisma.user.update({
      where: { id },
      data: { age },
    });
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: "User not found" });
  }
});

//delete a user by id
app.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.delete({
      where: { id },
    });
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: "User not found" });
  }
});

//create a house
app.post("/house", async (req, res) => {
  try {
    const address = generateRandomAddress();
    const newHouse = await prisma.house.create({
      data: { address, ...req.body },
    });
    res.status(201).json(newHouse);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create house" });
  }
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
