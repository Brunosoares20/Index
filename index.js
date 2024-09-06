const axios = require('axios');
const express = require('express');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();

app.use(cors());

async function fetchAndParseHtml(url) {
    try {
        const { data: html } = await axios.get(url);

        const $ = cheerio.load(html);

        const results = [];

        $('article.item.tvshows').each((i, article) => {
            const title = $(article).find('.data h3 a').text().trim();
            const url = $(article).find('.data h3 a').attr('href');
            const date = $(article).find('.data span').text().trim();
            const description = $(article).find('.texto').text().trim();
            const genre = $(article).find('.genres .mta a').text().trim();
            const image = $(article).find('.poster img').attr('src');
            if (title) {
                results.push({
                    title,
                    url: url || 'N/A',
                    date: date || 'N/A',
                    description: description || 'N/A',
                    genre: genre || 'N/A',
                    image: image || 'N/A'
                });
            }
        });

        return results;

    } catch (error) {
        return { error: error.message };
    }
}
const url = 'https://novelasflixbr.net/novelas/';

app.get('/', async (req, res) => {
    const data = await fetchAndParseHtml(url);
    res.json(data);
});

app.get('*', (req, res) => {
    res.status(404).json({
      "error": "Rota não encontrada"
    });
  });
  
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});