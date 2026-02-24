export const dynamic = "force-dynamic";

import { getCourses, getInternships } from "@/lib/catalog";

export default async function AboutPage() {
  const courses: any[] = await getCourses();
  const internships: any[] = await getInternships();

  return (
    <main className="container">
      <section className="card story-split">
        <img
          src="https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80"
          alt="Creative Ally classroom environment"
          className="story-image"
        />
        <div>
          <h1>About Creative Ally</h1>
          <p className="small">
            Creative Ally is a technology-focused learning platform offering job-ready courses and internships in
            software, design, AI, and engineering tools. We combine structured curriculum, mentor support, and
            practical project execution.
          </p>
          <p className="small">
            Our focus is simple: deliver skills that students can apply in interviews, internships, freelancing, and
            their first job roles.
          </p>
        </div>
      </section>

      <section className="grid" style={{ marginTop: 16 }}>
        <article className="card">
          <h3>Mission</h3>
          <p className="small">Make technical education practical, affordable, and career-oriented for every learner.</p>
        </article>
        <article className="card">
          <h3>Vision</h3>
          <p className="small">Build a skilled student ecosystem connected to real industry workflows.</p>
        </article>
        <article className="card">
          <h3>Location</h3>
          <p className="small">Kashi Institute of Technology, Varanasi, Uttar Pradesh, India</p>
        </article>
      </section>

      <section style={{ marginTop: 22 }}>
        <div className="section-head">
          <h2>How Our Training Works</h2>
          <p className="small">A learning path designed for real outcomes.</p>
        </div>
        <section className="grid">
          <article className="card"><h3>1. Foundation</h3><p className="small">Concepts taught with simple structured modules.</p></article>
          <article className="card"><h3>2. Hands-On Practice</h3><p className="small">Assignments and guided tasks in every program.</p></article>
          <article className="card"><h3>3. Mentor Review</h3><p className="small">Feedback sessions to improve quality and confidence.</p></article>
          <article className="card"><h3>4. Certification</h3><p className="small">Completion support for your profile and applications.</p></article>
        </section>
      </section>

      <section style={{ marginTop: 22 }}>
        <div className="section-head">
          <h2>Course Pricing</h2>
          <p className="small">Updated course fees with discount pricing.</p>
        </div>
        <section className="grid">
          {courses.map((course) => (
            <article className="card" key={String(course._id)}>
              <h3>{course.title}</h3>
              <p className="small">{course.description}</p>
              <p className="price-line">
                <span className="price-old">INR {course.originalPrice}</span>
                <span className="price-new">INR {course.discountedPrice}</span>
              </p>
            </article>
          ))}
        </section>
      </section>

      <section style={{ marginTop: 22 }}>
        <div className="section-head">
          <h2>Internship Pricing</h2>
          <p className="small">Updated internship fees.</p>
        </div>
        <section className="grid">
          {internships.map((internship) => (
            <article className="card" key={String(internship._id)}>
              <h3>{internship.title}</h3>
              <p className="small">{internship.description}</p>
              <p className="price-new">INR {internship.price}</p>
            </article>
          ))}
        </section>
      </section>
    </main>
  );
}
