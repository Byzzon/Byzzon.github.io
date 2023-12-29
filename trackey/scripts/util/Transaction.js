export default class Transaction {
  static totalTransactions = 0;
  static TransactionType = Object.freeze({
    INCOME: "income",
    EXPENSE: "expense",
  });

  constructor(id, amount, description, category, date, type) {
    this.id = id;
    this.amount = amount;
    this.description = description;
    this.category = category;
    this.date = date;
    this.addedAt = new Date().getTime();
    this.type = type;

    this.totalTransactions += 1;
  }
}
