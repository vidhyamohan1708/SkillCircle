"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Bell, Bookmark, Home, ImagePlus, LogOut, MessageCircle, MoreHorizontal, Search, Send, ThumbsUp, UserRound, Users } from "lucide-react";
import { signOut } from "firebase/auth";
import { auth } from "../../lib/firebase";
import { skillCircleApi, type Post, type Profile } from "../../lib/api";

function Avatar({ user, large = false }: { user: Pick<Profile, "name" | "profileImage">; large?: boolean }) {
  return user.profileImage ? <img className={`avatar-image ${large ? "avatar-large" : ""}`} src={user.profileImage} alt={user.name} /> : <span className={`avatar-fallback ${large ? "avatar-large" : ""}`}>{user.name.slice(0, 1).toUpperCase()}</span>;
}

export default function FeedPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [content, setContent] = useState("");
  const [comment, setComment] = useState<Record<string, string>>({});
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([skillCircleApi.me(), skillCircleApi.posts()]).then(([me, feed]) => {
      setProfile(me.user);
      setPosts(feed.posts);
    }).catch((reason: Error) => setError(reason.message)).finally(() => setLoading(false));
  }, []);

  async function handleImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setImage(String(reader.result));
    reader.readAsDataURL(file);
  }

  async function createPost(event: FormEvent) {
    event.preventDefault();
    if (!content.trim()) return;
    try {
      const uploaded = image ? await skillCircleApi.uploadImage(image) : undefined;
      const result = await skillCircleApi.createPost(content, uploaded?.url);
      setPosts((current) => [result.post, ...current]);
      setContent("");
      setImage("");
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not publish post"); }
  }

  async function toggleLike(post: Post) {
    try {
      const result = await skillCircleApi.likePost(post._id);
      setPosts((current) => current.map((item) => item._id === post._id ? { ...item, likes: result.liked ? [...item.likes, profile?._id || "me"] : item.likes.filter((like) => like !== profile?._id) } : item));
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not update like"); }
  }

  async function addComment(postId: string) {
    const text = comment[postId]?.trim();
    if (!text) return;
    try {
      const result = await skillCircleApi.commentPost(postId, text);
      setPosts((current) => current.map((post) => post._id === postId ? { ...post, comments: result.comments } : post));
      setComment((current) => ({ ...current, [postId]: "" }));
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not add comment"); }
  }

  if (loading) return <main className="feed-page"><p className="loading-state">Loading your circle...</p></main>;

  return <main className="feed-page">
    <header className="feed-header"><a className="brand" href="/"><span className="brand-mark">SC</span>skill<span>circle</span></a><div className="search-box"><Search size={16} /><input placeholder="Search people, skills, ideas" /></div><nav className="desktop-feed-nav"><a href="/feed" className="active"><Home size={18} /> Home</a><a href="#network"><Users size={18} /> Network</a><a href="#notifications"><Bell size={18} /> Alerts</a><a href="/profile"><Avatar user={profile!} /> Me</a></nav><button className="icon-button" title="Sign out" onClick={() => signOut(auth).then(() => { window.location.href = "/"; })}><LogOut size={18} /></button></header>
    <div className="feed-layout">
      <aside className="feed-sidebar"><section className="profile-card"><div className="profile-cover" /><div className="profile-card-body"><Avatar user={profile!} large /><h2>{profile?.name}</h2><p>@{profile?.username}</p><span>{profile?.college || "Student builder"}</span><a href="/profile">View profile</a></div></section><div className="sidebar-links"><a href="#saved"><Bookmark size={16} /> Saved posts</a><a href="#events"><Users size={16} /> Skill circles</a></div></aside>
      <section className="feed-column"><div className="feed-heading"><div><p className="eyebrow"><span className="eyebrow-dot" /> The daily signal</p><h1>Your circle</h1></div><span className="feed-date">SEPT 2026</span></div>
        <form className="composer" onSubmit={createPost}><div className="composer-top"><Avatar user={profile!} large /><textarea value={content} onChange={(event) => setContent(event.target.value)} placeholder="Share an idea, question, or small win..." maxLength={2000} /></div>{image && <img className="composer-preview" src={image} alt="Selected upload preview" />}<div className="composer-actions"><label className="attach-button"><ImagePlus size={18} /> Add image<input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImage} /></label><span>{content.length}/2000</span><button className="button button-dark" type="submit" disabled={!content.trim()}>Publish <Send size={15} /></button></div></form>
        {error && <p className="feed-error" role="alert">{error}</p>}
        {posts.length === 0 ? <div className="empty-feed"><MessageCircle size={24} /><h2>Your feed is quiet.</h2><p>Be the first person in your circle to share something.</p></div> : posts.map((post) => <article className="post-card" key={post._id}><div className="post-head"><Avatar user={post.author} /><div><strong>{post.author.name}</strong><span>@{post.author.username} · {new Date(post.createdAt).toLocaleDateString()}</span></div><button className="icon-button" title="More options"><MoreHorizontal size={18} /></button></div><p className="post-content">{post.content}</p>{post.image && <img className="post-image" src={post.image} alt="Post attachment" />}<div className="post-meta"><span>{post.likes.length} likes</span><span>{post.comments.length} comments</span></div><div className="post-actions"><button className={post.likes.includes(profile?._id || "") ? "liked" : ""} onClick={() => toggleLike(post)}><ThumbsUp size={17} /> Like</button><button onClick={() => document.getElementById(`comment-${post._id}`)?.focus()}><MessageCircle size={17} /> Comment</button></div><div className="comment-list">{post.comments.slice(-3).map((item) => <div className="comment" key={item._id}><Avatar user={item.author} /><p><strong>{item.author.name}</strong>{item.content}</p></div>)}</div><div className="comment-input"><input id={`comment-${post._id}`} value={comment[post._id] || ""} onChange={(event) => setComment((current) => ({ ...current, [post._id]: event.target.value }))} onKeyDown={(event) => event.key === "Enter" && addComment(post._id)} placeholder="Add a thoughtful comment..." /><button title="Post comment" onClick={() => addComment(post._id)}><Send size={16} /></button></div></article>)}
      </section>
      <aside className="feed-right"><div className="suggestions"><h2>People to know</h2><p>Find students moving in a similar direction.</p><a href="#network">Explore network <Send size={14} /></a></div><div className="feed-note"><span>SC / 01</span><p>Small signals become meaningful connections.</p></div></aside>
    </div>
    <nav className="mobile-tab-bar"><a className="active" href="/feed"><Home size={20} /><span>Home</span></a><a href="#network"><Users size={20} /><span>Network</span></a><a href="#notifications"><Bell size={20} /><span>Alerts</span></a><a href="/profile"><UserRound size={20} /><span>Profile</span></a></nav>
  </main>;
}
