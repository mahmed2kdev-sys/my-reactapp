interface Props {
    color?: 'red' | 'blue' | 'green' | 'orange';
    children: string;
    onClick?: () => void; 
}

function Button({color = 'blue', children, onClick}: Props){
      const colorClasses = {
        red: 'bg-red-600 focus:bg-red-700 active:bg-red-700 hover:bg-red-700',
        blue: 'bg-blue-600 focus:bg-blue-700 active:bg-blue-700 hover:bg-blue-700',
        green: 'bg-green-600 focus:bg-green-700 active:bg-green-700 hover:bg-green-700',
        orange: 'bg-orange-600 focus:bg-orange-700 active:bg-orange-700 hover:bg-orange-700',
    };
    
    return(
       <div>
        <button 
            className={`rounded-md py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:shadow-none active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2 ${colorClasses[color]}`} type="button"
            onClick={onClick}
        >
    {children}
</button>
       </div>

    )
}

export default Button;