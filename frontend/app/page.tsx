"use client";

import { ArrowUpRight, BrainCircuit, ChevronRight, CircleDot, Menu, Play, Sparkles, Users, X } from "lucide-react";
import { useState } from "react";

const people = [
  { initials: "AM", name: "Aarav Mehta", role: "Product + AI", tone: "coral" },
  { initials: "SL", name: "Sofia Laurent", role: "Creative technologist", tone: "blue" },
  { initials: "JR", name: "Jules Rivera", role: "Climate builder", tone: "yellow" },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <main>
      <nav className="nav-shell" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="SkillCircle home"><span className="brand-mark"><CircleDot size={20} strokeWidth={2.5} /></span>skill<span>circle</span></a>
        <div className={`nav-links ${menuOpen ? "is-open" : ""}`}>
          <a href="#how">How it works</a>
          <a href="#signals">Signals</a>
          <a href="#community">Community</a>
          <a href="#about">About</a>
          <a className="mobile-join" href="/login">Join SkillCircle <ArrowUpRight size={16} /></a>
        </div>
        <a className="nav-cta" href="/login">Join SkillCircle <ArrowUpRight size={16} /></a>
        <button className="menu-button" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow"><span className="eyebrow-dot" /> The student network with a point of view</p>
          <h1>Find your people.<br /><em>Build what matters.</em></h1>
          <p className="hero-lede">SkillCircle connects ambitious students through the ideas they care about, the skills they are growing, and the things they want to make next.</p>
          <div className="hero-actions" id="join">
            <a className="button button-dark" href="/login">Start your circle <ArrowUpRight size={17} /></a>
            <a className="text-link" href="#how"><span className="play-icon"><Play size={13} fill="currentColor" /></span> See how it works</a>
          </div>
          <div className="hero-proof"><div className="avatar-stack">{people.map((person) => <span key={person.initials} className={`avatar avatar-${person.tone}`}>{person.initials}</span>)}</div><span><strong>12,000+</strong> students already finding their next move</span></div>
        </div>
        <div className="hero-art" aria-label="Illustration of students finding creative connections">
          <div className="art-label label-top">YOUR NEXT<br /><strong>COLLABORATOR</strong></div>
          <div className="art-orbit orbit-one" /><div className="art-orbit orbit-two" />
          <div className="connection-line line-one" /><div className="connection-line line-two" />
          <div className="person-card person-main"><div className="portrait portrait-teal">S</div><div><span>Sofia Laurent</span><small>Design + Data</small></div><span className="match">96%</span></div>
          <div className="person-card person-small small-one"><div className="portrait portrait-coral">A</div><div><span>Aarav</span><small>Product + AI</small></div></div>
          <div className="person-card person-small small-two"><div className="portrait portrait-yellow">J</div><div><span>Jules</span><small>Climate tech</small></div></div>
          <div className="signal-chip"><Sparkles size={15} /> <span>Shared signal found</span></div>
          <div className="art-number">01</div>
        </div>
      </section>

      <section className="signal-strip" id="signals"><p>Built around <strong>what makes you curious.</strong></p><div className="signal-items"><span><BrainCircuit size={18} /> Skills</span><span><Users size={18} /> People</span><span><Sparkles size={18} /> Possibility</span></div></section>

      <section className="how-section" id="how">
        <div className="section-intro"><p className="eyebrow"><span className="eyebrow-dot" /> Less noise. More signal.</p><h2>A network that<br /><em>gets you.</em></h2></div>
        <div className="feature-grid"><article><span className="feature-index">01</span><h3>Show your<br />whole self.</h3><p>Not just a résumé. Share the questions, side projects, and interests that make your path yours.</p><a href="#join" aria-label="Learn more about profiles"><ChevronRight /></a></article><article className="feature-featured"><span className="feature-index">02</span><h3>Meet by<br /><em>momentum.</em></h3><p>Our recommendations look for the spark between your skills and someone else&apos;s next big idea.</p><a href="#join" aria-label="Learn more about connections"><ChevronRight /></a></article><article><span className="feature-index">03</span><h3>Make something<br />real.</h3><p>Find teammates, discover opportunities, and turn the “what if” into a first version.</p><a href="#join" aria-label="Learn more about projects"><ChevronRight /></a></article></div>
      </section>

      <section className="community-section" id="community"><div><p className="eyebrow"><span className="eyebrow-dot" /> Your circle is waiting</p><h2>Good things<br /><em>grow together.</em></h2></div><a className="button button-coral" href="/login">Find your people <ArrowUpRight size={17} /></a></section>
      <footer id="about"><a className="brand" href="#top"><span className="brand-mark"><CircleDot size={20} strokeWidth={2.5} /></span>skill<span>circle</span></a><p>For students who are going somewhere interesting.</p><span className="footer-note">© 2026 SkillCircle</span></footer>
    </main>
  );
}
