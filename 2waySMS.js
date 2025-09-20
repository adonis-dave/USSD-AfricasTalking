const AfricasTalking = require("africastalking");
require("dotenv").config();

// Initialize Africa's Talking SDK
const africastalking = AfricasTalking({
  apiKey: process.env.AT_API_KEY,
  username: process.env.AT_USERNAME
});

async function premiumSMS(number, message) {
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      const result = await africastalking.SMS.send({
        to: number,
        message: message,
        from: "5552",
      });
      console.log('SMS sent successfully:', result);
      return result;
    } catch (ex) {
      attempts++;
      console.error(`SMS sending failed (attempt ${attempts}):`, ex);
      if (attempts >= maxAttempts) {
        console.error("Max retry attempts reached. SMS not sent.");
        throw new Error("Failed to send SMS after maximum attempts.");
      }
    }
  }
}

module.exports = premiumSMS;