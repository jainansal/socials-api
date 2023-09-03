import NewsAPI from 'newsapi'

const newsapi = new NewsAPI('b44ad62df3f84022a61a49e777c5a628')

export const getNews = async (req, res) => {
  try {
    const response = await newsapi.v2.everything({
      pageSize: 10,
      sources: 'bbc-news'
    })
    const data = []
    const articles = response.articles
    for(const article of articles) {
      data.push({
        title: article.title,
        url: article.url
      })
    }
    res.status(200).json(data)
  } catch (err) {
    res.status(500).send(`Error: ${err}`)
  }
}
