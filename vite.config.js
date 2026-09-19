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

              const customApiKey = req.headers['x-api-key'] || '';
              const openaiKey = customApiKey || process.env.OPENAI_API_KEY;
              const anthropicKey = customApiKey || process.env.ANTHROPIC_API_KEY;
              const geminiKey = customApiKey || process.env.GEMINI_API_KEY;

              // 1. Try Gemini API if key is present
              if (geminiKey) {
                try {
                  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`;
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
                  console.warn('Gemini extraction error:', e);
                }
              }

              // 2. Try OpenAI API if key is present
              if (openaiKey) {
                try {
                  const oRes = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${openaiKey}`
                    },
                    body: JSON.stringify({
                      model: 'gpt-4o-mini',
                      messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: `BROCHURE TEXT TO EXTRACT:\n${text.substring(0, 12000)}` }
                      ],
                      response_format: { type: 'json_object' }
                    })
                  });
                  if (oRes.ok) {
                    const oData = await oRes.json();
                    const content = oData.choices?.[0]?.message?.content;
                    if (content) {
                      res.statusCode = 200;
                      res.end(content);
                      return;
                    }
                  }
                } catch (e) {
                  console.warn('OpenAI extraction error:', e);
                }
              }

              // 3. Try Anthropic API if key is present
              if (anthropicKey) {
                try {
                  const aRes = await fetch('https://api.anthropic.com/v1/messages', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'x-api-key': anthropicKey,
                      'anthropic-version': '2023-06-01'
                    },
                    body: JSON.stringify({
                      model: 'claude-3-5-haiku-20241022',
                      max_tokens: 2048,
                      system: systemPrompt,
                      messages: [
                        { role: 'user', content: `BROCHURE TEXT TO EXTRACT:\n${text.substring(0, 12000)}` }
                      ]
                    })
                  });
                  if (aRes.ok) {
                    const aData = await aRes.json();
                    const textOut = aData.content?.[0]?.text;
                    if (textOut) {
                      res.statusCode = 200;
                      res.end(textOut);
                      return;
                    }
                  }
                } catch (e) {
                  console.warn('Anthropic extraction error:', e);
                }
              }

              // If no live API keys were configured, return a status code allowing client fallback
              res.statusCode = 404;
              res.end(JSON.stringify({ note: 'No live cloud LLM API key configured in backend, client will use semantic heuristic NLP parser.' }));
            } catch (err) {
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        });
      }
    }
  ]
});
