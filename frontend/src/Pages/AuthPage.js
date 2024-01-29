import { useState } from "react";
import "./Auth.css";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router";
function AuthPage() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  function handleSubmit(e) {
    e.preventDefault();
    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }
    let reqBody = {
      query: `
      query {
          login(email : "${email}", password : "${password}")
          {
            token
            userID
            tokenExpiration
          }
      }
      `,
    };
    if (!isLogin) {
      reqBody = {
        query: `
        mutation {
            createUser(userInput : {email : "${email}", password : "${password}"})
            {
              _id
              email
            }
        }
        `,
      };
    }

    fetch("http://localhost:3000/graphql", {
      method: "POST",
      body: JSON.stringify(reqBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error(" Request Failed");
        }
        return res.json();
      })
      .then((resData) => {
        console.log(resData);
        const { token, userID, tokenExpiration } = resData.data.login;
        if (token) {
          login(token, tokenExpiration, userID);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  if (token) {
    navigate("/events", { replace: true });
    return;
  }

  return (
    <>
      <form className="auth-form" onSubmit={handleSubmit}>
        <h1 style={{ color: "blue" }}>{isLogin ? "LOGIN" : "SIGN UP"}</h1>
        <div className="form-control">
          <label htmlFor="email"> Email </label>
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="email"
            id="email"
          />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
          />
        </div>
        <div className="form-action">
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
            }}
          >
            Switch to {isLogin ? "SignUp" : "Login"}
          </button>
          <button type="submit"> Submit</button>
        </div>
      </form>
    </>
  );
}

export default AuthPage;
