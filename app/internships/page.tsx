export const dynamic = "force-dynamic";

import Link from "next/link";
import { getInternships } from "@/lib/catalog";
import { getInternshipMedia } from "@/lib/program-media";

export default async function InternshipsPage() {
  const internships = await getInternships();

  return (
    <main className="container">
      <h1>Internships</h1>
      <p className="small">Hands-on internship tracks with project guidance, mentor review, and completion certificate.</p>

      <section className="grid program-grid" style={{ marginTop: 12 }}>
        {internships.map((item: any) => {
          const media = getInternshipMedia(item.slug);
          return (
            <article className="card program-card" key={item._id.toString()}>
              <img src={media.imageUrl} alt={`${item.title} internship`} className="program-image" />
              <h3>{item.title}</h3>
              <p className="small">{item.description}</p>

              <div className="chip-row">
                <span className="chip">{media.duration}</span>
                <span className="chip">{media.format}</span>
                <span className="chip">{media.projects}</span>
              </div>

              <p className="small">{media.outcome}</p>

              <details>
                <summary>What you will learn</summary>
                <ul>
                  {item.whatYouLearn.map((topic: string) => <li key={topic}>{topic}</li>)}
                </ul>
              </details>
              <p className="price-new">INR {item.price}</p>
              <div className="btn-row">
                <Link href={`/internships/${item.slug}`} className="btn btn-outline">View Details</Link>
                <Link href={`/checkout?type=internship&id=${item._id}`} className="btn">Enroll Internship</Link>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
