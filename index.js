const express = require("express");
const AfricasTalking = require("africastalking");
const sendSMS = require("./sendSMS.js");
const premiumSMS = require("./2waySMS.js");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.get("/api/test", (req, res) => {
  res.send("Testing Server");
});

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
    await premiumSMS(from, responseMessage);
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

app.post("/ussd", (req, res) => {
  const { sessionId, serviceCode, phoneNumber, text } = req.body;

  let response = "";

  if (text === "") {
    response = `CON SITE YANGU
        1. Tafuta kazi
        2. Angalia upatikanaji wa vifaa
        3. Mfumo wa usalama wa ujenzi
        4. Mahudhurio
        5. Msaada
        `;
  } else if (text === "1") {
    response = `CON Chagua eneo la kazi
        1. DAR ES SALAAM
        2. MWANZA
        0. Rudi nyuma`;
  } else if (text === "1*0") {
    response = `CON SITE YANGU
        1. Tafuta kazi
        2. Angalia upatikanaji wa vifaa
        3. Mfumo wa usalama wa ulinzi
        4. Mahudhurio
        5. Msaada`;
  } else if (text === "1*1") {
    response = `CON DAR ES SALAAM
        Kazi zilizopo Dar es salaam leo:
            1. Ujenzi wa Barabara-Kawe
            2. Ujenzi wa Nyumba-Kinondoni
            3. Ujenzi wa Soko-Kariakoo
            0. Rudi nyuma`;
  } else if (text === "1*1*0") {
    response = `CON SITE YANGU
        1. Tafuta kazi
        2. Angalia upatikanaji wa vifaa
        3. Mfumo wa usalama wa ulinzi
        4. Mahudhurio
        5. Msaada`;
  } else if (text === "1*1*1") {
    response = `CON Maelezo ya kazi
          -Malipo: 12,000/Siku
          -Sifa za mfanyakazi: Afya njema
          -Malelezo mengine: Mwaminifu, mchapakazi
          1. Kubali
          0. Rudi nyuma`;
  } else if (text === "1*1*1*1") {
    // Send SMS to the user
    sendSMS('+255654255717', "Ombi lako limepokelewa. Utatafutwa muda si punde. \nTuma neno HELP kwenda namba 5552 kwa maelezo zaidi.");
    // premiumSMS('');

    response = `END Ombi lako limepokelewa. Utatafutwa muda si punde.`;
  } else if (text === "1*1*1*0") {
    response = `CON SITE YANGU
        1. Tafuta kazi
        2. Angalia upatikanaji wa vifaa
        3. Mfumo wa usalama wa ulinzi
        4. Mahudhurio
        5. Msaada`;
  } else if (text === "1*1*2") {
    response = `CON Maelezo ya kazi
          -Malipo: 12,000/Siku
          -Sifa za mfanyakazi: Afya njema
          -Malelezo mengine: Mwaminifu, mchapakazi
          1. Kubali
          0. Rudi nyuma`;
  } else if (text === "1*1*2*1") {
    // Send SMS to the user
    sendSMS("+255654255717", "Asante kwa kukubali kazi. Tafadhali wasiliana na +255654255717 kwa maelezo zaidi.");

    response = `END Asante kwa kukubali kazi. Utatafutwa muda si punde.`;
  } else if (text === "1*1*2*0") {
    response = `CON SITE YANGU
        1. Tafuta kazi
        2. Angalia upatikanaji wa vifaa
        3. Mfumo wa usalama wa ulinzi
        4. Mahudhurio
        5. Msaada`;
  } else if (text === "1*1*3") {
    response = `CON Maelezo ya kazi
          -Malipo: 12,000/Siku
          -Sifa za mfanyakazi: Afya njema
          -Malelezo mengine: Mwaminifu, mchapakazi
          1. Kubali
          0. Rudi nyuma`;
  } else if (text === "1*1*3*1") {
    // Send SMS to the user
    sendSMS('+255654255717', "Asante kwa kukubali kazi. Tafadhali wasiliana na +255654255717 kwa maelezo zaidi.");

    response = `END Asante kwa kukubali kazi. Utatafutwa muda si punde.`;
  } else if (text === "1*1*3*0") {
    response = `CON SITE YANGU
        1. Tafuta kazi
        2. Angalia upatikanaji wa vifaa
        3. Mfumo wa usalama wa ulinzi
        4. Mahudhurio
        5. Msaada`;
  }

  // TUTAENDELEA BAADAE NA PART Mwanza
  else if (text === "2") {
    response = `CON Chagua
        1. Saruji
        2. Mchanga
        3. Mabati
        4. Mengine
        0. Rudi nyuma`;
  } else if (text === "2*0") {
    response = `CON SITE YANGU
        1. Tafuta kazi
        2. Angalia upatikanaji wa vifaa
        3. Mfumo wa usalama wa ulinzi
        4. Mahudhurio
        5. Msaada`;
  } else if (text === "2*1") {
    response = `CON Idadi
        1. 1-10
        2. 11-50
        3. 51-100
        0. Rudi nyuma`;
  } else if (text === "2*1*0") {
    response = `CON SITE YANGU
        1. Tafuta kazi
        2. Angalia upatikanaji wa vifaa
        3. Mfumo wa usalama wa ulinzi
        4. Mahudhurio
        5. Msaada`;
  } else if (text === "2*1*1") {
    response = `CON Saruji inapatikana:
        Msambazaji: Twiga Cement
        Bei: 13,500 Tsh/Mfuko
        1. Agiza
        0. Rudi nyuma`;
  } else if (text === "2*1*1*1") {
    // Send SMS to the user
    sendSMS(+255654255717, "Agizo lako limepokelewa. Twiga Cement watakupigia muda si punde.");

    response = `END Agizo lako limepokelewa. Twiga Cement watakupigia muda si punde.`;
  } else if (text === "2*1*1*0") {
    response = `CON SITE YANGU
        1. Tafuta kazi
        2. Angalia upatikanaji wa vifaa
        3. Mfumo wa usalama wa ulinzi
        4. Mahudhurio
        5. Msaada`;
  } else if (text === "2*1*2") {
    response = `CON Saruji inapatikana:
        Msambazaji: Tanga Cement
        Bei: 12,500 Tsh/Mfuko
        1. Agiza
        0. Rudi nyuma`;
  } else if (text === "2*1*2*1") {
    // Send SMS to the user
    sendSMS(+255654255717, "Agizo lako limepokelewa. Twiga Cement watakupigia muda si punde.");

    response = `END Agizo lako limepokelewa. Twiga Cement watakupigia muda si punde.`;
  } else if (text === "2*1*2*0") {
    response = `CON SITE YANGU
        1. Tafuta kazi
        2. Angalia upatikanaji wa vifaa
        3. Mfumo wa usalama wa ulinzi
        4. Mahudhurio
        5. Msaada`;
  }


  //TUTAENDELEA BAADAE PART MCHANGA!!!!!!!!!!!!!
  else if (text === "2*2") {
    response = `CON Mchanga unapatikana:
        Msambazaji: Mchanga Co.
        Bei: 8,000 Tsh/Mfuko`;
  }

  else if (text === "3") {
    response = `CON Karibu kwenye Mfumo wa Usalama wa Ujenzi:
        1. Ripoti hatari ya usalama
        2. Ripoti ajali imeshatokea
        3. Msaada
        0. Rudi nyuma`;
  } else if (text === "3*0") {
    response = `CON SITE YANGU
        1. Tafuta kazi
        2. Angalia upatikanaji wa vifaa
        3. Mfumo wa usalama wa ulinzi
        4. Mahudhurio
        5. Msaada`;
  }
  else if (text === "3*1") {
    response = `END Ripoti hatari ya usalama:
        Piga +2558 88 543 624 kutoa taarifa
        `;
  } else if (text === "3*1*0") {
    response = `CON SITE YANGU
        1. Tafuta kazi
        2. Angalia upatikanaji wa vifaa
        3. Mfumo wa usalama wa ulinzi
        4. Mahudhurio
        5. Msaada`;
  } else if (text === "3*1*1") {

    response = `END Ripoti yako imepokelewa. Tutachukua hatua haraka.`;
  }

  res.set("Content-Type: text/plain");
  res.send(response);
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`USSD Server running on http://localhost:${PORT}`);
});
