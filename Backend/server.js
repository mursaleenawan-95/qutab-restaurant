require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { body, validationResult } = require("express-validator");
const app = express();

app.use(helmet({
    contentSecurityPolicy: false
}));
app.use(cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5500"]
}));
app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests from this IP, please try again later."
});

app.use(limiter);
const PORT = process.env.PORT || 3000;
const menuItems = [
    {
        category: "Starters",
        items: [
            { name: "Bruschetta", description: "Toasted bread topped with tomatoes, garlic, and basil.", price: 7.50 },
            { name: "Calamari Fritti", description: "Crispy fried squid served with lemon aioli.", price: 9.00 }
        ]
    },
    {
        category: "Main Courses",
        items: [
            { name: "Grilled Salmon", description: "Served with roasted vegetables and lemon butter sauce.", price: 18.99 },
            { name: "Truffle Pasta", description: "Creamy fettuccine with truffle oil and parmesan.", price: 16.50 }
        ]
    },
    {
        category: "Desserts",
        items: [
            { name: "Classic Tiramisu", description: "Espresso-soaked layers with mascarpone cream.", price: 8.99 }
        ]
    }
];

app.get("/", (req, res) => {
    res.send("Hello! Backend server is working.");
});

app.get("/api/menu", (req, res) => {
    res.json(menuItems);
});
app.post("/api/reservations",
    [
        body("name").trim().escape().notEmpty().withMessage("Name is required"),
        body("email").trim().isEmail().normalizeEmail().withMessage("Valid email is required"),
        body("phone").trim().escape().isLength({ min: 7 }).withMessage("Valid phone number is required"),
        body("date").trim().notEmpty().withMessage("Date is required"),
        body("time").trim().notEmpty().withMessage("Time is required"),
        body("guests").trim().escape().notEmpty().withMessage("Guests field is required"),
        body("message").trim().escape()
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const reservation = req.body;
        console.log("New reservation received:", reservation);
        res.json({ success: true, message: "Reservation received successfully!" });
    }
);
app.post("/api/contact",
    [
        body("name").trim().escape().notEmpty().withMessage("Name is required"),
        body("email").trim().isEmail().normalizeEmail().withMessage("Valid email is required"),
        body("subject").trim().escape().notEmpty().withMessage("Subject is required"),
        body("message").trim().escape().notEmpty().withMessage("Message is required")
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const contactMessage = req.body;
        console.log("New contact message received:", contactMessage);
        res.json({ success: true, message: "Message received successfully!" });
    }
);
app.use((req, res, next) => {
    res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, message: "Something went wrong. Please try again later." });
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});