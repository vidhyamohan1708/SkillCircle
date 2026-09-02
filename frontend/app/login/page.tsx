"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { apiRequest } from "../../lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      if (isSignup) {
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(credential.user, { displayName: name });
        await apiRequest("/users", {
          method: "POST",
          body: JSON.stringify({ name, username, email }),
        });
        router.push("/feed");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        await apiRequest("/users/me");
        router.push("/feed");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Authentication failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-page">
      <a className="auth-back" href="/">← Back to SkillCircle</a>
      <section className="auth-panel">
        <div className="auth-intro">
          <p className="eyebrow"><span className="eyebrow-dot" /> Your next move starts here</p>
          <h1>{isSignup ? <>Build your<br /><em>circle.</em></> : <>Welcome<br /><em>back.</em></>}</h1>
          <p>{isSignup ? "Create your profile and meet students who are curious about the same things." : "Sign in to pick up where your ideas left off."}</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignup && <><label htmlFor="name">Full name</label><input id="name" required value={name} onChange={(event) => setName(event.target.value)} placeholder="Aarav Mehta" /></>}
          {isSignup && <><label htmlFor="username">Username</label><input id="username" required pattern="[a-zA-Z0-9_]+" value={username} onChange={(event) => setUsername(event.target.value)} placeholder="aarav_mehta" /></>}
          <label htmlFor="email">Email</label>
          <input id="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
          <label htmlFor="password">Password</label>
          <input id="password" type="password" minLength={6} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" />
          <button className="button button-dark auth-submit" type="submit" disabled={isSubmitting}>{isSubmitting ? "Connecting..." : isSignup ? "Create account" : "Sign in"}</button>
          {message && <p className="auth-message" role="status">{message}</p>}
          <p className="auth-switch">{isSignup ? "Already have an account?" : "New to SkillCircle?"} <button type="button" onClick={() => { setIsSignup(!isSignup); setMessage(""); }}>{isSignup ? "Sign in" : "Create an account"}</button></p>
        </form>
      </section>
    </main>
  );
}
