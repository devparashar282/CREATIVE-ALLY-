export const dynamic = "force-dynamic";

import Link from "next/link";
import { getCourses } from "@/lib/catalog";
import { getCourseMedia } from "@/lib/program-media";

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <main className="container">
      <h1>Our Courses</h1>
      <p className="small" style={{ marginTop: 4 }}>
        Industry-aligned curriculum with project work, mentor support, and updated discounted pricing.
      </p>

      <section className="grid program-grid" style={{ marginTop: 12 }}>
        {courses.map((course: any) => {
          const media = getCourseMedia(course.slug);
          return (
            <article className="card program-card" key={course._id.toString()}>
              <img src={media.imageUrl} alt={`${course.title} course`} className="program-image" />
              <h3>{course.title}</h3>
              <p className="small">{course.description}</p>

              <div className="chip-row">
                <span className="chip">{media.duration}</span>
                <span className="chip">{media.format}</span>
                <span className="chip">{media.projects}</span>
              </div>

              <p className="small">{media.outcome}</p>

              <details>
                <summary>What you will learn</summary>
                <ul>
                  {course.whatYouLearn.map((topic: string) => <li key={topic}>{topic}</li>)}
                </ul>
              </details>

              <p className="price-line">
                <span className="price-old">INR {course.originalPrice}</span>
                <span className="price-new">INR {course.discountedPrice}</span>
              </p>
              <div className="btn-row">
                <Link href={`/courses/${course.slug}`} className="btn btn-outline">View Details</Link>
                <Link href={`/checkout?type=course&id=${course._id}`} className="btn">Enroll Now</Link>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
