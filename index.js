// Função para obter e processar o HTML da URL fornecida
async function fetchAndParseHtml(url) {
    try {
        // Faz a requisição HTTP usando fetch
        const response = await fetch(url);

        // Verifica se a resposta foi bem-sucedida
        if (!response.ok) {
            throw new Error('Erro ao acessar a URL: ' + response.statusText);
        }

        // Obtém o HTML como texto
        const html = await response.text();

        // Cria um novo DOMParser e carrega o HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        // Cria um XPath para navegar no DOM
        const xpath = doc.evaluate.bind(doc);

        // Consulta para obter os dados dos artigos
        const articles = doc.querySelectorAll('article.item.tvshows');

        const results = [];

        articles.forEach((article) => {
            // Extrair título, URL, data, descrição, gênero e imagem
            const titleNode = xpath(".//div[@class='data']/h3/a", article, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const dateNode = xpath(".//div[@class='data']/span", article, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const descNode = xpath(".//div[@class='texto']", article, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const genreNode = xpath(".//div[@class='genres']/div[@class='mta']/a", article, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const imgNode = xpath(".//div[@class='poster']/img", article, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            // Obtém o texto e atributos, substitui por 'N/A' se não encontrado
            const title = titleNode ? titleNode.textContent.trim() : '';
            const url = titleNode ? titleNode.getAttribute('href') : '';
            const date = dateNode ? dateNode.textContent.trim() : '';
            const description = descNode ? descNode.textContent.trim() : '';
            const genre = genreNode ? genreNode.textContent.trim() : '';
            const image = imgNode ? imgNode.getAttribute('src') : '';

            // Adiciona ao resultado somente se o título não estiver vazio
            if (title) {
                const result = { title };

                if (url) result.url = url;
                if (date) result.date = date;
                if (description) result.description = description;
                if (genre) result.genre = genre;
                if (image) result.image = image;

                results.push(result);
            }
        });

        return results;

    } catch (error) {
        // Retorna o erro em formato de objeto
        return { error: error.message };
    }
}

// URL a ser requisitada
const url = 'https://novelasflixbr.net/novelas/';

// Obtém e processa os dados
fetchAndParseHtml(url).then((data) => {
    // Converte o array de resultados para uma string JSON
    const json = JSON.stringify(data, null, 2);

    // Exibe a string JSON no console
    console.log(json);
});