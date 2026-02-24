export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourseBySlug } from "@/lib/catalog";
import { getCourseMedia } from "@/lib/program-media";

type CourseDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const { slug } = await params;
  const course: any = await getCourseBySlug(slug);
  if (!course) notFound();

  const media = getCourseMedia(course.slug);
  const enrollHref = `/checkout?type=course&id=${encodeURIComponent(String(course._id))}`;

  return (
    <main className="container">
      <section className="card detail-hero">
        <img src={media.imageUrl} alt={`${course.title} details`} className="detail-image" />
        <div>
          <p className="small">Course Program</p>
          <h1>{course.title}</h1>
          <p className="small">{course.description}</p>
          <div className="chip-row" style={{ margin: "10px 0" }}>
            <span className="chip">{media.duration}</span>
            <span className="chip">{media.format}</span>
            <span className="chip">{media.projects}</span>
          </div>
          <p className="small">{media.outcome}</p>
          <p className="price-line">
            <span className="price-old">INR {course.originalPrice}</span>
            <span className="price-new">INR {course.discountedPrice}</span>
          </p>
          <div className="btn-row">
            <Link href={enrollHref} className="btn">Enroll Now</Link>
            <Link href="/courses" className="btn btn-outline">Back to Courses</Link>
          </div>
        </div>
      </section>

      <section className="grid" style={{ marginTop: 16 }}>
        <article className="card">
          <h3>What You Will Learn</h3>
          <ul className="detail-list">
            {course.whatYouLearn.map((topic: string) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </article>
        <article className="card">
          <h3>Program Benefits</h3>
          <ul className="detail-list">
            <li>Mentor-led sessions and practical assignments</li>
            <li>Real project workflow with review support</li>
            <li>Certificate after successful completion</li>
            <li>Career guidance for internship/job readiness</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
