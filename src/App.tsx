//import { useState } from "react";
import { useState } from "react";
import ExpenseFilter from "./components/ExpenseTracker/ExpenseFilter";
import ExpenseList from "./components/ExpenseTracker/ExpenseList";
import ExpenseForm from "./components/ExpenseTracker/ExpenseForm";

export const categories = ["Food", "Fruits", "Transport", "Entertainment", "Utilities"];

function App() {

  const [selectedCategory, setSelectedCategory] = useState('');
  const [expenseList, setExpenseList] = useState([
    { id: 1, description: "Groceries", amount: 50, category: "Food" },
    { id: 2, description: "Bus fare", amount: 3, category: "Transport" },
    { id: 3, description: "Movie ticket", amount: 15, category: "Entertainment" },
    { id: 4, description: "Electricity bill", amount: 80, category: "Utilities" },
    { id: 5, description: "Coffee", amount: 5, category: "Food" },
  ]);
  const handleDelete = (id: number) => {
    setExpenseList(expenseList.filter(expense => expense.id !== id));
  };

  const visibleExpenses = selectedCategory
    ? expenseList.filter(expense => expense.category === selectedCategory)
    : expenseList;

  return (
    <>
      <div>
        <ExpenseForm />
        <ExpenseFilter onSelectCategory={(category) => setSelectedCategory(category)} />
        <ExpenseList expenses={visibleExpenses} onDelete={handleDelete} />
      </div>
    </>
  )
}

export default App;