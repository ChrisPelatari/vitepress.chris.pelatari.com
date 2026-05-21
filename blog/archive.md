<div class="mdc-list">
  <div class="mdc-list-item elevated" v-for="post in posts" :key="post.slug">
    <span class="mdc-list-item__ripple"></span>
    <span class="mdc-list-item__text">
      <h3>
        📝 {{ new Date(post.slug.slice(0, 10)).toDateString() }}
      </h3>
      <a :href="`/posts/${post.slug}`">{{post.title}}</a>
      <div class="description">{{ post.description }}</div>
      <p class="text-caption">{{ post.excerpt }}</p>
    </span>
  </div>
</div>

<style>
@use "@material/list/mdc-list";
@include list.core-styles;

.description {
  margin-top: 1.618rem;
  padding: 0;
  font-size: 1rem;
  line-height: 1.5rem;
}

.elevated {
  box-shadow: 0 2px 2px -1px rgba(0, 0, 0, 0.2),
              0 1px 5px 0 rgba(0, 0, 0, 0.12),
              0 3px 1px -2px rgba(0, 0, 0, 0.14);
  padding: 1.618rem;
  border-radius: 0.5rem;
  margin-top: 1.618em;
  background-color: var(--vp-c-default-soft);
}
</style>

<script setup>
import postsJson from './posts.json'
const posts = [...postsJson].sort((a, b) => (a.slug < b.slug ? 1 : -1))
</script>
