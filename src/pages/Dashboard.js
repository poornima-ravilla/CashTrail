import React, { useEffect, useState, useCallback } from "react";
import Header from "../components/Header";
import Cards from "../components/Cards";
import AddExpenseModal from "../components/Modals/addExpense";
import AddIncomeModal from "../components/Modals/addIncome";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import TransactionsTable from "../components/TransactionsTable";
import Chartcomponent from "../components/Charts";
import NoTransactions from "../components/NoTransactions";

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useAuthState(auth);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);

  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [totalBalance, setTotalBalance] = useState(0);

  const showExpenseModal = () => setIsExpenseModalVisible(true);
  const showIncomeModal = () => setIsIncomeModalVisible(true);
  const handleExpenseCancel = () => setIsExpenseModalVisible(false);
  const handleIncomeCancel = () => setIsIncomeModalVisible(false);

  const onFinish = (values, type) => {
    const newTransaction = {
      type: type,
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.tag,
      name: values.name,
    };

    addTransaction(newTransaction);
  };

  const addTransaction = async (transaction, many) => {
    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );
      console.log("Document written with ID: ", docRef.id);

      if (!many) toast.success("Transaction Added!");

      setTransactions((prev) => [...prev, transaction]);
    } catch (e) {
      console.error("Error adding document: ", e);
      if (!many) toast.error("Couldn't add Transaction");
    }
  };

  const calculateBalance = useCallback(() => {
    let incomeTotal = 0;
    let expenseTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        incomeTotal += transaction.amount;
      } else {
        expenseTotal += transaction.amount;
      }
    });

    setIncome(incomeTotal);
    setExpense(expenseTotal);
    setTotalBalance(incomeTotal - expenseTotal);
  }, [transactions]);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    if (user) {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);
      let transactionArray = [];
      querySnapshot.forEach((doc) => {
        transactionArray.push(doc.data());
      });
      setTransactions(transactionArray);
      toast.success("Transactions Fetched!");
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    calculateBalance();
  }, [calculateBalance]);

  const sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(a.date) - new Date(b.date);
  });

  return (
    <div>
      <Header />
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <Cards
            income={income}
            expense={expense}
            totalBalance={totalBalance}
            showExpenseModal={showExpenseModal}
            showIncomeModal={showIncomeModal}
          />

          {transactions && transactions.length !== 0 ? (
            <Chartcomponent sortedTransactions={sortedTransactions} />
          ) : (
            <NoTransactions />
          )}

          <AddExpenseModal
            isExpenseModalVisible={isExpenseModalVisible}
            handleExpenseCancel={handleExpenseCancel}
            onFinish={onFinish}
          />
          <AddIncomeModal
            isIncomeModalVisible={isIncomeModalVisible}
            handleIncomeCancel={handleIncomeCancel}
            onFinish={onFinish}
          />

          <TransactionsTable
            transactions={transactions}
            addTransaction={addTransaction}
            fetchTransactions={fetchTransactions}
          />
        </>
      )}
    </div>
  );
};

export default Dashboard;

// import React, { useEffect, useState } from "react";
// import Header from "../components/Header";
// import Cards from "../components/Cards";
// import { Modal } from "antd";
// import AddExpenseModal from "../components/Modals/addExpense";
// import AddIncomeModal from "../components/Modals/addIncome";
// import { addDoc, collection, getDocs, query } from "firebase/firestore";
// import { db } from "../firebase";
// import { toast } from "react-toastify";
// import { useAuthState } from "react-firebase-hooks/auth";
// import { auth } from "../firebase";
// import TransactionsTable from "../components/TransactionsTable";
// import Chartcomponent from "../components/Charts";
// import NoTransactions from "../components/NoTransactions";

// const Dashboard = () => {
//   // const transactions = [
//   //   {
//   //     type: "income",
//   //     amount: 1200,
//   //     tag: "salary",
//   //     name: "income 1",
//   //     date: "2023-05-23",
//   //   },
//   //   {
//   //     type: "expense",
//   //     amount: 800,
//   //     tag: "food",
//   //     name: "expense 1",
//   //     date: "2023-05-25",
//   //   },
//   // ];

//   const [transactions, setTransactions] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [user] = useAuthState(auth);
//   const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
//   const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);

//   const [income, setIncome] = useState(0);
//   const [expense, setExpense] = useState(0);
//   const [totalBalance, setTotalBalance] = useState(0);

//   const showExpenseModal = () => {
//     setIsExpenseModalVisible(true);
//   };

//   const showIncomeModal = () => {
//     setIsIncomeModalVisible(true);
//   };

//   const handleExpenseCancel = () => {
//     setIsExpenseModalVisible(false);
//   };

//   const handleIncomeCancel = () => {
//     setIsIncomeModalVisible(false);
//   };

//   const onFinish = (values, type) => {
//     const newTransaction = {
//       type: type,
//       date: values.date.format("YYYY-MM-DD"),
//       amount: parseFloat(values.amount),
//       tag: values.tag,
//       name: values.name,
//     };

//     // setTransactions([...transactions, newTransaction]);
//     // setIsExpenseModalVisible(false);
//     // setIsIncomeModalVisible(false);
//     addTransaction(newTransaction);
//     // calculateBalance();
//   };
//   async function addTransaction(transaction, many) {
//     try {
//       const docRef = await addDoc(
//         collection(db, `users/${user.uid}/transactions`),
//         transaction
//       );
//       console.log("Document written with Id: ", docRef.id);

//       if (!many) toast.success("Transaction Added!");
//       let newArr = transactions;
//       newArr.push(transaction);
//       setTransactions(newArr);
//       calculateBalance();
//     } catch (e) {
//       console.error("Error adding document: ", e);

//       if (!many) toast.error("Couldn't add Transaction");
//     }
//   }

//   useEffect(() => {
//     //get all the docs from a collection
//     fetchTransactions();
//   }, [user]);

//   useEffect(() => {
//     calculateBalance();
//   }, [transactions]);

//   const calculateBalance = () => {
//     let incomeTotal = 0;
//     let expenseTotal = 0;

//     transactions.forEach((transaction) => {
//       if (transaction.type === "income") {
//         incomeTotal += transaction.amount;
//       } else {
//         expenseTotal += transaction.amount;
//       }
//     });

//     setIncome(incomeTotal);
//     setExpense(expenseTotal);
//     setTotalBalance(incomeTotal - expenseTotal);
//   };

//   async function fetchTransactions() {
//     setLoading(true);
//     if (user) {
//       const q = query(collection(db, `users/${user.uid}/transactions`));
//       const querySnapshot = await getDocs(q);
//       let transactionArray = [];
//       querySnapshot.forEach((doc) => {
//         transactionArray.push(doc.data());
//       });
//       setTransactions(transactionArray);
//       console.log("Transaction Array", transactionArray);
//       toast.success("Transactions Fetched!");
//     }
//     setLoading(false);
//   }
//   let sortedTransactions = transactions.sort((a, b) => {
//     return new Date(a.date) - new Date(b.date);
//   });
//   return (
//     <div>
//       <Header />
//       {loading ? (
//         <p>Loading...</p>
//       ) : (
//         <>
//           <Cards
//             income={income}
//             expense={expense}
//             totalBalance={totalBalance}
//             showExpenseModal={showExpenseModal}
//             showIncomeModal={showIncomeModal}
//           />
//           {transactions && transactions.length != 0 ? (
//             <Chartcomponent sortedTransactions={sortedTransactions} />
//           ) : (
//             <NoTransactions />
//           )}
//           <AddExpenseModal
//             isExpenseModalVisible={isExpenseModalVisible}
//             handleExpenseCancel={handleExpenseCancel}
//             onFinish={onFinish}
//           />
//           <AddIncomeModal
//             isIncomeModalVisible={isIncomeModalVisible}
//             handleIncomeCancel={handleIncomeCancel}
//             onFinish={onFinish}
//           />
//           <TransactionsTable
//             transactions={transactions}
//             addTransaction={addTransaction}
//             fetchTransactions={fetchTransactions}
//           />
//         </>
//       )}
//     </div>
//   );
// };

// export default Dashboard;
