import { useState } from "react";
import {FaHeart, FaRegHeart} from "react-icons/fa";

function Like(){
  const [status, setStatus] = useState(false);
  const toggle = () => {
    setStatus(!status)
  }

    if(status) return <FaHeart color="red" size={40} onClick={toggle}/>
            return <FaRegHeart color="red" size={40} onClick={toggle}/>
}

export default Like;