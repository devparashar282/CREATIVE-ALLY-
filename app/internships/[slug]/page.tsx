export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { getInternshipBySlug } from "@/lib/catalog";
import { getInternshipMedia } from "@/lib/program-media";

type InternshipDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function InternshipDetailPage({ params }: InternshipDetailPageProps) {
  const { slug } = await params;
  const internship: any = await getInternshipBySlug(slug);
  if (!internship) notFound();

  const media = getInternshipMedia(internship.slug);
  const enrollHref = `/checkout?type=internship&id=${encodeURIComponent(String(internship._id))}`;

  return (
    <main className="container">
      <section className="card detail-hero">
        <img src={media.imageUrl} alt={`${internship.title} details`} className="detail-image" />
        <div>
          <p className="small">Internship Program</p>
          <h1>{internship.title}</h1>
          <p className="small">{internship.description}</p>
          <div className="chip-row" style={{ margin: "10px 0" }}>
            <span className="chip">{media.duration}</span>
            <span className="chip">{media.format}</span>
            <span className="chip">{media.projects}</span>
          </div>
          <p className="small">{media.outcome}</p>
          <p className="price-new">INR {internship.price}</p>
          <div className="btn-row">
            <Link href={enrollHref} className="btn">Enroll Internship</Link>
            <Link href="/internships" className="btn btn-outline">Back to Internships</Link>
          </div>
        </div>
      </section>

      <section className="grid" style={{ marginTop: 16 }}>
        <article className="card">
          <h3>What You Will Learn</h3>
          <ul className="detail-list">
            {internship.whatYouLearn.map((topic: string) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </article>
        <article className="card">
          <h3>Internship Benefits</h3>
          <ul className="detail-list">
            <li>Hands-on execution with mentor checkpoints</li>
            <li>Weekly performance feedback and improvement plan</li>
            <li>Internship completion certificate</li>
            <li>Project summary suitable for resume and interviews</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
