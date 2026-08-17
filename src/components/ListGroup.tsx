import { useState } from "react";

interface Props {
    items: string[];
    heading: string;
    onSelectItem: (item: string) => void;
}

function ListGroup({items, heading, onSelectItem}: Props) {
    
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const handleClick = (index: number) => {setSelectedIndex(index)}
    
    return (
        <>
            <h1 className="mx-8">{heading}</h1>
            <ul className="w-48 mx-8 text-sm font-medium text-heading bg-neutral-primary-soft border border-default rounded-base">
            {items.map((item, index) => (
                <li 
                    className={ selectedIndex == index ? 'w-full bg-blue-500 px-4 py-2 border-b border-default' : 'w-full px-4 py-2 border-b border-default'} key={index} 
                    //onClick={() => {setSelectedIndex(index)}}
                    onClick={() => {
                        handleClick(index)
                        onSelectItem(item)
                    }}
                >   
                    {index+1} {item}
                </li>
            ))}
                
            </ul>
        </>

    );
}

export default ListGroup;