import { useForm, type FieldValues } from "react-hook-form";

function Form(){
    const { register, handleSubmit }= useForm();
    
    const onSubmit = (data: FieldValues) => console.log(data);
    
    return (
       <form onSubmit={handleSubmit(onSubmit)} className="mx-7 my-10 w-full max-w-sm items-center justify-center gap-2">
        <div className="w-full space-y-1">
        <label htmlFor="name" className="font-sans antialiased text-sm text-slate-800 dark:text-white font-semibold">
            Name
        </label>
        <div className="relative w-full">
            <input 
            id="name"
            type="text"
            {...register('name')}
            placeholder="Name" 
            className="w-full aria-disabled:cursor-not-allowed outline-none focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-600/60 bg-transparent ring-transparent border border-slate-200 transition-all duration-300 ease-in disabled:opacity-50 disabled:pointer-events-none data-[error=true]:border-red-500 data-[success=true]:border-green-500 text-sm rounded-md py-2 px-2.5 ring shadow-sm data-[icon-placement=start]:ps-9 data-[icon-placement=end]:pe-9 hover:border-slate-800 hover:ring-slate-800/10 focus:border-slate-800 focus:ring-slate-800/10 peer" data-error="false" data-success="false" data-icon-placement="" />
        </div>
        </div>

        <div className="w-full my-3">
        <label htmlFor="age" className="font-sans antialiased text-sm text-slate-800 dark:text-white font-semibold">
            Age
        </label>
        <div className="relative w-full">
            <input 
            id="age"
            type="number"
            {...register('age')}
            placeholder="Age" 
            className="w-full aria-disabled:cursor-not-allowed outline-none focus:outline-none text-slate-800 dark:text-white placeholder:text-slate-600/60 bg-transparent ring-transparent border border-slate-200 transition-all duration-300 ease-in disabled:opacity-50 disabled:pointer-events-none data-[error=true]:border-red-500 data-[success=true]:border-green-500 text-sm rounded-md py-2 px-2.5 ring shadow-sm data-[icon-placement=start]:ps-9 data-[icon-placement=end]:pe-9 hover:border-slate-800 hover:ring-slate-800/10 focus:border-slate-800 focus:ring-slate-800/10 peer" data-error="false" data-success="false" data-icon-placement="" />
        </div>
        </div>
        <div className="w-full space-y">

            <button 
                type="submit"
                className="w-full border font-sans font-medium text-center transition-all duration-300 ease-in disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed focus:shadow-none text-sm rounded-md py-2 px-4 shadow-sm hover:shadow-md bg-blue-800 border-blue-800 text-blue-50 hover:bg-blue-700 hover:border-blue-700"
                >
                Submit
            </button>
        </div>
        </form>

    )
}

export default Form;