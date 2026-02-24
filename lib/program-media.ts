type ProgramMedia = {
  imageUrl: string;
  duration: string;
  format: string;
  projects: string;
  outcome: string;
};

const defaultCourseMedia: ProgramMedia = {
  imageUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
  duration: "6 Weeks",
  format: "Live + Recorded",
  projects: "2 Guided Projects",
  outcome: "Job-ready practical skills with certificate"
};

const defaultInternshipMedia: ProgramMedia = {
  imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
  duration: "4 Weeks",
  format: "Project Internship",
  projects: "1 Major Project",
  outcome: "Internship completion certificate + mentor feedback"
};

const courseMediaBySlug: Record<string, ProgramMedia> = {
  "ui-ux-design": {
    imageUrl: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=1200&q=80",
    duration: "6 Weeks",
    format: "Live + Recorded",
    projects: "3 UI Case Studies",
    outcome: "Portfolio-ready design process and prototypes"
  },
  "basic-web-development": {
    imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=1200&q=80",
    duration: "6 Weeks",
    format: "Live + Practice Labs",
    projects: "2 Website Builds",
    outcome: "Responsive frontend fundamentals"
  },
  "graphic-designing": {
    imageUrl: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80",
    duration: "6 Weeks",
    format: "Studio Style Classes",
    projects: "Campaign Design Kit",
    outcome: "Branding and social creative workflow"
  },
  python: {
    imageUrl: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?auto=format&fit=crop&w=1200&q=80",
    duration: "6 Weeks",
    format: "Live Coding Sessions",
    projects: "Automation + Data Tasks",
    outcome: "Core to intermediate Python confidence"
  },
  "c-cpp": {
    imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
    duration: "7 Weeks",
    format: "Compiler-focused Practice",
    projects: "Logic + STL Projects",
    outcome: "Strong programming and problem-solving foundation"
  },
  java: {
    imageUrl: "https://images.unsplash.com/photo-1517430816045-df4b7de11d1d?auto=format&fit=crop&w=1200&q=80",
    duration: "7 Weeks",
    format: "Live + Assignments",
    projects: "Core Java App",
    outcome: "OOP and backend-ready Java fundamentals"
  },
  autocad: {
    imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    duration: "6 Weeks",
    format: "Hands-on CAD Lab",
    projects: "2D + 3D Draft Sheets",
    outcome: "Industry drafting practices"
  },
  "ai-machine-learning": {
    imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
    duration: "8 Weeks",
    format: "Live + Notebook Labs",
    projects: "ML Mini Capstone",
    outcome: "Model training and evaluation workflow"
  },
  "full-stack-development": {
    imageUrl: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=1200&q=80",
    duration: "10 Weeks",
    format: "Bootcamp Style",
    projects: "Full Product Build",
    outcome: "End-to-end development with deployment"
  },
  "app-development": {
    imageUrl: "https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?auto=format&fit=crop&w=1200&q=80",
    duration: "10 Weeks",
    format: "Live + Mobile Labs",
    projects: "Production-ready Mobile App",
    outcome: "Complete app lifecycle understanding"
  }
};

const internshipMediaBySlug: Record<string, ProgramMedia> = {
  "intern-basic-web-development": {
    imageUrl: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    duration: "4 Weeks",
    format: "Mentored Internship",
    projects: "Frontend Client Task",
    outcome: "Real delivery workflow for websites"
  },
  "intern-full-stack-development": {
    imageUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
    duration: "6 Weeks",
    format: "Mentored Internship",
    projects: "Full-stack Product Module",
    outcome: "API, DB, and frontend integration experience"
  },
  "intern-graphic-designing": {
    imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80",
    duration: "4 Weeks",
    format: "Creative Internship",
    projects: "Brand + Social Campaign Pack",
    outcome: "Portfolio-ready design execution"
  },
  "intern-ui-ux-designing": {
    imageUrl: "https://images.unsplash.com/photo-1586717799252-bd134ad00e26?auto=format&fit=crop&w=1200&q=80",
    duration: "4 Weeks",
    format: "Mentored Internship",
    projects: "UX Research + Prototype",
    outcome: "Design thinking and usability process practice"
  },
  "intern-data-science": {
    imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    duration: "6 Weeks",
    format: "Analytics Internship",
    projects: "Data Insights Project",
    outcome: "EDA, modeling, and reporting experience"
  },
  "intern-cyber-security": {
    imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1200&q=80",
    duration: "6 Weeks",
    format: "Security Internship",
    projects: "Security Assessment Exercise",
    outcome: "Defensive security fundamentals"
  },
  "intern-autocad": {
    imageUrl: "https://images.unsplash.com/photo-1536895058696-a69b1c7ba34f?auto=format&fit=crop&w=1200&q=80",
    duration: "6 Weeks",
    format: "Drafting Internship",
    projects: "Technical Sheet Project",
    outcome: "Practical CAD drafting and documentation"
  }
};

export function getCourseMedia(slug?: string) {
  if (!slug) return defaultCourseMedia;
  return courseMediaBySlug[slug] || defaultCourseMedia;
}

export function getInternshipMedia(slug?: string) {
  if (!slug) return defaultInternshipMedia;
  return internshipMediaBySlug[slug] || defaultInternshipMedia;
}
