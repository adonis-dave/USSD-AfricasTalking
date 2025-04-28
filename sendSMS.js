const AfricasTalking = require("africastalking");

// Initialize Africa's Talking SDK
const africastalking = AfricasTalking({
    apiKey: "atsk_30580bb14a233d096ac869ad7bf5dd3533d1143cd8b710b43b3c1867c2e017d32e44df60", // Replace with your Africa's Talking API key
    username: "TEST", // Use 'sandbox' for testing
});


module.exports = async function sendSMS(number, message) {
    // TODO: Send message
    try {
        const result=await africastalking.SMS.send({
          to: number, 
          message: message,
          
        });
        console.log(result);
      } catch(ex) {
        console.error(ex);
      } 
};
// Function to send SMS
