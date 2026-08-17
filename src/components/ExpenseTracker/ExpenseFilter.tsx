import { categories } from "./categories";

interface Props {
    onSelectCategory: (category: string) => void
}


function ExpenseFilter({onSelectCategory}: Props) {
    return (
        <select className="border border-gray-300 rounded px-3 py-2 m-8"
            onChange={(event) => onSelectCategory(event.target.value)}
        >
            <option value="">All categories</option>
            {categories.map(category => 
                <option key={category} value={category}>{category}</option>)}
        </select>
    )
}

export default ExpenseFilter;
