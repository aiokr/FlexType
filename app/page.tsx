import Link from "next/link";

export default function Home() {
  return (
    <main className="container">
      <p>HomePage</p>
      <Link className="btn" href="/dashboard">Dashboard</Link>
    </main>
  );
}
