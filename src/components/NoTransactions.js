import React from "react";
import transactions from "../assests/transactions.svg";

function NoTransactions() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "cnter",
        alignItems: "center",
        width: "100%",
        flexDirection: "column",
        marginBottom: "2rem",
      }}
    >
      <img
        src={transactions}
        alt=""
        style={{ width: "400px", margin: "4rem" }}
      />
      <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
        You Have No Transactions Currently
      </p>
    </div>
  );
}
export default NoTransactions;
