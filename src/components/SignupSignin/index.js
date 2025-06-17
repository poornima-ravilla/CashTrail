import React, { useState } from "react";
import "./styles.css";
import Input from "../Input";
import Button from "../Button";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";

function SignupSignin() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState(false);
  const navigate = useNavigate();

  function signupWithEmail() {
    setLoading(true);
    console.log("Name", name);
    console.log("email", email);
    console.log("password", password);
    console.log("confirmPassword", confirmPassword);

    if (
      name !== "" &&
      email !== "" &&
      password !== "" &&
      confirmPassword !== ""
    ) {
      if (password === confirmPassword) {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const user = userCredential.user;
            toast.success("User Created");
            setLoading(false);
            setName("");
            setEmail("");
            setPassword("");
            setConfirmPassword("");
            createDoc(user);
            navigate("/dashboard");
          })
          .catch((error) => {
            toast.error(error.message);
            setLoading(false);
          });
      } else {
        toast.error("Password and Confirm Password don't match");
        setLoading(false);
      }
    } else {
      toast.error("All fields are mandatory!");
      setLoading(false);
    }
  }

  function loginUsingEmail() {
    setLoading(true);

    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          toast.success("User Logged In Successfully!");
          setLoading(false);
          navigate("/dashboard");
        })
        .catch((error) => {
          toast.error(error.message);
          setLoading(false);
        });
    } else {
      toast.error("All fields are mandatory!");
      setLoading(false);
    }
  }

  async function createDoc(user) {
    setLoading(true);
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);

    if (!userData.exists()) {
      try {
        await setDoc(userRef, {
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL || "",
          createdAt: new Date(),
        });
        toast.success("Doc created!");
        setLoading(false);
      } catch (e) {
        toast.error(e.message);
        setLoading(false);
      }
    } else {
      toast.error("Doc already exists");
      setLoading(false);
    }
  }

  function googleAuth() {
    setLoading(true);

    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });

    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        createDoc(user);
        setLoading(false);
        navigate("/dashboard");
        toast.success("User authenticated");
      })
      .catch((error) => {
        setLoading(false);
        toast.error(error.message);
      });
  }

  return (
    <>
      {loginForm ? (
        <div className="signup-wrapper">
          <h2 className="title">
            Login on <span style={{ color: "var(--theme)" }}>CashTrail</span>
          </h2>
          <form>
            <Input
              type="email"
              label="Email"
              state={email}
              setState={setEmail}
              placeholder="JohnDoe@gmail.com"
            />
            <Input
              type="password"
              label="Password"
              state={password}
              setState={setPassword}
              placeholder="Example@123"
            />
            <Button
              disabled={loading}
              text={loading ? "Loading..." : "Login Using Email and Password"}
              onClick={loginUsingEmail}
            />
            <p style={{ textAlign: "center", margin: 0 }}>or</p>
            <Button
              onClick={googleAuth}
              text={loading ? "Loading..." : "Login Using Google"}
              blue
            />
            <p className="p-login" onClick={() => setLoginForm(false)}>
              Don't Have An Account? Click Here
            </p>
          </form>
        </div>
      ) : (
        <div className="signup-wrapper">
          <h2 className="title">
            Sign Up on <span style={{ color: "var(--theme)" }}>CashTrail</span>
          </h2>
          <form>
            <Input
              label="Full Name"
              state={name}
              setState={setName}
              placeholder="John Doe"
            />
            <Input
              type="email"
              label="Email"
              state={email}
              setState={setEmail}
              placeholder="JohnDoe@gmail.com"
            />
            <Input
              type="password"
              label="Password"
              state={password}
              setState={setPassword}
              placeholder="Example@123"
            />
            <Input
              type="password"
              label="Confirm Password"
              state={confirmPassword}
              setState={setConfirmPassword}
              placeholder="Example@123"
            />
            <Button
              disabled={loading}
              text={loading ? "Loading..." : "Signup Using Email and Password"}
              onClick={signupWithEmail}
            />
            <p style={{ textAlign: "center", margin: 0 }}>or</p>
            <Button
              onClick={googleAuth}
              text={loading ? "Loading..." : "Signup Using Google"}
              blue
            />
            <p className="p-login" onClick={() => setLoginForm(true)}>
              Already Have An Account? Click Here
            </p>
          </form>
        </div>
      )}
    </>
  );
}

export default SignupSignin;
