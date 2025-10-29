import React, { useState, useEffect } from "react";
import { Radio, Select, Table, Modal, Input } from "antd";
import searchImg from "../../assests/search.svg";
import "./styles.css";
import { parse, unparse } from "papaparse";
import { toast } from "react-toastify";
import {
  doc,
  deleteDoc,
  getDocs,
  collection,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../../firebase";

function TransactionsTable({ addTransaction }) {
  const { Option } = Select;
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [editingTx, setEditingTx] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const querySnapshot = await getDocs(
        collection(db, "users", userId, "transactions")
      );
      const data = querySnapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setTransactions(data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // Delete transaction
  const handleDelete = async (transactionId) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId || !transactionId)
        throw new Error("Missing user or transaction ID");

      await deleteDoc(doc(db, "users", userId, "transactions", transactionId));
      toast.success("Transaction deleted successfully!");
      fetchTransactions();
    } catch (error) {
      console.error("Failed to delete transaction:", error.message);
      toast.error("Failed to delete transaction");
    }
  };

  // Edit Transaction
  const handleEdit = (record) => {
    setEditingTx({ ...record }); // Copy current values
    setModalVisible(true);
  };

  // Save edited transaction
  const saveEdit = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId || !editingTx?.id)
        throw new Error("Missing user or transaction ID");

      const { id, name, type, date, amount, tag } = editingTx;

      await updateDoc(doc(db, "users", userId, "transactions", id), {
        name,
        type,
        date,
        amount: parseFloat(amount),
        tag,
      });

      toast.success("Transaction updated successfully!");
      setModalVisible(false);
      setEditingTx(null);
      fetchTransactions();
    } catch (error) {
      console.error("Failed to update transaction:", error.message);
      toast.error("Failed to update transaction");
    }
  };

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Type", dataIndex: "type", key: "type" },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Amount", dataIndex: "amount", key: "amount" },
    { title: "Tag", dataIndex: "tag", key: "tag" },
    {
      title: "Edit",
      key: "edit",
      render: (_, record) => (
        <button
          className="btn btn-edit"
          style={{ width: "80px" }}
          onClick={() => handleEdit(record)}
        >
          Edit
        </button>
      ),
    },
    {
      title: "Delete",
      key: "delete",
      render: (_, record) => (
        <button
          className="btn btn-edit"
          id="delete-btn"
          style={{ width: "80px", color: "red", border: "1px solid red" }}
          onClick={() => handleDelete(record.id)}
        >
          Delete
        </button>
      ),
    },
  ];

  // Filter transactions
  const filteredTransactions = transactions.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      (typeFilter ? item.type === typeFilter : true)
  );

  // Sort transactions
  const sortedTransactions = filteredTransactions.sort((a, b) => {
    if (sortKey === "date") return new Date(a.date) - new Date(b.date);
    if (sortKey === "amount") return a.amount - b.amount;
    return 0;
  });

  // Import CSV
  const importFromCsv = (event) => {
    event.preventDefault();
    try {
      parse(event.target.files[0], {
        header: true,
        complete: async (results) => {
          for (const transaction of results.data) {
            const newTransaction = {
              ...transaction,
              amount: parseFloat(transaction.amount),
            };
            await addTransaction(newTransaction, true);
          }
          toast.success("All Transactions Added");
          fetchTransactions();
        },
      });
      event.target.files = null;
    } catch (e) {
      toast.error(e.message);
    }
  };

  // Export CSV
  const exportCsv = () => {
    const csv = unparse({
      fields: ["name", "type", "date", "amount", "tag"],
      data: transactions,
    });
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "transactions.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ width: "95.5%", padding: "0rem 2rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "1rem",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <div className="input-flex">
          <img src={searchImg} alt="" width="16" />
          <input
            placeholder="Search by Name"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select
          className="select-input"
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="income">Income</Option>
          <Option value="expense">Expense</Option>
        </Select>
      </div>

      <div className="my-table">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
            marginBottom: "1rem",
          }}
        >
          <h2>My Transactions</h2>
          <Radio.Group
            className="input-radio"
            onChange={(e) => setSortKey(e.target.value)}
            value={sortKey}
          >
            <Radio.Button value="" style={{ zIndex: 0 }}>
              No Sort
            </Radio.Button>
            <Radio.Button value="date" style={{ zIndex: 0 }}>
              Sort by Date
            </Radio.Button>
            <Radio.Button value="amount" style={{ zIndex: 0 }}>
              Sort by Amount
            </Radio.Button>
          </Radio.Group>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "1rem",
              width: "400px",
            }}
          >
            <button className="btn" onClick={exportCsv}>
              Export to CSV
            </button>
            <label htmlFor="file-csv" className="btn btn-blue">
              Import from CSV
            </label>
            <input
              onChange={importFromCsv}
              id="file-csv"
              type="file"
              accept=".csv"
              required
              style={{ display: "none" }}
            />
          </div>
        </div>

        <Table columns={columns} dataSource={sortedTransactions} rowKey="id" />
      </div>

      {/* Edit Modal */}
      <Modal
        title="Edit Transaction"
        visible={modalVisible}
        onOk={saveEdit}
        onCancel={() => {
          setModalVisible(false);
          setEditingTx(null);
        }}
      >
        {editingTx && (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <Input
              placeholder="Name"
              value={editingTx.name}
              onChange={(e) =>
                setEditingTx({ ...editingTx, name: e.target.value })
              }
            />
            <Select
              value={editingTx.type}
              onChange={(value) => setEditingTx({ ...editingTx, type: value })}
            >
              <Option value="income">Income</Option>
              <Option value="expense">Expense</Option>
            </Select>
            <Input
              type="date"
              value={editingTx.date}
              onChange={(e) =>
                setEditingTx({ ...editingTx, date: e.target.value })
              }
            />
            <Input
              type="number"
              placeholder="Amount"
              value={editingTx.amount}
              onChange={(e) =>
                setEditingTx({ ...editingTx, amount: e.target.value })
              }
            />
            <Input
              placeholder="Tag"
              value={editingTx.tag}
              onChange={(e) =>
                setEditingTx({ ...editingTx, tag: e.target.value })
              }
            />
          </div>
        )}
      </Modal>
    </div>
  );
}

export default TransactionsTable;
