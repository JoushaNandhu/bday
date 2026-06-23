// Local Development Server: server.js
// Runs both the static web pages and the secure /api/blessing backend locally on Port 3000.
// Does NOT require npm installs - run using `node server.js`

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const https = require('https');

const PORT = 3000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // 1. SECURE API ROUTE (Simulates Vercel serverless function locally)
    if (pathname === '/api/blessing') {
        const mood = parsedUrl.query.mood;
        if (!mood) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Mood parameter is required' }));
            return;
        }

        // Use process.env key or the temp fallback key
        const apiKey = process.env.GEMINI_API_KEY || "AIzaSyCYjvj1tnhqGJnTbySQB-2-lj8FahRmSLQ";
        
        const prompt = `You are a comforting, inspiring Christian AI pastor. You are generating a highly personalized birthday blessing and scripture encouragement for a girl named Jerslin Silviya who is turning 19 today. Her current heart focus is: ${mood}. Generate: 1. A fitting Bible verse (with text and reference). 2. A beautiful, personalized 3-sentence birthday prayer focusing on her seeking ${mood}. 3. A short, encouraging 3-sentence summary of a Bible character who exemplified or overcame struggles related to ${mood}. Do not use markdown headers, list markers, or bullet points. Format the output in three clear, separate paragraphs.`;

        const dataStr = JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
        });

        const apiReq = https.request(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(dataStr)
                }
            },
            (apiRes) => {
                let body = '';
                apiRes.on('data', (chunk) => body += chunk);
                apiRes.on('end', () => {
                    try {
                        if (apiRes.statusCode !== 200) {
                            throw new Error(`Gemini API returned status ${apiRes.statusCode}: ${body}`);
                        }
                        const data = JSON.parse(body);
                        
                        if (!data.candidates || data.candidates.length === 0) {
                            throw new Error("No response candidates returned");
                        }
                        
                        const textResponse = data.candidates[0].content.parts[0].text;
                        
                        res.writeHead(200, { 
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*' 
                        });
                        res.end(JSON.stringify({ text: textResponse }));
                    } catch (e) {
                        console.error("Local Server API Error: ", e);
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ error: e.message }));
                    }
                });
            }
        );

        apiReq.on('error', (e) => {
            console.error("Local Server API Request Error: ", e);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: e.message }));
        });

        apiReq.write(dataStr);
        apiReq.end();
        return;
    }

    // 2. STATIC FILES ROUTING
    // Clean the path to prevent directory traversal
    const safePath = pathname.replace(/^(\.\.[\/\\])+/, '');
    let filePath = path.join(__dirname, safePath === '/' ? 'index.html' : safePath);

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
    };

    const contentType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == 'ENOENT') {
                res.writeHead(404, { 'Content-Type': 'text/html' });
                res.end('<h1>404 Not Found</h1>', 'utf-8');
            } else {
                res.writeHead(500);
                res.end('Error loading static resource: ' + error.code + '\n');
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`Local Development Server running successfully!`);
    console.log(`Preview URL: http://localhost:${PORT}/`);
    console.log(`======================================================\n`);
});
