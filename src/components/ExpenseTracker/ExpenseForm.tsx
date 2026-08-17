import { useForm } from "react-hook-form";
import { categories } from "../../App";

interface ExpenseFormValues {
    name: string;
    description: string;
    amount: number;
    categories: string;
}

function ExpenseForm() {
    const { register, handleSubmit, formState: { errors } } = useForm<ExpenseFormValues>();

    const onSubmit = (data: ExpenseFormValues) => console.log(data);

    const errorClass = "border border-red-500 rounded px-3 py-2";
    const baseClass = "border border-gray-300 rounded px-3 py-2";

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 m-8 w-1/3">
            <label htmlFor="name" className="text-sm font-medium">
                Name
            </label>
            <input
                id="name"
                type="text"
                placeholder="Name"
                className={errors.name ? errorClass : baseClass}
                {...register("name", { required: "Name is required", minLength: { value: 3, message: "Name must be at least 3 characters" } })}
            />
            {errors.name && <span className="text-red-500 text-xs">{errors.name.message as string}</span>}
            
            <label htmlFor="description" className="text-sm font-medium">
                Description
            </label>
            <input
                id="description"
                type="text"
                placeholder="Description"
                className={errors.description ? errorClass : baseClass}
                {...register("description", { required: "Description is required", minLength: { value: 3, message: "Description must be at least 3 characters" } })}
            />
            {errors.description && <span className="text-red-500 text-xs">{errors.description.message as string}</span>}
            <label htmlFor="amount" className="text-sm font-medium">
                Amount
            </label>
            <input
                id="amount"
                type="number"
                placeholder="Amount"
                className={errors.amount ? errorClass : baseClass}
                {...register("amount", { required: "Amount is required", min: { value: 0.01, message: "Amount must be greater than 0" }, max: { value: 1000000, message: "Amount must be at most 1000000" } })}
            />
            {errors.amount && <span className="text-red-500 text-xs">{errors.amount.message as string}</span>}
            <label htmlFor="categories" className="text-sm font-medium">
                Categories
            </label>
            <select
                id="categories"
                className={errors.categories ? errorClass : baseClass}
                {...register("categories", { required: "Category is required" })}
            >
                <option value="">Select a category</option>
                {categories.map((c) => (
                    <option key={c} value={c.toLowerCase()}>
                        {c}
                    </option>
                ))}
            </select>
            {errors.categories && <span className="text-red-500 text-xs">{errors.categories.message as string}</span>}
            <button
                type="submit"
                className="bg-blue-600 text-white rounded px-3 py-2"
            >
                Submit
            </button>
        </form>
    )
}

export default ExpenseForm;