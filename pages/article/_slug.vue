<template>
  <div class="single_post">
    <NavBar />
    <div class="container-fluid">
      <div class="wrap_single">
        <h1>
          {{ post.title }}
        </h1>
        <div class="row mt-2">
          <div class="col-lg-4 col-md-6 information_block">
            <div class="author_name">
              <span>Автор:</span>
              <span>{{ post.author }}</span>
            </div>
            <div class="main_sourse_link">
              <span>Источник:</span>
              <a
                href="https://www.engadget.com/disney-q4-2020-earnings-224854835.html"
                target="_blank"
                >Исходная новость</a
              >
            </div>
            <div class="sourse_info">
              <div class="sourse_info_item">
                <span>Категория:</span>
                <span> {{ sourse.category }} </span>
              </div>
              <div class="sourse_info_item">
                <span>Страна:</span>
                <span> {{ sourse.country }} </span>
              </div>
              <div class="sourse_info_item">
                <span>Издание:</span>
                <span> {{ sourse.name }} </span>
              </div>
              <div class="desc">
                {{ sourse.description }}
              </div>
              <div class="link">
                <a :href="sourse.url" target="_blank">{{ sourse.url }}</a>
              </div>
              <div class="date_publisher">
                <span>Дата публикации:</span>
                <span> {{ getPublishedDate }} </span>
              </div>
            </div>
          </div>

          <div class="col-lg-4 col-md-6">
            {{ post.description }}
          </div>
          <div class="col-lg-4 col-md-12 most_popular">
            Самыме популярные статьи этого автора
            <div class="news_top_wrap">
              <OneNews
                v-for="(news, idx) of topSourseNews.data"
                :key="idx"
                :article="news"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import API from '@/api'
import OneNews from '@/components/OneNews'
import createResArticlesData from '@/utils/createResArticlesData.js'
import localMoment from '@/utils/localMoment.js'
export default {
  name: 'SinglePost',
  components: { OneNews },
  async asyncData({ route, store, params, query, redirect, error }) {
    const title = route.params.slug.split('_').join(' ')
    let sourse, singlePost
    try {
      singlePost = await API.getNewsBySourse(
        `&q=${title}&source=${route.query.sourse}&publishedAt=${route.query.publishedAt}&pageSize=1`
      )
      sourse = await API.getSourse()
    } catch (e) {
      error('Ошибка ответа от сервера. Попробуйте позже!' + e)
    }
    sourse = sourse.sources.find(
      (el) => el.id || el.name === route.query.sourse
    )

    let topSourseNews = await API.getEverythingWithSorting(
      `&sources=${route.query.sourse}&sortBy=popularity&pageSize=10`
    )
    if (topSourseNews.status === 'ok') {
      topSourseNews = createResArticlesData(topSourseNews)
    } else {
      topSourseNews = []
    }
    return { post: singlePost.articles[0], sourse, topSourseNews }
  },
  computed: {
    getPublishedDate() {
      return localMoment('DD.MM.YYYY.hh.mm', this.post.publishedAt)
    },
  },
}
</script>

<style lang="scss" scoped>
.single_post {
  .most_popular {
    margin-top: 1rem;
  }
  h1 {
    margin-top: 1rem;
    text-align: center;
    margin-bottom: 2rem;
  }
  .information_block {
    .main_sourse_link {
      display: flex;
      justify-content: space-between;
    }
    .author_name,
    .date_publisher {
      display: flex;
      justify-content: space-between;
    }
    .sourse_info {
      .sourse_info_item {
        display: flex;
        justify-content: space-between;
      }
    }
  }
  @media (max-width: 992px) {
    .news_top_wrap {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      margin-top: 1rem;
      .one_news {
        width: 49%;
      }
    }
  }
  @media (max-width: 768px) {
    .information_block {
      margin-bottom: 1rem;
      background: lighten($color: #007bff, $amount: 5%);
      padding-top: 1rem;
      padding-bottom: 1rem;
      .link {
        a {
          color: black;
        }
      }
    }
  }
  @media (max-width: 600px) {
    .one_news {
      width: 100% !important;
    }
  }
}
</style>
