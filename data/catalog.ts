export type CourseSeedItem = {
  slug: string;
  title: string;
  description: string;
  originalPrice: number;
  discountedPrice: number;
  whatYouLearn: string[];
};

export type InternshipSeedItem = {
  slug: string;
  title: string;
  description: string;
  price: number;
  whatYouLearn: string[];
};

export const courseSeed: CourseSeedItem[] = [
  {
    slug: "ui-ux-design",
    title: "UI/UX Design",
    description: "Design user-centered digital experiences with modern tools and research methods.",
    originalPrice: 2350,
    discountedPrice: 1999,
    whatYouLearn: ["User research and personas", "Wireframes and high-fidelity mockups", "Figma prototyping", "Usability testing", "Accessibility basics"]
  },
  {
    slug: "basic-web-development",
    title: "Basic Web Development",
    description: "Build responsive websites with HTML, CSS, and JavaScript fundamentals.",
    originalPrice: 1175,
    discountedPrice: 1000,
    whatYouLearn: ["HTML5 semantic structure", "CSS layouts with Flexbox/Grid", "JavaScript DOM basics", "Responsive design", "Portfolio project"]
  },
  {
    slug: "graphic-designing",
    title: "Graphic Designing",
    description: "Create visual assets for digital branding and campaigns.",
    originalPrice: 2350,
    discountedPrice: 1999,
    whatYouLearn: ["Typography and color theory", "Photoshop and Illustrator workflows", "Social media creatives", "Brand kit design", "Portfolio creation"]
  },
  {
    slug: "python",
    title: "Python",
    description: "Learn Python programming from basics to practical scripting.",
    originalPrice: 1175,
    discountedPrice: 999,
    whatYouLearn: ["Core Python syntax", "OOP fundamentals", "File handling", "NumPy and Pandas intro", "Automation scripts"]
  },
  {
    slug: "c-cpp",
    title: "C/C++",
    description: "Master programming logic and performance-oriented development with C and C++.",
    originalPrice: 2350,
    discountedPrice: 1999,
    whatYouLearn: ["C syntax and pointers", "Memory management", "C++ OOP", "STL essentials", "Project implementation"]
  },
  {
    slug: "java",
    title: "Java",
    description: "Develop robust Java applications with OOP, collections, and database connectivity.",
    originalPrice: 2350,
    discountedPrice: 1999,
    whatYouLearn: ["Core Java", "Collections framework", "Exception handling", "Multithreading", "JDBC integration"]
  },
  {
    slug: "autocad",
    title: "Autocad",
    description: "Learn 2D/3D drafting for engineering and architectural applications.",
    originalPrice: 2350,
    discountedPrice: 1999,
    whatYouLearn: ["2D drafting", "Layer and block management", "3D basics", "Annotation and plotting", "Industry standards"]
  },
  {
    slug: "ai-machine-learning",
    title: "AI / Machine Learning",
    description: "Build practical machine learning models with Python libraries.",
    originalPrice: 2350,
    discountedPrice: 1999,
    whatYouLearn: ["ML workflow", "Regression and classification", "Model evaluation", "Neural network basics", "Mini capstone"]
  },
  {
    slug: "full-stack-development",
    title: "Full Stack Development",
    description: "Build end-to-end web applications using modern frontend and backend stacks.",
    originalPrice: 3525,
    discountedPrice: 2999,
    whatYouLearn: ["React fundamentals", "Node.js + Express", "MongoDB integration", "Authentication", "Deployment basics"]
  },
  {
    slug: "app-development",
    title: "App Development",
    description: "Create modern mobile applications with practical project-based learning.",
    originalPrice: 2999,
    discountedPrice: 2499,
    whatYouLearn: ["Mobile UI principles", "State management", "API integration", "Build and release flow", "Real app project"]
  }
];

export const internshipSeed: InternshipSeedItem[] = [
  {
    slug: "intern-basic-web-development",
    title: "Basic Web Development",
    description: "Hands-on internship focused on responsive websites and deployment basics.",
    price: 599,
    whatYouLearn: ["HTML/CSS production", "JS interaction", "Bootstrap practice", "Mini team project"]
  },
  {
    slug: "intern-full-stack-development",
    title: "Full Stack Development",
    description: "Build a full-stack project with mentor guidance and weekly code reviews.",
    price: 999,
    whatYouLearn: ["API development", "Frontend integration", "DB modeling", "Deployment"]
  },
  {
    slug: "intern-graphic-designing",
    title: "Graphic Designing",
    description: "Internship to produce real campaign creatives and branding assets.",
    price: 599,
    whatYouLearn: ["Campaign design", "Poster/social kit", "Client-style revisions", "Portfolio polish"]
  },
  {
    slug: "intern-ui-ux-designing",
    title: "UI/UX Designing",
    description: "Research, prototype, and test product interfaces in a practical workflow.",
    price: 399,
    whatYouLearn: ["UX research", "Figma systems", "User testing", "Case study writing"]
  },
  {
    slug: "intern-data-science",
    title: "Data Science",
    description: "Analyze datasets and build predictive insights using Python.",
    price: 999,
    whatYouLearn: ["Data cleaning", "EDA", "Modeling", "Visualization"]
  },
  {
    slug: "intern-cyber-security",
    title: "Cyber Security",
    description: "Learn practical cyber defense, vulnerability basics, and secure practices.",
    price: 999,
    whatYouLearn: ["Threat basics", "Security testing intro", "OWASP concepts", "Incident basics"]
  },
  {
    slug: "intern-autocad",
    title: "Autocad",
    description: "Work on engineering-style drafting assignments with review sessions.",
    price: 999,
    whatYouLearn: ["2D drafting tasks", "Dimensioning", "Plot setup", "Project documentation"]
  }
];
