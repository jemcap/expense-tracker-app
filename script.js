const balance = document.getElementById("balance");
const moneyPlus = document.getElementById("income");
const moneyMinus = document.getElementById("expenses");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

const exampleTransactions = [
  { id: 1, item: "Book", amount: -20 },
  { id: 1, item: "Dividends", amount: 250 },
  { id: 1, item: "Candle", amount: -8.5 },
  { id: 1, item: "Camera", amount: -450 },
];

let transactions = exampleTransactions;

// Add transaction to DOM
const addTransactionsDOM = (transaction) => {
  // Get sign whether it is minus or plus
  const sign = transaction.amount < 0 ? "-" : "+";
  //   Create list items dynamically
  const item = document.createElement("li");
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");
  item.innerHTML = `${transaction.item} <span>${sign}${Math.abs(
    transaction.amount
  ).toFixed(2)}</span><button class="delete-btn">x</button>`;
  list.appendChild(item);
};

// Initialise app
const initApp = () => {
  item.innerHTML = "";
  transactions.forEach(addTransactionsDOM);
};

initApp();
