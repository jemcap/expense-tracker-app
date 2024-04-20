const balance = document.getElementById("balance");
const moneyPlus = document.getElementById("income");
const moneyMinus = document.getElementById("expenses");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");

const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);

let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

// Add transaction to DOM
const addTransactionsDOM = (transaction) => {
  // Get sign whether it is minus or plus
  const sign = transaction.amount < 0 ? "-" : "+";
  //   Create list items dynamically
  const item = document.createElement("li");
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");
  item.innerHTML = `${transaction.item} <span>${sign}${Math.abs(
    transaction.amount
  ).toFixed(2)}</span><button class="delete-btn" onclick="removeTransaction(${
    transaction.id
  })">x</button>`;
  list.appendChild(item);
};

// Update total balance, income and expense
const updateExpensesDOM = () => {
  // get total amount
  const amount = transactions.map((transaction) => transaction.amount);
  // add up total
  const total = amount.reduce((acc, item) => (acc += item), 0).toFixed(2);
  // filter only income
  const income = amount
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);
  // filter only expenses
  const expenses = amount
    .filter((item) => item < 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  //   render balance
  balance.textContent =
    total < 0 ? `-£${Math.abs(total).toFixed(2)}` : `£${total}`;
  moneyPlus.textContent = `+£${Math.abs(income).toFixed(2)}`;
  moneyMinus.textContent = `-£${Math.abs(expenses).toFixed(2)}`;

  // apply class based on balance
  balance.classList.toggle("minus", Math.sign(total) === -1);
  balance.classList.toggle("plus", Math.sign(total) === 1);
};

const addTransaction = (e) => {
  e.preventDefault();
  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please input a value");
  } else {
    const transaction = {
      id: genRandID(),
      item: text.value,
      amount: +amount.value,
    };
    console.log(transaction);
    transactions.push(transaction);
    addTransactionsDOM(transaction);
    updateExpensesDOM();
    updateLocalStorage();
    text.value = "";
    amount.value = "";
  }
};

// Generate random ID
const genRandID = () => {
  return Math.floor(Math.random() * 100000000);
};

// remove transaction by ID
const removeTransaction = (id) => {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateLocalStorage();
  initApp();
};

// Update local storage transactions
const updateLocalStorage = () => {
  localStorage.setItem("transactions", JSON.stringify(transactions));
};

// Initialise app
const initApp = () => {
  list.innerHTML = "";
  transactions.forEach(addTransactionsDOM);
  updateExpensesDOM();
};

initApp();

form.addEventListener("submit", addTransaction);
