import { useState } from "react";
import Alert from "./components/Alert";
import Button from "./components/Button";
import Like from "./components/Like";
//import ListGroup from "./components/ListGroup";

function App() {

  // let items = [
  //   'Dhaka',
  //   'Sylhet',
  //   'Khulna',
  //   'Rajshahi',
  //   'Chattogram'
  // ];

  // const handleSeletItem = (item: string) => {console.log(item);}
const [showAlert, setShowAlert] = useState(false)

  return (
    <>
      <div> 
        {/* <ListGroup items={items} heading="Cities" onSelectItem={handleSeletItem} /> */}
        {showAlert && <Alert color="red" onClose={() => setShowAlert(false)}> Hello world</Alert>}
        <Button color="green" onClick={() => setShowAlert(true)}> My Button </Button>
        <Like />
      </div>
    </>
  )
}

export default App;