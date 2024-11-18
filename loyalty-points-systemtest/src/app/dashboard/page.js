"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then(setUsers);

    fetch("/api/transactions")
      .then((res) => res.json())
      .then(setTransactions);
  }, []);

  return (
    <div>
      <h1>Storefront Dashboard</h1>
      <section>
        <h2>Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              {user.name} - Points: {user.points}
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2>Transactions</h2>
        <ul>
          {transactions.map((transaction) => (
            <li key={transaction._id}>
              User: {transaction.userId.name} - Points: {transaction.points} - Type: {transaction.type}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
