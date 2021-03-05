import axios from 'axios'

const API_HOST = `https://newsapi.org/v2`
const API_KEY = `?apiKey=91b32aebcee8429db94b112239314399`

export default class NewsAPI {
  static async http(url, query = null) {

    const endpoint = query ? `${API_HOST}${url}${API_KEY}${query}` : `${API_HOST}${url}${API_KEY}`
    let res
    try {
      res = await axios(endpoint)
      res = res.data
    } catch (e) {
      res = {
        error: 'ошибка',
        msg: e,
      }
    }
    return res
  }
  static get(url, query = null) {
    return NewsAPI.http(url, query)
  }

  static everythingNews(page, query = null) {
    return NewsAPI.get(`/everything`, `&q=all&pageSize=5&page=${page}`)
  }
  static getEverythingWithSorting(string) {
    return NewsAPI.get(`/everything`, `&q=all${string}`)
  }
  static getSourse() {
    return NewsAPI.get(`/sources`)
  }
  static getNewsBySourse(queryString) {
    return NewsAPI.get(`/everything`, `${queryString}`)
  }
}
