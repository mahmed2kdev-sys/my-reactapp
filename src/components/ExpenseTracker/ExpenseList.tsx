
interface Expense {
  id: number;
  description: string;
  amount: number;
  category: string;
}

import { FaTrash } from "react-icons/fa";

interface Props {
    expenses: Expense[];
    onDelete: (id: number) => void;
}
function ExpenseList({ expenses, onDelete }: Props) {
    if (expenses.length === 0) return null;

    return (
        <table className="border border-gray-300 m-8">
            <thead>
                <tr>
                    <th className="border border-gray-300 px-3 py-2">Description</th>
                    <th className="border border-gray-300 px-3 py-2">Amount</th>
                    <th className="border border-gray-300 px-3 py-2">Category</th>
                    <th className="border border-gray-300 px-3 py-2"></th>
                </tr>
            </thead>
            <tbody>
                {expenses.map((expense, i) => (
                    <tr key={i}>
                        <td className="border border-gray-300 px-3 py-2">{expense.description}</td>
                        <td className="border border-gray-300 px-3 py-2">{expense.amount}</td>
                        <td className="border border-gray-300 px-3 py-2">{expense.category}</td>
                        <td className="border border-gray-300 px-3 py-2">
                            <button onClick={() => onDelete(expense.id)}>
                                <FaTrash className="text-red-500" />
                            </button>
                        </td>
                    </tr>
                ))}
                <tr>
                    <td className="border border-gray-300 px-3 py-2 font-bold">Total</td>
                    <td className="border border-gray-300 px-3 py-2 font-bold">
                        ${expenses.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)}
                    </td>
                    <td className="border border-gray-300 px-3 py-2"></td>
                    <td className="border border-gray-300 px-3 py-2"></td>
                </tr>
            </tbody>
        </table>
    )
}

export default ExpenseList;
