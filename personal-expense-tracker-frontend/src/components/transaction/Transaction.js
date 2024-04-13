import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Nav1 from "../shared/Nav1";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";

const Transaction = () => {
  const { userId, walletId } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [wallet, setWallet] = useState({ name: "Loading..." });

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/transaction/${walletId}`
        );
        // Ensure the response is an array before setting it
        if (Array.isArray(response.data)) {
          setTransactions(response.data);
        } else {
          // Log unexpected response for debugging
          console.error(
            "Expected an array of transactions, received:",
            response.data
          );
          setTransactions([]); // Clear transactions state if not an array
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    const fetchWalletDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/wallet/${userId}/${walletId}`
        );

        setWallet(response.data);
      } catch (error) {
        console.error("Error fetching wallet details:", error);
        setWallet({ name: "Error fetching wallet name" });
      }
    };

    fetchTransactions();
    fetchWalletDetails();
  }, [userId, walletId]); // Dependency on walletId ensures this effect runs again if the walletId changes

  // Data and options for the Doughnut Chart
  const doughnutData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: transactions.reduce(
          (acc, transaction) => {
            if (transaction.type === 1) {
              // Income
              acc[0] += transaction.amount;
            } else if (transaction.type === 2) {
              // Expense
              acc[1] += transaction.amount;
            }
            return acc;
          },
          [0, 0]
        ),
        backgroundColor: ["green", "#FF6384"],
        hoverBackgroundColor: ["lightgreen", "pink"],
      },
    ],
  };

  const doughnutData1 = {
    labels: [
      "Food",
      "Transport",
      "Entertainments",
      "Communication",
      "Cloths",
      "Toiletry",
      "Others",
    ],
    datasets: [
      {
        data: transactions.reduce(
          (acc, transaction) => {
            if (transaction.purpose === 1) {
              // Food
              acc[0] += transaction.amount;
            } else if (transaction.purpose === 2) {
              // Transport
              acc[1] += transaction.amount;
            } else if (transaction.purpose === 3) {
              // Entertainments
              acc[2] += transaction.amount;
            } else if (transaction.purpose === 4) {
              // Communication
              acc[3] += transaction.amount;
            } else if (transaction.purpose === 5) {
              // Cloths
              acc[4] += transaction.amount;
            } else if (transaction.purpose === 6) {
              // Toiletry
              acc[5] += transaction.amount;
            } else if (transaction.purpose === 7) {
              // Other
              acc[6] += transaction.amount;
            }
            return acc;
          },
          [0, 0, 0, 0, 0, 0, 0]
        ),
        backgroundColor: [
          "red",
          "yellow",
          "green",
          "blue",
          "orange",
          "pink",
          "purple",
        ],
        hoverBackgroundColor: [
          "pink",
          "lightyellow",
          "lightgreen",
          "lightblue",
          "lightorange",
          "pink",
          "lightpurple",
        ],
      },
    ],
  };

  return (
    <div>
      <Nav1 />
      <div className="container">
        <Link to={`/${userId}`} className="btn btn-default btn-lg mb-3">
          Back to Dashboard
        </Link>
        <Link
          to={`/user/${userId}/wallet/${walletId}/addTransaction`}
          className="btn btn-info btn-lg mb-3"
        >
          Record new Transaction
        </Link>
        <br />
        <div className="card text-center">
          <div className="card-header bg-success text-white">
            <h4>{wallet.name} - Balance</h4>
            <h1>Rs. {wallet.currentBalance}.00</h1>
          </div>
        </div>
        <hr />
        <div class="row justify-content-center">
          <div className="col-md-4">
            <Doughnut data={doughnutData} />
          </div>
          <div className="col-md-4">
            <Doughnut data={doughnutData1} />
          </div>
        </div>
        <br />
        <hr />

        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Description</th>
              <th scope="col">Amount</th>
              <th scope="col">Type</th>
              <th scope="col">Purpose</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr
                key={index}
                className={
                  transaction.type === 1 ? "table-success" : "table-danger"
                }
              >
                <td>
                  {new Date(transaction.transactionDate).toLocaleDateString()}
                </td>
                <td>{transaction.description}</td>
                <td>Rs. {transaction.amount}</td>
                <td>{transaction.type === 1 ? "Income" : "Expense"}</td>
                <td>
                  {transaction.purpose === 0
                    ? "Income"
                    : transaction.purpose === 1
                    ? "Food"
                    : transaction.purpose === 2
                    ? "Transport"
                    : transaction.purpose === 3
                    ? "Entertainments"
                    : transaction.purpose === 4
                    ? "Communication"
                    : transaction.purpose === 5
                    ? "Cloths"
                    : transaction.purpose === 6
                    ? "Toiletry"
                    : "Others"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Transaction;
