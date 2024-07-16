import { useState } from "react";
import { Button } from "@nextui-org/react";
import { Input, Spacer, Card } from "@nextui-org/react";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const doLogin = () => {
    if (!username || !password) {
      setError("Both fields are required.");
    } else {
      setError("");
      console.log("Logging in with", { username, password });
    }
  };

  return (
    <div style={{display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh"}}>
      <Card style={{ width: "400px", padding: 20}}>
      <Spacer y={4} />
      <h1 style={{ textAlign:"center", marginBottom: "10" }}>Faça login</h1>
      <Spacer y={4} />
        <form onSubmit={(e) => e.preventDefault()}>
        
          <Input
            fullWidth
            color="primary"
            size="lg"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Spacer y={1} />
          <Input
            fullWidth
            color="primary"
            size="lg"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Spacer y={1} />
          <Spacer y={1.5} />
          <Button onClick={doLogin} style={{ width: "100%" }}>
            Login
          </Button>
        </form>
      </Card>
    </div>
  );
}
