const userProfile = {
  username: "snic",
  totalExpenses: 0,
  totalIncome: 0,
  budget: 0,
  transactions: [],
  totalTransactions: 0,
  addMoney: function (amount) {
    if (amount > 0) {
      this.totalIncome += amount;
      this.budget += amount;
      return true;
    }
    return false;
  },
  subtractMoney: function (amount) {
    if (this.budget - amount >= 0) {
      this.totalExpenses += amount;
      this.budget -= amount;
      return true;
    }
    return false;
  },
};
