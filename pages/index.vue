<template>
  <div class="main_page">
    <NavBar />
    <div class="container-fluid">
      <div class="search_wrap">
        <div class="form-group form-search" style="margin-top: 2rem">
          <label for="search">Строка поиска</label>
          <div class="search_wrap">
            <input
              type="text"
              class="form-control"
              id="search"
              v-model="inputSearch"
            />
            <button ref="search-button" @click="searchHandler" class="btn btn-outline-success">Search</button>
          </div>
        </div>
      </div>

      <div class="news_wrap">
        <div class="left_source content_item bg-info">
          <div
            class="form-check"
            v-for="(el, idx) of sourses.sources"
            :key="idx"
          >
            <input
              v-model="chakedCategories"
              class="form-check-input"
              type="checkbox"
              :value="el.id"
              :id="`checkbox-${idx}`"
            />
            <label class="form-check-label" :for="`checkbox-${idx}`">
              {{ el.id }}
            </label>
          </div>
        </div>
        <div class="news_data content_item">
          <div
            class="item_news"
            v-for="(article, idx) of articles.data"
            :key="idx"
          >
            <OneNews :article="article" />
          </div>
        </div>

        <div class="news_filters content_item bg-danger">
          <div class="container_by_filters">
            <Dropdown
              @changeSelectDropdown="selectDropdownContry"
              :data="contries"
            />
            <Dropdown
              @changeSelectDropdown="selectDropdownSort"
              :data="sortData"
            />
            <Dropdown
              @changeSelectDropdown="selectDropdownPage"
              :data="pageDataArray"
            />
          </div>
        </div>
      </div>
      <Paginate
        v-if="Math.ceil(articles.totalResults / pageNum) > 1"
        :container-class="'pagination-wrap'"
        :page-class="'pagination-item'"
        v-model="page"
        :page-range="6"
        :clickHandler="changePage"
        :next-text="''"
        :prev-text="''"
        :page-count="Math.ceil(articles.totalResults / pageNum)"
      >
      </Paginate>
    </div>
  </div>
</template>

<script>
import contriesData from '@/utils/getContries'
import categories from '@/utils/categories'
import createResArticlesData from '@/utils/createResArticlesData.js'
import NavBar from '@/components/NavBar'

import API from '@/api'
import OneNews from '@/components/OneNews'
import Dropdown from '@/components/Dropdown'
import Paginate from 'vuejs-paginate/src/components/Paginate.vue'
export default {
  name: 'MainPage',
  async asyncData({ route, store, params, query, redirect, error }) {
    const page = route.query.page || 1
    let artclsResponse, responseSourses
    try {
      artclsResponse = await API.everythingNews(page)
      responseSourses = await API.getSourse()
    } catch (e) {
      console.log(e)
      error('Ошибка ответа от сервера. Попробуйте позже!' + e)
    }
    let articles = createResArticlesData(artclsResponse)
    let pageDataArray = ['5', '10', '20', '50', '100']
    let sortData = ['popularity', 'publishedAt', 'relevancy']
    return {
      articles,
      contries: contriesData,
      sortData,
      pageDataArray,
      sourses: responseSourses,
    }
  },
  components: { OneNews, Dropdown, Paginate, NavBar },
  data() {
    return {
      contry: '',
      inputSearch: '',
      categories: categories,
      chakedCategories: [],
      page: +this.$route.query.page || 1,
      sort: '',
      pageNum: 5,
      changeSortable: 0,
    }
  },
  computed: {
    getSortData() {
      let str = ''
      if (this.contry) {
        str += `&language=${this.contry}`
      }
      if (this.sort) {
        str += `&sortBy=${this.sort}`
      }
      if (this.pageNum) {
        str += `&pageSize=${this.pageNum}`
      }
      if (this.chakedCategories.length > 0) {
        str += `&sources=${this.chakedCategories.join(',')}`
      }
      str += `&page=${this.page}`
      return str
    },
  },
  watch: {
    async chakedCategories(value) {
      let queryString = `${value.join(',')}`
      queryString = queryString
        ? `${this.getSortData}&sources=${queryString}`
        : `${this.getSortData}`
      const response = await API.getEverythingWithSorting(queryString)
      this.articles = createResArticlesData(response)
    },
    async changeSortable(value) {
      const response = await API.getEverythingWithSorting(this.getSortData)
      const resArticle = createResArticlesData(response)
      this.articles = resArticle
    },
  },
  methods: {
    async searchHandler() {
      if (!this.inputSearch) return false
      const button = this.$refs['search-button']
      try {
        button.disabled = true
        const search = `&q=${this.inputSearch}${this.getSortData}`
        const searchData = await API.getNewsBySourse(search)
        this.articles = createResArticlesData(searchData)
         button.disabled = false
         this.inputSearch = ''
      } catch (e) {
        
      }
      console.log(this.getSortData)
    },
    changePage(page) {
      this.page = page
      this.$router.push(`/?page=${page}`)
      this.changeSortable = new Date()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    selectDropdownContry(idx) {
      this.changeSortable = new Date()
      this.contry = idx === 0 ? '' : this.contries[idx]
    },
    selectDropdownSort(idx) {
      this.sort = this.sortData[idx]
      this.changeSortable = new Date()
    },
    selectDropdownPage(idx) {
      this.pageNum = this.pageDataArray[idx]
      this.changeSortable = new Date()
    },
  },
  mounted() {},
}
</script>

<style lang="scss">
.main_page {
  .search_wrap{
    display: flex;
  }
  .left_source {
    padding-top: 1rem;
  }
  .form-check {
    margin-left: 1rem;
  }
  .pagination-wrap {
    list-style-type: none;
    display: flex;
    justify-content: center;
    .pagination-item {
      a {
        padding: 5px 10px;
        outline: none;
        color: black;
        text-decoration: none;
      }
      &.active {
        a {
          background: green;
          color: white;
        }
      }
    }
  }
  .news_filters {
    display: flex;
    justify-content: center;
    padding-top: 1rem;
    .container_by_filters {
      width: 80%;
      .dropdown {
        .dropdown-item {
          cursor: pointer;
        }
        width: 100%;
        margin-bottom: 1rem;
        .dropdown-menu,
        button {
          width: 100%;
        }
        button {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .dropdown-menu {
          max-height: 180px;
          overflow: auto;
          height: auto;
        }
      }
    }
  }
  .content_item {
    width: calc(100% / 3);
  }
  .left_source {
    max-height: 180px;
    overflow: auto;
    flex: 1 1;
  }
  .news_filters {
    flex: 1 1;
  }
  .news_data {
    display: flex;
    flex-wrap: wrap;
    flex: 2 2;
    padding: 10px;
    justify-content: space-between;
  }
  .news_wrap {
    display: flex;
    align-items: flex-start;
    flex-wrap: wrap;
    padding: 10px;
    .item_news {
      width: 49%;
      margin-bottom: 2rem;
    }
  }
  .search_wrap {
    display: flex;
    justify-content: center;
    .form-search {
      width: 50%;
    }
  }
  @media (max-width: 1200px) {
    .content_item {
      flex: auto;
    }
    .left_source,
    .news_filters {
      width: 45%;
      order: 1;
    }
    .news_data {
      width: 100%;
      order: 3;
    }
  }
  @media (max-width: 720px) {
    .left_source,
    .news_filters {
      width: 100%;
      order: 1;
      margin-bottom: 10px;
    }
    .form-group.form-search {
      width: 100%;
    }
  }
  @media (max-width: 540px) {
    .news_wrap {
      .item_news {
        width: 100% !important;
        margin-bottom: 2rem;
      }
    }
  }
}
</style>