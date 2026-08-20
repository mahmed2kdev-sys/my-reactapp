import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { categories } from "./categories";

const expenseSchema = z.object({
    description: z.string().min(3, "Description must be at least 3 characters"),
    amount: z.number().min(0.01, "Amount must be greater than 0").max(1000000, "Amount must be at most 1000000"),
    category: z.enum(categories, { error: "Category is required" }),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;

interface Props {
    onSubmit: (data: ExpenseFormData) => void;
}

function ExpenseForm({ onSubmit }: Props) {
    const { register, handleSubmit, reset, formState: { errors, isValid } } = useForm<
        z.input<typeof expenseSchema>
    >({
        resolver: zodResolver(expenseSchema),
        mode: "onChange",
    });

    const submit = handleSubmit((data) => {
        onSubmit(data);
        reset();
    });

    const errorClass = "border border-red-500 rounded px-3 py-2";
    const baseClass = "border border-gray-300 rounded px-3 py-2";

    return (
        <form onSubmit={submit} className="flex flex-col gap-4 m-8 w-1/3">

            <label htmlFor="description" className="text-sm font-medium">
                Description
            </label>
            <input
                id="description"
                type="text"
                placeholder="Description"
                className={errors.description ? errorClass : baseClass}
                {...register("description")}
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
                {...register("amount", { valueAsNumber: true })}
            />
            {errors.amount && <span className="text-red-500 text-xs">{errors.amount.message as string}</span>}
            <label htmlFor="category" className="text-sm font-medium">
                Category
            </label>
            <select
                id="category"
                className={errors.category ? errorClass : baseClass}
                {...register("category")}
            >
                <option value="">Select a category</option>
                {categories.map((c) => (
                    <option key={c} value={c}>
                        {c}
                    </option>
                ))}
            </select>
            {errors.category && <span className="text-red-500 text-xs">{errors.category.message as string}</span>}
            <button
                type="submit"
                disabled={!isValid}
                className="bg-blue-600 text-white rounded px-3 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Submit
            </button>
        </form>
    )
}

export default ExpenseForm;