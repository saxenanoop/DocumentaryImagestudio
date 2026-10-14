import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    port: 3000,
    open: false
  },
  plugins: [
    {
      name: 'documentary-llm-endpoint',
      configureServer(server) {
        server.middlewares.use('/api/extract-brochure', async (req, res, next) => {
          if (req.method !== 'POST') {
            return next();
          }

          let bodyStr = '';
          req.on('data', chunk => {
            bodyStr += chunk;
          });

          req.on('end', async () => {
            res.setHeader('Content-Type', 'application/json');
            try {
              const { text, systemPrompt } = JSON.parse(bodyStr || '{}');
              if (!text) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'No text provided' }));
                return;
              }

              const geminiKey = customApiKey || process.env.GEMINI_API_KEY || '';

              // Extract campaign structure via Google Gemini API
              if (geminiKey) {
                const geminiCandidateModels = [
                  'gemini-2.5-flash',
                  'gemini-3.8-flash',
                  'gemini-flash-latest',
                  'gemini-3.1-flash-lite'
                ];
                for (const model of geminiCandidateModels) {
                  try {
                    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
                    const gRes = await fetch(geminiUrl, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        contents: [{ parts: [{ text: `${systemPrompt}\n\nBROCHURE TEXT TO EXTRACT:\n${text.substring(0, 12000)}` }] }],
                        generationConfig: { responseMimeType: "application/json" }
                      })
                    });
                    if (gRes.ok) {
                      const gData = await gRes.json();
                      const rawJson = gData.candidates?.[0]?.content?.parts?.[0]?.text;
                      if (rawJson) {
                        res.statusCode = 200;
                        res.end(rawJson);
                        return;
                      }
                    }
                  } catch (e) {
                    console.warn(`Gemini (${model}) extraction error:`, e);
                  }
                }
              }

              res.statusCode = 404;
              res.end(JSON.stringify({ note: 'Gemini extraction complete, falling back to semantic parser if needed.' }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        });

        server.middlewares.use('/api/gemini/generate', async (req, res, next) => {
          if (req.method !== 'POST') return next();

          let bodyStr = '';
          req.on('data', chunk => { bodyStr += chunk; });
          req.on('end', async () => {
            res.setHeader('Content-Type', 'application/json');
            try {
              const { prompt, systemInstruction, temperature = 0.7 } = JSON.parse(bodyStr || '{}');
              if (!prompt) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Prompt is required' }));
                return;
              }

              const geminiKey = customApiKey || process.env.GEMINI_API_KEY || '';

              const candidateModels = [
                'gemini-2.5-flash',
                'gemini-3.8-flash',
                'gemini-flash-latest',
                'gemini-3.1-flash-lite'
              ];

              for (const model of candidateModels) {
                try {
                  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`;
                  const payload = {
                    contents: [{ parts: [{ text: systemInstruction ? `${systemInstruction}\n\n${prompt}` : prompt }] }],
                    generationConfig: { temperature }
                  };
                  const gRes = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                  });
                  if (gRes.ok) {
                    const data = await gRes.json();
                    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
                    if (text) {
                      res.statusCode = 200;
                      res.end(JSON.stringify({ text }));
                      return;
                    }
                  }
                } catch (e) {
                  console.warn(`Gemini middleware error with ${model}:`, e);
                }
              }

              res.statusCode = 502;
              res.end(JSON.stringify({ error: 'Gemini service unavailable. Please check API key permissions.' }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        });

        // Replicate Account Test Middleware
        server.middlewares.use('/api/replicate/test', async (req, res, next) => {
          res.setHeader('Content-Type', 'application/json');
          const token = req.headers['authorization']?.replace('Bearer ', '') || req.headers['x-api-key'] || process.env.REPLICATE_API_TOKEN || '';
          try {
            const r = await fetch('https://api.replicate.com/v1/account', {
              headers: { 'Authorization': `Bearer ${token.trim()}` }
            });
            const data = await r.json();
            if (r.ok) {
              res.statusCode = 200;
              res.end(JSON.stringify({ ok: true, username: data.username, github_url: data.github_url }));
            } else {
              res.statusCode = r.status;
              res.end(JSON.stringify({ ok: false, error: data.detail || 'Invalid Replicate token' }));
            }
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ ok: false, error: err.message }));
          }
        });

        // Replicate Prediction Generation Middleware
        server.middlewares.use('/api/replicate/generate', async (req, res, next) => {
          if (req.method !== 'POST') return next();

          let bodyStr = '';
          req.on('data', chunk => { bodyStr += chunk; });
          req.on('end', async () => {
            res.setHeader('Content-Type', 'application/json');
            try {
              const { prompt, model = 'minimax', version = '5aa835260ff7f40f4069c41185f72036accf99e29957bb4a3b3a911f3b6c1912' } = JSON.parse(bodyStr || '{}');
              if (!prompt) {
                res.statusCode = 400;
                res.end(JSON.stringify({ error: 'Prompt is required' }));
                return;
              }

              const token = req.headers['authorization']?.replace('Bearer ', '') || req.headers['x-api-key'] || process.env.REPLICATE_API_TOKEN || '';

              const r = await fetch('https://api.replicate.com/v1/predictions', {
                method: 'POST',
                headers: {
                  'Authorization': `Bearer ${token.trim()}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  version,
                  input: {
                    prompt,
                    prompt_optimizer: true
                  }
                })
              });

              const data = await r.json();
              res.statusCode = r.status;
              res.end(JSON.stringify(data));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        });

        // Replicate Prediction Status Polling Middleware
        server.middlewares.use('/api/replicate/status', async (req, res, next) => {
          const urlObj = new URL(req.url, 'http://localhost');
          const id = urlObj.searchParams.get('id');
          if (!id) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Prediction ID required' }));
            return;
          }

          res.setHeader('Content-Type', 'application/json');
          const token = req.headers['authorization']?.replace('Bearer ', '') || req.headers['x-api-key'] || process.env.REPLICATE_API_TOKEN || '';

          try {
            const r = await fetch(`https://api.replicate.com/v1/predictions/${id}`, {
              headers: { 'Authorization': `Bearer ${token.trim()}` }
            });
            const data = await r.json();
            res.statusCode = r.status;
            res.end(JSON.stringify(data));
          } catch (err) {
            res.statusCode = 500;
            res.end(JSON.stringify({ error: err.message }));
          }
        });
      }
    }
  ]
});
