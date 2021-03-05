<template>
  <div class="one_news">
    <nuxt-link :to="`/article/${article.slug}?sourse=${article.source.id || article.source.name}&publishedAt=${article.publishedAt}`" :title="article.title">
      <div class="card">
        <img
          :src="article.urlToImage"
          class="card-img-top"
          :alt="article.title"
        />
        <div class="card-body">
          <h5 class="card-title">{{ article.title }}</h5>
          <p class="card-text">{{ article.description && article.description.slice(0, 150) }}...</p>
          <button class="btn btn-primary">show full</button>
        </div>
      </div>
    </nuxt-link>
  </div>
</template>

<script>
export default {
  name: 'OneNews',
  props: {
    article: {
      required: true,
      type: Object,
    },
  },
}
</script>

<style lang="scss">
.one_news {
  .card-text{
    color: black;
  }
  height: 100%;
  a{
    text-decoration: none;
  }
}
.card {
  height: 100%;
}
img {
  height: 200px;
  min-height: 200px;
  // object-fit: cover;
}
</style>