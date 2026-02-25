"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data } = useSession();
  const role = (data?.user as any)?.role;

  return (
    <header className="nav">
      <div className="nav-inner">
        <Link href="/" className="brand" aria-label="Creative Ally Home">
          <span className="brand-mark" aria-hidden>CA</span>
          <span>Creative Ally</span>
        </Link>
        <nav className="nav-links">
          <Link href="/about">About</Link>
          <Link href="/courses">Courses</Link>
          <Link href="/internships">Internships</Link>
          <Link href="/campus-ambassador">Campus Ambassador</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/certificates">Certificates</Link>
          {data?.user ? <Link href="/dashboard">Dashboard</Link> : <Link href="/login">Login</Link>}
          {role === "admin" && <Link href="/admin">Admin</Link>}
          {data?.user && <button className="btn btn-outline" onClick={() => signOut({ callbackUrl: "/" })}>Logout</button>}
        </nav>
      </div>
    </header>
  );
}
