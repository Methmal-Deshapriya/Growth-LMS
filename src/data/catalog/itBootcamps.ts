import { Sparkles, Cpu, Code2, Workflow } from "lucide-react";
import type { CatalogSection } from "@/components/marketing/catalog/types";

/**
 * Dummy catalog data — no backend distinction between bootcamp groups exists
 * yet, so this is placeholder content until the API models it properly.
 */
export const itBootcampsSection: CatalogSection = {
  basePath: "/it-bootcamps",
  eyebrow: "IT Professional Bootcamps",
  title: "Bootcamp",
  highlight: "tracks",
  subtitle: "Hands-on, industry-focused bootcamps across today's most in-demand tech fields.",
  groups: [
    {
      slug: "ai",
      title: "Artificial Intelligence",
      description: "Foundations of AI, applied reasoning systems, and where the field is headed.",
      icon: Sparkles,
      color: "text-purple-600 bg-purple-100",
      courses: [
        {
          slug: "ai-fundamentals",
          title: "Artificial Intelligence Fundamentals",
          summary: "Core AI concepts, search, and reasoning — no prior experience needed.",
          level: "Beginner",
          duration: "6 weeks",
          description:
            "A ground-up introduction to artificial intelligence — how AI systems represent problems, search for solutions, and reason under uncertainty. Built for learners starting from zero.",
          highlights: [
            "Intelligent agents and problem framing",
            "Search and optimization basics",
            "Intro to knowledge representation",
            "Where AI fits in the modern industry",
          ],
        },
        {
          slug: "nlp-basics",
          title: "Natural Language Processing Basics",
          summary: "Teaching machines to work with human language.",
          level: "Intermediate",
          duration: "5 weeks",
          description:
            "Covers the fundamentals of processing and understanding text — tokenization, embeddings, and a first look at language models.",
          highlights: [
            "Text preprocessing and tokenization",
            "Word embeddings",
            "Intro to transformer-based models",
            "Building a simple text classifier",
          ],
        },
        {
          slug: "computer-vision-essentials",
          title: "Computer Vision Essentials",
          summary: "How machines learn to interpret images.",
          level: "Intermediate",
          duration: "5 weeks",
          description:
            "An applied introduction to computer vision — image processing fundamentals through to building a basic image classifier.",
          highlights: [
            "Image processing fundamentals",
            "Convolutional neural networks",
            "Training an image classifier",
            "Real-world CV use cases",
          ],
        },
      ],
    },
    {
      slug: "machine-learning",
      title: "Machine Learning",
      description: "From core ML theory to applied, production-facing models.",
      icon: Cpu,
      color: "text-blue-600 bg-blue-100",
      courses: [
        {
          slug: "ml-fundamentals",
          title: "Machine Learning Fundamentals",
          summary: "The core algorithms and math behind machine learning.",
          level: "Beginner",
          duration: "6 weeks",
          description:
            "Builds a solid foundation in supervised and unsupervised learning, model evaluation, and the math that underpins it all.",
          highlights: [
            "Regression and classification",
            "Model evaluation and validation",
            "Clustering fundamentals",
            "Hands-on with real datasets",
          ],
        },
        {
          slug: "applied-ml-python",
          title: "Applied Machine Learning with Python",
          summary: "Building and shipping ML models with Python's ecosystem.",
          level: "Intermediate",
          duration: "7 weeks",
          description:
            "A project-driven course using Python, pandas, and scikit-learn to build, evaluate, and deploy machine learning models.",
          highlights: [
            "Data wrangling with pandas",
            "Feature engineering",
            "Model tuning with scikit-learn",
            "Shipping a model behind an API",
          ],
        },
        {
          slug: "deep-learning-foundations",
          title: "Deep Learning Foundations",
          summary: "Neural networks from first principles.",
          level: "Advanced",
          duration: "8 weeks",
          description:
            "Covers the theory and practice of deep neural networks, from backpropagation to training modern architectures.",
          highlights: [
            "Neural network fundamentals",
            "Backpropagation and optimization",
            "Working with a deep learning framework",
            "Capstone model-building project",
          ],
        },
      ],
    },
    {
      slug: "software-engineering",
      title: "Software Engineering",
      description: "Full-stack, production-grade software development.",
      icon: Code2,
      color: "text-indigo-600 bg-indigo-100",
      courses: [
        {
          slug: "full-stack-web-development",
          title: "Full-Stack Web Development",
          summary: "Build and ship real web applications end to end.",
          level: "Beginner",
          duration: "10 weeks",
          description:
            "A complete introduction to building modern web applications — frontend, backend, and everything that connects them.",
          highlights: [
            "Modern frontend fundamentals",
            "Building REST APIs",
            "Working with databases",
            "Deploying a real project",
          ],
        },
        {
          slug: "backend-engineering-nodejs",
          title: "Backend Engineering with Node.js",
          summary: "Designing reliable, scalable server-side systems.",
          level: "Intermediate",
          duration: "7 weeks",
          description:
            "Focused on backend fundamentals — API design, databases, authentication, and the practices that keep systems reliable.",
          highlights: [
            "API design principles",
            "Authentication and authorization",
            "Working with relational databases",
            "Testing and deployment basics",
          ],
        },
      ],
    },
    {
      slug: "devops",
      title: "DevOps",
      description: "The practices and tooling behind reliable software delivery.",
      icon: Workflow,
      color: "text-cyan-600 bg-cyan-100",
      courses: [
        {
          slug: "devops-fundamentals",
          title: "DevOps Fundamentals",
          summary: "The mindset and toolchain behind modern delivery pipelines.",
          level: "Beginner",
          duration: "5 weeks",
          description:
            "Introduces the core DevOps practices — version control workflows, automation, and the culture behind reliable releases.",
          highlights: [
            "Version control workflows",
            "Intro to CI/CD",
            "Infrastructure basics",
            "Monitoring and observability concepts",
          ],
        },
        {
          slug: "cicd-docker-kubernetes",
          title: "CI/CD with Docker & Kubernetes",
          summary: "Containerizing and automating real deployments.",
          level: "Intermediate",
          duration: "6 weeks",
          description:
            "A hands-on course covering containerization with Docker and orchestration with Kubernetes, tied together with CI/CD pipelines.",
          highlights: [
            "Containerizing applications with Docker",
            "Kubernetes fundamentals",
            "Building CI/CD pipelines",
            "Deploying a containerized app",
          ],
        },
      ],
    },
  ],
};
