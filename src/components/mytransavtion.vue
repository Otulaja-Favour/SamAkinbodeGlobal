<template>
  <div>
    <h4>Transaction History</h4>
    <div v-if="transactionHistory.length === 0" class="alert alert-info">
      No transactions yet.
    </div>
    <div class="table-responsive" v-else>
      <table class="table table-bordered">
        <thead>
          <tr>
            <th>Book ID</th>
            <th>User ID</th>
            <th>Type</th>
            <th>Date</th>
            <th>Reference</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tx in transactionHistory" :key="tx.id">
            <td>{{ tx.bookId }}</td>
            <td>{{ tx.userId }}</td>
            <td class="text-capitalize">{{ getTransactionType(tx) }}</td>
            <td>{{ formatDate(tx.date || tx.createdAt) }}</td>
            <td>{{ tx.id }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TransactionsSection',
  props: {
    transactionHistory: {
      type: Array,
      required: true
    }
  },
  methods: {
    getTransactionType(transaction) {
      // Determine transaction type based on available data
      if (transaction.type) return transaction.type
      if (transaction.action) return transaction.action
      return 'Transaction'
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A'
      try {
        return new Date(dateString).toLocaleDateString()
      } catch (error) {
        return dateString
      }
    }
  }
}
</script>