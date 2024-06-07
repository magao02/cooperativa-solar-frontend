import {Button} from "@nextui-org/button";
import {Input} from "@nextui-org/react";
import { useState } from 'react';

export default function Login() {
  const [username, setUsername] = useState('')
  const doLogin =  ()=>{
    
  }
  return(
    <div>
      <h1>Login</h1>
      <form>
        <Input type="text" placeholder="Username"/>
        <Input type="password" placeholder="Password"/>
      </form>
      <Button onClick={doLogin}>Login</Button>
    </div>
    
  )
  
  
}