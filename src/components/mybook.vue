<template>
  <div>
    <h4 v-if="type === 'owned'">My Books ({{ books.length }})</h4>
    <h4 v-else>My Rentals ({{ books.length }})</h4>
    
    <marquee v-if="type === 'rented'" behavior="scroll" direction="left">
      All borrowed books are due for two weeks.
    </marquee>
    
    <div v-if="books.length === 0" class="alert alert-info">
      {{ type === 'owned' ? 'No books owned yet.' : 'No books rented yet.' }}
    </div>
    
    <div class="row" v-else>
      <div class="col-md-4 mb-3" v-for="(book, idx) in books" :key="book.bookId || book.id">
        <div class="card h-100 position-relative">
          <i
            v-if="isBookRead(book.bookId || book.id)"
            class="fas fa-check-circle text-success position-absolute top-0 end-0 m-2"
          ></i>
          <img
            v-if="book.image"
            :src="book.image"
            class="card-img-top"
            style="height: 180px; object-fit: cover"
          />
          <div class="card-body">
            <h5 class="card-title">{{ book.title }}</h5>
            <p class="card-text">{{ book.author }}</p>
            <span class="badge" :class="type === 'owned' ? 'bg-primary' : 'bg-success'">
              {{ type === 'owned' ? 'Owned' : 'Rented' }}
            </span>
            <div v-if="type === 'rented'" class="mt-2">
              <span class="badge bg-info">Return in: {{ getCountdown(book.bookId || book.id) }}</span>
            </div>
            <div class="d-flex align-items-center mt-2 gap-2">
              <button class="btn btn-outline-primary btn-sm" @click="viewBook(book)">
                <i class="fas fa-eye"></i> Read
              </button>
              <button
                class="btn btn-outline-secondary btn-sm"
                @click="$emit('show-comment', { book, idx, type })"
              >
                <i class="fas fa-comment"></i>
              </button>
              <button 
                v-if="type === 'owned'"
                class="btn btn-outline-success btn-sm" 
                @click="$emit('download-book', book)"
              >
                <i class="fas fa-download"></i>
              </button>
              <button
                v-if="type === 'rented'"
                class="btn btn-outline-danger btn-sm"
                @click="$emit('return-book', { bookId: book.bookId || book.id, idx })"
                disabled
              >
                <i class="fas fa-undo"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Reading Section -->
    <div v-if="selectedBook" class="reading-section mt-4">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h5>Reading: {{ selectedBook.title }}</h5>
        <button class="btn btn-outline-danger btn-sm" @click="$emit('close-reading')">
          <i class="fas fa-times"></i> Close Reading View
        </button>
      </div>
      <div v-if="selectedBook.pdfUrl || selectedBook.link || selectedBook.url" class="book-viewer">
        <iframe
          :src="getBookViewUrl(selectedBook)"
          class="book-iframe"
          frameborder="0"
          allowfullscreen
          sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
        ></iframe>
        <div class="mt-2">
          <small class="text-muted">
            <i class="fas fa-external-link-alt"></i>
            <a :href="getBookViewUrl(selectedBook)" target="_blank" class="ms-1">
              Open in new tab
            </a>
          </small>
        </div>
      </div>
      <div v-else class="alert alert-warning">
        No PDF or reading link available for this book.
        <br>
        <small class="text-muted">Book ID: {{ selectedBook.bookId || selectedBook.id }}</small>
        <br>
        <small class="text-muted">Available properties: {{ Object.keys(selectedBook).join(', ') }}</small>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BooksSection',
  props: {
    books: {
      type: Array,
      required: true
    },
    type: {
      type: String,
      required: true,
      validator: value => ['owned', 'rented'].includes(value)
    },
    readBooks: {
      type: Set,
      required: true
    },
    selectedBook: {
      type: Object,
      default: null
    },
    countdownDisplays: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['view-book', 'show-comment', 'download-book', 'return-book', 'close-reading'],
  methods: {
    isBookRead(bookId) {
      return this.readBooks.has(bookId)
    },
    getCountdown(bookId) {
      return this.countdownDisplays[bookId] || 'No timer'
    },
    viewBook(book) {
      console.log('Viewing book:', book)
      console.log('Available book properties:', Object.keys(book))
      console.log('PDF URL:', book.pdfUrl)
      console.log('Link:', book.link)
      console.log('URL:', book.url)
      
      // Check if book has a viewable link
      const viewableUrl = book.pdfUrl || book.link || book.url
      if (viewableUrl) {
        console.log('Using URL:', viewableUrl)
      } else {
        console.warn('No viewable URL found for book:', book.title)
      }
      
      this.$emit('view-book', book)
    },
    getBookViewUrl(book) {
      // Priority order: pdfUrl, link, url
      const url = book.pdfUrl || book.link || book.url
      
      if (!url) return ''
      
      // If it's a Google Drive link, convert to embeddable format
      if (url.includes('drive.google.com') && url.includes('/file/d/')) {
        const fileId = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)?.[1]
        if (fileId) {
          return `https://drive.google.com/file/d/${fileId}/preview`
        }
      }
      
      // If it's a Google Docs link, add embed parameter
      if (url.includes('docs.google.com')) {
        return url.includes('?') ? `${url}&embedded=true` : `${url}?embedded=true`
      }
      
      // For other URLs, return as is
      return url
    }
  }
}
</script>

<style scoped>
.reading-section {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 70vw;
  height: 90vh;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

.book-viewer {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.book-iframe {
  width: 100%;
  height: 76vh;
  border: none;
  border-radius: 4px;
  flex-grow: 1;
}

@media (max-width: 900px) {
  .reading-section {
    position: fixed;
    top: 10px;
    height: 80vh;
    width: 90%;
    transform: translateX(-50%);
  }

  .book-iframe {
    height: 60vh;
    overflow-y: auto;
  }
}
</style>