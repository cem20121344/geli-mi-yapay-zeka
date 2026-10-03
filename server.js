require("dotenv").config();
const http = require("http");
const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === "POST" && req.url === "/chat") {

        let body = "";

        req.on("data", chunk => {
            body += chunk;
        });

        req.on("end", async () => {

            try {
                const data = JSON.parse(body);
                const message = data.message;

                if (!message) {
                    res.writeHead(400, {
                        "Content-Type": "application/json; charset=utf-8"
                    });

                    res.end(JSON.stringify({
                        error: "Mesaj boş."
                    }));

                    return;
                }

                const response = await client.responses.create({
                    model: "gpt-5-mini",
                    input: message
                });

                res.writeHead(200, {
                    "Content-Type": "application/json; charset=utf-8"
                });

                res.end(JSON.stringify({
                    answer: response.output_text
                }));

            } catch (error) {

                console.error(error);

                res.writeHead(500, {
                    "Content-Type": "application/json; charset=utf-8"
                });

                res.end(JSON.stringify({
                    error: "Yapay zeka cevap verirken hata oluştu."
                }));
            }
        });

        return;
    }

    res.writeHead(404);
    res.end("Bulunamadı.");
});

server.listen(PORT, "0.0.0.0", () => {
    console.log(`CemGPT sunucusu ${PORT} portunda çalışıyor!`);
});