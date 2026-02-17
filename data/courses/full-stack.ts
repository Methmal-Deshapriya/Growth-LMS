export const hero_data = {
  hero_title: "Full-Stack Engineering Origin Program",
  hero_ImageURL: "/assets/full-stack/fshero.png",
  hero_duration: "12 Weeks",
  hero_learningHours: "40+ hours of Learning",
  theme: {
    titileGradient: "bg-linear-to-r from-[#F4A261] to-[#E76F51]",
    floatingGradient1: "bg-[#F4A261] opacity-30",
    floatingGradient2: "bg-green-200 opacity-30 h-42",
    floatingGradient3: "opacity-0",
    ctaButtonGradient: "bg-[#F4A261] hover:bg-[#E76F51]",
  },
};

export const courseDescription_data = {
  courseDescription_headline_duration: "3 months?",
  courseDescription_headline_persuational:
    "The most versatile career path in Tech",
  courseDescription_description:
    "The Full-Stack Engineering course by Foundry Academy is a comprehensive, project-based program designed for after A/L students to master the art of building modern web applications. Starting from the building blocks of the web—HTML, CSS, and JavaScript—students will transition into advanced frontend development with React. The journey continues into backend architecture using Node.js and Express, along with database management via MongoDB. By the end of the 12 weeks, students will have built and deployed a fully functional MERN stack application, gaining the exact skills needed to start a career in software engineering.",
  theme: {
    durationBackground: "bg-yellow-200",
  },
};

export const introVideo_data = {
  introVideo_videoURL: "https://www.youtube.com/embed/your-fs-video-id", // Replace with your actual video ID
};

export const curriculum_data = {
  curriculum_timeline_duration: "12 Weeks",
  curriculum_timeline_journey: "Full-Stack Journey",
  curriculum_data: [
    {
      week: "Week 1",
      headline: "The Architecture of the Web & HTML5",
      content:
        "We start by understanding how the internet actually works. Students will learn about Client-Server architecture, HTTP requests, and the skeleton of every website: HTML5. By the end of this week, you’ll be structuring professional-grade web pages with semantic tags, forms, and media elements.",
    },
    {
      week: "Week 2",
      headline: "Modern Styling with CSS3 & Flexbox",
      content:
        "It's time to make things look beautiful. We dive deep into CSS3, covering the Box Model, Typography, and Colors. The highlight of this week is mastering Layout Engines like Flexbox and CSS Grid, ensuring students can build responsive designs that look perfect on both mobile and desktop screens.",
    },
    {
      week: "Week 3",
      headline: "JavaScript Fundamentals: The Logic of the Web",
      content:
        "JavaScript is the brain of the browser. We move from static pages to interactive ones. Students will learn programming logic: variables, data types, loops, and functions. We focus on 'Vanilla JS' to ensure a strong foundation before moving to frameworks, teaching students how to manipulate the DOM to create dynamic user experiences.",
    },
    {
      week: "Week 4",
      headline: "Advanced JavaScript & ES6+",
      content:
        "Modern web development requires modern JavaScript. This week covers ES6 features like Arrow Functions, Destructuring, Template Literals, and Asynchronous programming (Promises & Async/Await). Understanding how to fetch data from APIs is a key milestone this week, preparing students for real-world data integration.",
    },
    {
      week: "Week 5",
      headline: "Introduction to React: Components & Props",
      content:
        "We enter the world of modern frontend frameworks. Students will learn why React is the industry favorite. We cover JSX, functional components, and the concept of 'Props' for passing data. By the end of this week, students will be thinking in 'Components,' breaking down complex UIs into reusable pieces.",
    },
    {
      week: "Week 6",
      headline: "State Management & React Hooks",
      content:
        "How do apps remember things? We explore State Management using the useState and useEffect hooks. Students will build interactive applications like To-Do lists and Weather apps, learning how to handle user input and manage the lifecycle of a React component effectively.",
    },
    {
      week: "Week 7",
      headline: "Backend Basics with Node.js & Express",
      content:
        "Now we go 'under the hood.' Students will learn to use Node.js to run JavaScript on the server. We introduce Express.js to build RESTful APIs. This week focuses on routing, middleware, and handling backend logic, allowing students to create their own custom API endpoints.",
    },
    {
      week: "Week 8",
      headline: "Databases with MongoDB & Mongoose",
      content:
        "A real app needs a memory. We dive into NoSQL databases using MongoDB. Students will learn how to model data with Mongoose, perform CRUD (Create, Read, Update, Delete) operations, and connect their backend server to a cloud-based database (MongoDB Atlas).",
    },
    {
      week: "Week 9 - 12",
      headline: "Final MERN Project & Cloud Deployment",
      content:
        "The climax of the bootcamp! Students will work on a 'Capston Project'—a full-stack application (like a Social Media clone or E-commerce site) using the MERN stack. We cover User Authentication (JWT), connecting the React frontend to the Express backend, and finally, deploying the app to the cloud using platforms like Vercel and Render. The course ends with portfolio building and interview prep for junior developer roles.",
    },
  ],
  theme: {
    timelineBackground: "bg-blue-50",
  },
};

export const forWho_data = {
  forWho_ImageURL: "/assets/machine-learning/al.webp",
  forWho_description:
    "You'll gain the confidence to build any web idea from scratch. This course bridges the gap between school and the tech industry. Experience professional workflows including Git version control and team collaboration. By the end, you'll have a production-ready portfolio project and the foundation to excel in university-level Computer Science or Software Engineering degrees.",
  forWho_durationPerWeek: "4h Sessions per Week",
  forWho_weeks: "12 Weeks + 24/7 Coding Support",
  forWho_skills: [
    "HTML5 & CSS3",
    "JavaScript (ES6+)",
    "React.js",
    "Node.js",
    "Express.js",
    "MongoDB",
    "REST APIs",
    "Tailwind CSS",
    "Git & GitHub",
    "State Management",
    "JWT Authentication",
    "Vercel Deployment",
    "Postman",
    "Responsive Design",
  ],
};

export const certificate_data = {
  certificate_certificateImageURL: "/assets/machine-learning/certification.png",
};

export const priceDetails_data = {
  priceDetails_title_1: "Full-Stack Engineering",
  priceDetails_title_2: "Ignition Program",
  priceDetails_benefits: [
    "Build a Real-World SaaS Project",
    "Portfolio Review & GitHub Optimization",
    "One-on-One Debugging Sessions",
    "Industry-Standard Coding Practices",
  ],
  priceDetails_price: "LKR 6500", // Slightly higher due to server/database complexity
};

export const fullStackEngineering = {
  slug: "full-stack-engineering",
  hero_data: hero_data,
  courseDescription_data: courseDescription_data,
  introVideo_data: introVideo_data,
  curriculum_data: curriculum_data,
  forWho_data: forWho_data,
  certificate_data: certificate_data,
  priceDetails_data: priceDetails_data,
};
