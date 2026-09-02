"use client";

import { FormEvent, useEffect, useState } from "react";
import { Bell, Home, LogOut, Save, UserRound, Users } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { skillCircleApi, type Profile } from "../../lib/api";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bio, setBio] = useState("");
  const [college, setCollege] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => { skillCircleApi.me().then(({ user }) => { setProfile(user); setBio(user.bio || ""); setCollege(user.college || ""); setLocation(user.location || ""); }).catch((error: Error) => setMessage(error.message)); }, []);

  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    try { const { user } = await skillCircleApi.updateProfile({ bio, college, location }); setProfile(user); setMessage("Profile updated."); } catch (error) { setMessage(error instanceof Error ? error.message : "Could not update profile"); }
  }

  if (!profile) return <main className="feed-page"><p className="loading-state">Loading profile...</p></main>;
  return <main className="feed-page"><header className="feed-header"><a className="brand" href="/"><span className="brand-mark">SC</span>skill<span>circle</span></a><nav className="desktop-feed-nav"><a href="/feed"><Home size={18} /> Home</a><a href="#network"><Users size={18} /> Network</a><a href="#notifications"><Bell size={18} /> Alerts</a><a href="/profile" className="active"><UserRound size={18} /> Me</a></nav><button className="icon-button" title="Sign out" onClick={() => signOut(auth).then(() => { window.location.href = "/"; })}><LogOut size={18} /></button></header><section className="profile-page"><div className="profile-hero"><div className="profile-hero-cover" /><div className="profile-hero-content"><div className="profile-avatar-wrap"><span className="avatar-fallback avatar-large">{profile.name.slice(0, 1)}</span></div><div><p className="eyebrow"><span className="eyebrow-dot" /> Your public profile</p><h1>{profile.name}</h1><p className="profile-handle">@{profile.username} · {profile.email}</p></div></div></div><div className="profile-grid"><section className="profile-details"><h2>About you</h2><p>{profile.bio || "Tell your circle what you are learning, making, or thinking about."}</p><div className="profile-facts"><span>{profile.college || "Add your college"}</span><span>{profile.location || "Add your location"}</span></div><h2>Signals</h2><div className="tag-list">{(profile.skills?.length ? profile.skills : ["Add skills", "Find interests"]).map((tag) => <span key={tag}>{tag}</span>)}</div></section><form className="profile-editor" onSubmit={saveProfile}><h2>Edit profile</h2><label htmlFor="college">College</label><input id="college" value={college} onChange={(event) => setCollege(event.target.value)} placeholder="Your college or university" /><label htmlFor="location">Location</label><input id="location" value={location} onChange={(event) => setLocation(event.target.value)} placeholder="City, country" /><label htmlFor="bio">Bio</label><textarea id="bio" value={bio} onChange={(event) => setBio(event.target.value)} maxLength={500} placeholder="What are you curious about?" /><button className="button button-dark" type="submit"><Save size={16} /> Save changes</button>{message && <p className="auth-message">{message}</p>}</form></div></section><nav className="mobile-tab-bar"><a href="/feed"><Home size={20} /><span>Home</span></a><a href="#network"><Users size={20} /><span>Network</span></a><a href="#notifications"><Bell size={20} /><span>Alerts</span></a><a className="active" href="/profile"><UserRound size={20} /><span>Profile</span></a></nav></main>;
}
