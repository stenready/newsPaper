export default function createResArticlesData(data) {
  const resArticle = {}
  resArticle.totalResults = data.totalResults
  resArticle.data = data.articles.map((el) => {
    el.slug = el.title.split(' ').join('_')
    return el
  })
  return resArticle;
}
