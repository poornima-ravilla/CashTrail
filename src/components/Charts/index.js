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

// import React from "react";
// import { Line, Pie } from "@ant-design/charts";
// import "../../App.css";

// const Chartcomponent = ({ sortedTransactions }) => {
//   // Prepare data for the line chart (date vs amount)
//   const data = sortedTransactions.map((item) => ({
//     date: item.date,
//     amount: Number(item.amount),
//   }));

//   // Filter and summarize expense data by tag
//   const newSpendings = Object.values(
//     sortedTransactions
//       .filter((transaction) => transaction.type === "expense")
//       .reduce((acc, { tag, amount }) => {
//         const amt = Number(amount);
//         if (!acc[tag]) {
//           acc[tag] = { tag, amount: amt };
//         } else {
//           acc[tag].amount += amt;
//         }
//         return acc;
//       }, {})
//   );

//   // Line chart configuration
//   const config = {
//     data,
//     width: 500,
//     autoFit: true,
//     xField: "date",
//     yField: "amount",
//   };

//   // Pie chart configuration (for expenses only)
//   const spendingConfig = {
//     data: newSpendings,
//     width: 500,
//     angleField: "amount",
//     colorField: "tag",
//     label: {
//       content: ({ amount }) => `${amount}`, // Simple label to avoid shape.inner error
//       style: {
//         fontSize: 12,
//         fill: "#000",
//       },
//     },
//   };

//   return (
//     <div
//       className="charts-wrapper"
//       style={{
//         width: "91%",
//         display: "flex",
//         justifyContent: "space-between",
//         height: "auto",
//         padding: "2rem",
//         borderRadius: "0.5rem",
//         boxShadow: "var(--shadow)",
//         margin: "2rem",
//       }}
//     >
//       <div>
//         <h2 style={{ marginTop: 0 }}>Your Analytics</h2>
//         <Line {...config} />
//       </div>
//       <div>
//         <h2>Your Spending</h2>
//         <Pie {...spendingConfig} />
//       </div>
//     </div>
//   );
// };

// export default Chartcomponent;

// import React from "react";
// import { Line, Pie } from "@ant-design/charts";
// import "../../App.css";

// const Chartcomponent = ({ sortedTransactions }) => {
//   const data = sortedTransactions.map((item) => {
//     return { date: item.date, amount: item.amount };
//   });
//   // const spendingData = sortedTransactions.filter((transaction) => {
//   //   if (transaction.type == "expense") {
//   //     return { tag: transaction.tag, amount: transaction.amount };
//   //   }
//   // });
//   const spendingData = sortedTransactions
//     .filter((transaction) => transaction.type === "expense")
//     .map((transaction) => ({
//       tag: transaction.tag,
//       amount: transaction.amount,
//     }));

//   let finalSpendings = spendingData.reduce((acc, obj) => {
//     let key = obj.tag;
//     if (!acc[key]) {
//       acc[key] = { tag: obj.tag, amount: obj.amount };
//     } else {
//       acc[key].amount += obj.amount;
//     }
//     return acc;
//   }, {});

//   let newSpendings = [
//     { tag: "food", amount: 0 },
//     { tag: "education", amount: 0 },
//     { tag: "office", amount: 0 },
//   ];

//   spendingData.forEach((item) => {
//     const amt = Number(item.amount); // Ensure it's a number
//     if (item.tag === "food") {
//       newSpendings[0].amount += amt;
//     } else if (item.tag === "education") {
//       newSpendings[1].amount += amt;
//     } else if (item.tag === "office") {
//       newSpendings[2].amount += amt;
//     }
//   });

//   const config = {
//     data: data,
//     width: 500,
//     autoFit: true,
//     xField: "date",
//     yField: "amount",
//   };
//   const spendingConfig = {
//     data: newSpendings,
//     width: 500,
//     angleField: "amount",
//     colorField: "tag",
//   };
//   let chart;
//   let pieChart;
//   return (
//     <div
//       className="charts-wrapper"
//       style={{
//         width: "91%",
//         display: "flex",
//         justifyContent: "space-between",
//         height: "auto",
//         padding: "2rem",
//         borderRadius: "0.5rem",
//         boxShadow: "var(--shadow)",
//         margin: "2rem",
//       }}
//     >
//       <div>
//         <h2 style={{ marginTop: 0 }}>Your Analytics</h2>
//         <Line
//           {...config}
//           onReady={(chartInstance) => (chart = chartInstance)}
//         />
//         ;
//       </div>
//       <div>
//         <h2>Your Spending</h2>
//         <Pie
//           {...spendingConfig}
//           onReady={(chartInstance) => (pieChart = chartInstance)}
//         />
//         ;
//       </div>
//     </div>
//   );
// };

// export default Chartcomponent;
