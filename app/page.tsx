export const dynamic = "force-dynamic";

import Link from "next/link";
import { getCourses, getInternships } from "@/lib/catalog";
import { getCourseMedia, getInternshipMedia } from "@/lib/program-media";

export default async function HomePage() {
  const courses: any[] = await getCourses();
  const internships: any[] = await getInternships();

  const featuredCourses = courses.slice(0, 6);
  const featuredInternships = internships.slice(0, 4);
  const impactPoints = [
    "Mentor-led studio sessions every week",
    "Portfolio projects reviewed by practitioners",
    "Internships aligned with current hiring stacks",
    "Certification + placement preparation support"
  ];
  const learningJourney = [
    {
      title: "Foundation Sprint",
      detail: "Clear fundamentals with guided labs and check-ins."
    },
    {
      title: "Build Mode",
      detail: "You ship portfolio-grade work with mentor feedback loops."
    },
    {
      title: "Career Launch",
      detail: "Interview prep, polished profiles, and proof-of-skill outcomes."
    }
  ];

  return (
    <main className="container home-unique">
      <section className="hero hero-shell">
        <div className="hero-copy">
          <p className="hero-kicker">Project-First Learning Studio</p>
          <h1>Learn Like a Team. Build Like a Pro.</h1>
          <p className="lead">
            Creative Ally blends internships and certification programs across web, programming, design, and AI so
            students graduate with real projects, practical confidence, and interview-ready proof of work.
          </p>
          <div className="hero-actions">
            <Link href="/courses" className="btn">Explore Courses</Link>
            <Link href="/internships" className="btn btn-outline">Explore Internships</Link>
            <Link href="/contact" className="btn btn-outline">Book Counseling</Link>
          </div>
          <div className="hero-stat-row">
            <article className="card">
              <h3>10+</h3>
              <p className="small">Industry courses</p>
            </article>
            <article className="card">
              <h3>7+</h3>
              <p className="small">Practical internships</p>
            </article>
            <article className="card">
              <h3>100%</h3>
              <p className="small">Certification guidance</p>
            </article>
          </div>
        </div>

        <div className="hero-stage card">
          <div className="hero-stage-head">
            <p className="small">Inside Creative Ally</p>
            <h3>Skill Track + Live Execution</h3>
          </div>
          <div className="hero-media-grid">
            <img
              src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80"
              alt="Students learning technology"
              className="hero-media"
            />
            <img
              src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80"
              alt="Mentor-led workshop"
              className="hero-media"
            />
          </div>
          <div className="hero-stage-list">
            {impactPoints.slice(0, 3).map((point) => (
              <p key={point} className="small">{point}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="impact-strip card" aria-label="Creative Ally highlights">
        {impactPoints.map((point) => (
          <p key={point} className="small">{point}</p>
        ))}
      </section>

      <section style={{ marginTop: 24 }}>
        <div className="section-head">
          <h2>Featured Courses</h2>
          <p className="small">Detailed modules, project work, and value pricing.</p>
        </div>
        <section className="grid program-grid">
          {featuredCourses.map((course) => {
            const media = getCourseMedia(course.slug);
            return (
              <article className="card program-card" key={String(course._id)}>
                <img src={media.imageUrl} alt={`${course.title} course`} className="program-image" />
                <h3>{course.title}</h3>
                <p className="small">{course.description}</p>
                <div className="chip-row">
                  <span className="chip">{media.duration}</span>
                  <span className="chip">{media.format}</span>
                  <span className="chip">{media.projects}</span>
                </div>
                <p className="small">{media.outcome}</p>
                <p className="price-line">
                  <span className="price-old">INR {course.originalPrice}</span>
                  <span className="price-new">INR {course.discountedPrice}</span>
                </p>
                <Link href={`/courses/${course.slug}`} className="btn">View Full Course</Link>
              </article>
            );
          })}
        </section>
      </section>

      <section style={{ marginTop: 24 }}>
        <div className="section-head">
          <h2>Top Internships</h2>
          <p className="small">Short-term, practical internships with mentor guidance.</p>
        </div>
        <section className="grid program-grid">
          {featuredInternships.map((internship) => {
            const media = getInternshipMedia(internship.slug);
            return (
              <article className="card program-card" key={String(internship._id)}>
                <img src={media.imageUrl} alt={`${internship.title} internship`} className="program-image" />
                <h3>{internship.title}</h3>
                <p className="small">{internship.description}</p>
                <div className="chip-row">
                  <span className="chip">{media.duration}</span>
                  <span className="chip">{media.format}</span>
                  <span className="chip">{media.projects}</span>
                </div>
                <p className="small">{media.outcome}</p>
                <p className="price-new">INR {internship.price}</p>
                <Link href={`/internships/${internship.slug}`} className="btn">View Full Internship</Link>
              </article>
            );
          })}
        </section>
      </section>

      <section style={{ marginTop: 24 }}>
        <div className="section-head">
          <h2>Your Learning Journey</h2>
          <p className="small">A clearer path from beginner to hired candidate.</p>
        </div>
        <section className="grid pathway-grid">
          {learningJourney.map((step, index) => (
            <article className="card pathway-card" key={step.title}>
              <p className="pathway-index">{`0${index + 1}`}</p>
              <h3>{step.title}</h3>
              <p className="small">{step.detail}</p>
            </article>
          ))}
        </section>
      </section>

      <section className="card story-split" style={{ marginTop: 24 }}>
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80"
          alt="Creative Ally learning community"
          className="story-image"
        />
        <div>
          <h3>Founder Message</h3>
          <p className="small">
            At Creative Ally, we bridge the gap between college theory and industry implementation. Our programs focus
            on practical execution, confidence building, and career outcomes.
          </p>
          <p className="small">- Dev Parashar, Founder | Aman Tiwari, Cofounder</p>
          <Link href="/about" className="btn">Read About Us</Link>
        </div>
      </section>
    </main>
  );
}
