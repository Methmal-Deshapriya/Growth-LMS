import { image } from "motion/react-client";

export const hero_data = {
  hero_title: "AI/Machine Learning Ignition Program",
  hero_ImageURL: "/assets/machine-learning/mlhero.png",
  hero_duration: "12 Weeks",
  hero_learningHours: "30+ hours of Learning",
  theme: {
    titileGradient: "bg-linear-to-r from-blue-500 to-blue-600",
    floatingGradient1: "",
    floatingGradient2: "opacity-0",
    floatingGradient3: "",
    ctaButtonGradient: "bg-blue-600",
  },
};

export const courseDescription_data = {
  courseDescription_headline_duration: "3 months?",
  courseDescription_headline_persuational: "most in demand Skill in IT",
  courseDescription_description:
    "The Introduction to AI/ML course by Foundry Academy is a beginner-friendly program designed for students after A/Ls who are curious about Artificial Intelligence and Machine Learning. Throughout the course, students learn the essentials of Python programming, data analysis with Pandas and NumPy, and data visualization using Matplotlib. They also explore how real AI models work through hands-on lessons in regression, classification, and basic web deployment. By the end, students gain practical skills to build simple AI projects and understand how modern technologies like ChatGPT and image generators shape the world",
  theme: {
    durationBackground: "bg-purple-300",
  },
};

export const introVideo_data = {
  introVideo_videoURL: "https://www.youtube.com/embed/m2ODnmNLDEs",
};

export const curriculum_data = {
  curriculum_timeline_duration: "12 Weeks",
  curriculum_timeline_journey: "AI/ML Journey",
  curriculum_data: [
    {
      week: "Week 1",
      headline: "Getting Started with AI & Environment Setup",
      content:
        'Your journey begins here! In this first week, we strip away the complexity of setting up a coding environment. Students will get comfortable with the tools of the trade, installing Python and VS Code, and learning how to navigate Jupyter Notebooks. We focus on getting your computer ready to "think" like a data scientist, ensuring everyone starts on the same page regardless of their technical background.',
    },
    {
      week: "Week 2",
      headline: "The World of AI & Generative Technologies",
      content:
        'What actually is Artificial Intelligence? Beyond the movies and hype, we explore the history and future of AI. This week dives into the exciting world of Generative AI, exploring how Large Language Models (like ChatGPT) and image generators work. Students will learn the difference between "Narrow AI" and "General AI" and discuss the ethical considerations of using these powerful tools in the real world.',
    },
    {
      week: "Week 3",
      headline: "Python for AI – From Basics to Advanced",
      content:
        'Python is the language of AI, and this week covers it all. We move quickly from "Hello World" to writing complex logic. Students will master the core programming concepts essential for Machine Learning—variables, loops, functions, and data structures. By the end of this module, students will be writing clean, efficient code that serves as the foundation for all future data analysis.',
    },
    {
      week: "Week 4",
      headline: "Data Handling with Pandas",
      content:
        "Data is the fuel for AI, but real-world data is often messy. In this module, students learn to tame data using Pandas, the industry-standard library for data manipulation. You will learn how to load datasets (like Excel or CSV files), clean up errors, filter information, and structure raw data into a format that computers can understand and analyze.",
    },
    {
      week: "Week 5",
      headline: "Data Processing & Visualization",
      content:
        "Numbers alone can be hard to interpret. This week focuses on Matplotlib and Seaborn to turn data into visual stories. Students will learn how to process numerical data using NumPy and create compelling charts, graphs, and heatmaps. This skill is crucial for identifying trends, outliers, and patterns that are invisible in a spreadsheet.",
    },
    {
      week: "Week 6",
      headline: "Data Analysis in Action",
      content:
        "It’s time to put theory into practice. In this hands-on module, students will take a raw, real-world dataset and perform a complete Exploratory Data Analysis (EDA). By combining the Python, Pandas, and plotting skills learned so far, students will uncover hidden insights and answer real questions about the data, mimicking the day-to-day work of a junior data analyst.",
    },
    {
      week: "Week 7",
      headline: "Introduction to Machine Learning",
      content:
        'This is where the magic happens. We demystify "training a model." Students will be introduced to Scikit-learn and the core concepts of Supervised Learning. We will cover Regression (predicting numbers, like house prices) and Classification (sorting things, like spam vs. not spam). Students will build, train, and test their very first predictive models.',
    },
    {
      week: "Week 8",
      headline: "Bringing AI to the Web",
      content:
        "An AI model living on your laptop isn't very useful to the world. This week teaches students how to deploy their models using simple web frameworks (like Streamlit). You will learn to build a user-friendly interface where anyone can input data and get a prediction from your AI, effectively turning your code into a functional web application.",
    },
    {
      week: "Week 9 - 12",
      headline: "Final Project & Wrap-Up",
      content:
        "Students work individually or in small teams to identify a real-world problem they want to solve using AI. Over several weeks, students apply every skill they have learned—collecting data, cleaning it, training a model, and building a web interface. The course concludes with a final presentation where students demonstrate their working AI applications. We also wrap up with career guidance, discussing next steps for those who want to pursue a career in Data Science or Software Engineering.",
    },
  ],
  theme: {
    timelineBackground: "bg-blue-50",
  },
};

export const forWho_data = {
  forWho_ImageURL: "/assets/machine-learning/al.webp",
  forWho_description:
    "You'll get a clear idea of how university-style learning works. Experience doing assignments and projects like in university. Basic Python and data analysis skills. Hands-on experience with AI and Machine Learning. Confidence to start university ICT or AI-related studies. A completed mini AI project to show their skills.",
  forWho_durationPerWeek: "3h Sessions per Week",
  forWho_weeks: "12 Weeks + Bunch of Practicles",
  forWho_skills: [
    "Machine learning",
    "Data Cleaning",
    "Data Engineering",
    "Prompt Engineering",
    "Python",
    "Pandas",
    "Numpy",
    "Feature Engineering",
    "FastAPI",
    "Data Visualization",
    "Supervised Learning",
    "Git",
    "Github",
    "Netlify",
    "Reactjs",
  ],
};

export const certificate_data = {
  certificate_certificateImageURL: "/assets/machine-learning/certification.png",
};

export const priceDetails_data = {
  priceDetails_title_1: "AI/Machine Learning",
  priceDetails_title_2: "Ignition Program",
  priceDetails_benefits: [
    "Project based Learning",
    "Interview Skills Enhanced with Every Module",
    "Unlimited Personal Mentorship",
    "Access Tons of Bonus Learning Guides, Materials",
  ],
  priceDetails_price: "LKR 5000",
};

export const machineLearning = {
  slug: "machine-learning",
  hero_data: hero_data,
  courseDescription_data: courseDescription_data,
  introVideo_data: introVideo_data,
  curriculum_data: curriculum_data,
  forWho_data: forWho_data,
  certificate_data: certificate_data,
  priceDetails_data: priceDetails_data,
};
