<template>
  <div class="container-fluid p-0">
    <navBar />

    <div class="hero container-fluid text-center my-4 py-4">
      <h4>Welcome to BookVault</h4>
      <p>Discover, Buy & Rent Your Favorite spiritual inspiring Books</p>
      <input
        type="search"
        v-model="search"
        class="form-control w-50 mx-auto"
        placeholder="Search for a book..."
      />
    </div>

    <h3 class="m-3">Popular Books</h3>

    <!-- Spinner Loader -->
    <div v-if="loading" class="spinner-container">
      <div class="spinner-border text-primary" role="status" style="width: 4rem; height: 4rem;">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <div class="row p-4" v-else>
      <div
        class="col-md-3 mb-4"
        v-for="book in randomBooks"
        :key="book.id"
      >
        <div class="card h-100">
          <img
            v-if="book.image"
            :src="book.image"
            class="card-img-top"
            alt="Book cover"
            style="height: 250px; object-fit: cover;"
          />
          <div class="card-body">
            <h5 class="card-title">{{ book.title }}</h5>
            <p class="card-text">{{ book.author }}</p>
            <p class="card-text">{{ book.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="text-center my-4 py-4">
      <RouterLink to="/books" class="btn btn-primary">
        View More <i class="fas fa-arrow-right"></i>
      </RouterLink>
    </div>
  </div>
  <footer class="text-white text-center  footer" style="background-color: #2c3e50; padding: 40px 0px; ">
    <div class="container">
      <p class="mb-0">© 2025 Library Management System. All rights reserved.</p>
    </div>
  </footer>
</template>

<script>
import navBar from '@/components/navBar.vue';
import booksstore from '@/stores/booksstore';

export default {
  components: { navBar },
  data() {
    return {
      books: [],
      search: "",
      loading: true
    }
  },
  computed: {
    filteredBooks() {
      if (!this.search) return this.books;
      const s = this.search.toLowerCase();
      return this.books.filter(
        (u) =>
          u.title?.toLowerCase().includes(s) ||
          u.author?.toLowerCase().includes(s) ||
          u.description?.toLowerCase().includes(s)
      );
    },
    randomBooks() {
      // Shuffle and pick 6 books from filteredBooks
      let arr = [...this.filteredBooks];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr.slice(0, 6);
    }
  },
  async mounted() {
    this.loading = true;
    // Fetch books from the bookstore API, not fetchBooks (should be fetchAllBooks)
    this.books = await booksstore.fetchAllBooks();
    this.loading = false;
  }
};
</script>

<style scoped>
.hero{
  background-color: whitesmoke;
}
.spinner-container {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>