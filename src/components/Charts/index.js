import React from "react";
import { Line, Pie } from "@ant-design/charts";
import "../../App.css";

const Chartcomponent = ({ sortedTransactions }) => {
  // Prepare data for the line chart (date vs amount)
  const data = sortedTransactions.map((item) => ({
    date: item.date,
    amount: Number(item.amount),
  }));

  // Filter and summarize expense data by tag (handle undefined or missing tags)
  const newSpendings = Object.values(
    sortedTransactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((acc, { tag, amount }) => {
        const cleanTag =
          typeof tag === "string" && tag.trim() !== ""
            ? tag.trim()
            : "Uncategorized"; // fallback for missing/invalid tags
        const amt = Number(amount);
        if (!acc[cleanTag]) {
          acc[cleanTag] = { tag: cleanTag, amount: amt };
        } else {
          acc[cleanTag].amount += amt;
        }
        return acc;
      }, {})
  );

  // Line chart configuration
  const config = {
    data,
    width: 500,
    autoFit: true,
    xField: "date",
    yField: "amount",
  };

  // Pie chart configuration (for expenses only)
  const spendingConfig = {
    data: newSpendings,
    width: 500,
    angleField: "amount",
    colorField: "tag",
  };

  return (
    <div
      className="charts-wrapper"
      style={{
        width: "96%",
        display: "flex",
        justifyContent: "space-around",
        height: "auto",
        margin: "2rem",
      }}
    >
      <div
        style={{
          width: "50%",
          padding: "2rem",
          borderRadius: "0.5rem",
          boxShadow: "var(--shadow)",
          margin: "1rem",
        }}
      >
        <h2 style={{ marginTop: 0, textAlign: "center" }}>
          Financial Statistics
        </h2>
        <Line {...config} />
      </div>
      <div
        style={{
          width: "50%",
          padding: "2rem",
          borderRadius: "0.5rem",
          boxShadow: "var(--shadow)",
          margin: "1rem",
        }}
      >
        <h2 style={{ marginTop: 0, textAlign: "center" }}>Total Spending</h2>
        <Pie {...spendingConfig} />
      </div>
    </div>
  );
};

export default Chartcomponent;
