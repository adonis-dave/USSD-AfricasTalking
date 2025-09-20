const express = require("express");
const sendSMS = require("./SMS.js");
require("dotenv").config();

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Handle incoming SMS webhook from Africa's Talking
app.post("/incoming-sms", async (req, res) => {
    const { from, text, to, date, id } = req.body;

    // Validate incoming request
    if (!from || !text) {
        console.error("Invalid SMS webhook data:", req.body);
        return res.status(400).json({ status: "error", message: "Invalid data" });
    }

    console.log("Received SMS:", { from, text, to, date, id });

    // Process the incoming message
    const responseMessage = processMessage(from, text);

    // Send response SMS
    try {
        await sendSMS(from, responseMessage);
        res.status(200).json({ status: "success", message: "Response sent" });
    } catch (error) {
        console.error("Failed to send SMS response:", error);
        res.status(500).json({ status: "error", message: "Failed to send response" });
    }
});

// Process incoming SMS and generate response
function processMessage(from, text) {
    const normalizedText = text.trim().toUpperCase();

    switch (normalizedText) {
        case "HELP":
            return "Welcome to our service! Send INFO for details, BALANCE to check your account, or SUPPORT for assistance.";
        case "INFO":
            return "Our service helps you manage tasks. Send HELP for commands or SUPPORT for assistance.";
        case "BALANCE":
            // Example: Fetch balance from database (replace with actual logic)
            return "Your account balance is 10,000 TZS. Send HELP for more commands.";
        case "SUPPORT":
            return "Contact support at +255123456789 or email support@example.com.";
        default:
            return "Unknown command. Send HELP for a list of commands.";
    }
}

// Test endpoint
app.get("/test", (req, res) => {
    res.send("Testing SMS Server");
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`SMS Server running on http://localhost:${PORT}`);
});