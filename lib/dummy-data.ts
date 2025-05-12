import type { Category } from '@/components/dashboard/category-tree';

// Nested categories data
export const categoriesData: Category[] = [
  {
    id: 'interview-prep',
    name: 'Interview Prep',
    subcategories: [
      {
        id: 'behavioral',
        name: 'Behavioral Questions',
      },
      {
        id: 'technical',
        name: 'Technical Questions',
        subcategories: [
          {
            id: 'algorithms',
            name: 'Algorithms',
          },
          {
            id: 'system-design',
            name: 'System Design',
          },
        ],
      },
      {
        id: 'company-specific',
        name: 'Company Specific',
        subcategories: [
          {
            id: 'google',
            name: 'Google',
          },
          {
            id: 'amazon',
            name: 'Amazon',
          },
          {
            id: 'microsoft',
            name: 'Microsoft',
          },
        ],
      },
    ],
  },
  {
    id: 'professional-development',
    name: 'Professional Development',
    subcategories: [
      {
        id: 'leadership',
        name: 'Leadership',
      },
      {
        id: 'communication',
        name: 'Communication Skills',
      },
      {
        id: 'project-management',
        name: 'Project Management',
      },
    ],
  },
  {
    id: 'technical-skills',
    name: 'Technical Skills',
    subcategories: [
      {
        id: 'programming',
        name: 'Programming',
        subcategories: [
          {
            id: 'javascript',
            name: 'JavaScript',
          },
          {
            id: 'python',
            name: 'Python',
          },
          {
            id: 'java',
            name: 'Java',
          },
        ],
      },
      {
        id: 'databases',
        name: 'Databases',
      },
      {
        id: 'cloud',
        name: 'Cloud Technologies',
      },
    ],
  },
  {
    id: 'personal',
    name: 'Personal Notes',
    subcategories: [
      {
        id: 'goals',
        name: 'Goals',
      },
      {
        id: 'reflections',
        name: 'Reflections',
      },
    ],
  },
];

// Questions data
export interface Question {
  id: string;
  question: string;
  answer: string;
  categoryPath: string[];
}

export const questionsData: Question[] = [
  {
    id: 'q1',
    question: 'Tell me about yourself',
    answer:
      "I am a software engineer with 5 years of experience specializing in full-stack development. I've worked on a variety of projects ranging from e-commerce platforms to data visualization tools.\n\nMy technical skills include JavaScript, React, Node.js, and SQL. I'm passionate about creating clean, efficient code and solving complex problems.\n\nIn my previous role at XYZ Company, I led a team of 4 developers to successfully launch a new customer portal that increased user engagement by 40%.",
    categoryPath: ['Interview Prep', 'Behavioral Questions'],
  },
  {
    id: 'q2',
    question: 'What is your greatest strength?',
    answer:
      'My greatest strength is my ability to quickly adapt to new technologies and methodologies. I believe in continuous learning and regularly dedicate time to explore new tools and frameworks.\n\nFor example, when my team needed to implement a real-time feature in our application, I took the initiative to learn WebSockets over a weekend and created a proof of concept that we eventually implemented in production.\n\nThis adaptability has allowed me to contribute effectively across different projects and teams throughout my career.',
    categoryPath: ['Interview Prep', 'Behavioral Questions'],
  },
  {
    id: 'q3',
    question: 'Describe a challenging project you worked on',
    answer:
      "One of the most challenging projects I worked on was migrating a legacy monolithic application to a microservices architecture while ensuring zero downtime.\n\nThe challenges included:\n- Identifying service boundaries in tightly coupled code\n- Managing data consistency across services\n- Ensuring performance didn't degrade during the transition\n\nI approached this by first creating a detailed dependency map of the existing system, then implementing the strangler pattern to gradually replace components. We used feature flags to control the rollout and set up comprehensive monitoring.\n\nThe result was a successful migration that improved system scalability by 300% and reduced deployment time from hours to minutes.",
    categoryPath: ['Interview Prep', 'Behavioral Questions'],
  },
  {
    id: 'q4',
    question: 'Explain how you would implement a binary search algorithm',
    answer:
      "Binary search is an efficient algorithm for finding an element in a sorted array. Here's how I would implement it:\n\n```javascript\nfunction binarySearch(arr, target) {\n  let left = 0;\n  let right = arr.length - 1;\n  \n  while (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    \n    if (arr[mid] === target) {\n      return mid; // Found the target\n    }\n    \n    if (arr[mid] < target) {\n      left = mid + 1; // Target is in the right half\n    } else {\n      right = mid - 1; // Target is in the left half\n    }\n  }\n  \n  return -1; // Target not found\n}\n```\n\nThe time complexity is O(log n) because we divide the search space in half with each iteration. The space complexity is O(1) as we only use a constant amount of extra space.",
    categoryPath: ['Interview Prep', 'Technical Questions', 'Algorithms'],
  },
  {
    id: 'q5',
    question: 'Design a scalable web service that can handle millions of users',
    answer:
      'To design a scalable web service for millions of users, I would focus on these key areas:\n\n1. **Architecture**:\n   - Use a microservices architecture to enable independent scaling\n   - Implement stateless services where possible\n   - Use event-driven architecture for asynchronous processing\n\n2. **Database Strategy**:\n   - Implement database sharding for horizontal scaling\n   - Use read replicas to distribute query load\n   - Consider NoSQL databases for specific use cases\n   - Implement caching layers (Redis/Memcached)\n\n3. **Load Balancing**:\n   - Use load balancers to distribute traffic\n   - Implement auto-scaling based on traffic patterns\n\n4. **Caching Strategy**:\n   - CDN for static assets\n   - Application-level caching\n   - Database query caching\n\n5. **Monitoring and Resilience**:\n   - Implement comprehensive monitoring\n   - Design for failure with circuit breakers\n   - Use health checks and automatic recovery\n\n6. **Global Distribution**:\n   - Use multiple regions for disaster recovery\n   - Implement geo-routing to direct users to the closest datacenter\n\nThis approach ensures the system can scale horizontally as user demand increases while maintaining performance and reliability.',
    categoryPath: ['Interview Prep', 'Technical Questions', 'System Design'],
  },
  {
    id: 'q6',
    question: 'What are your career goals for the next 5 years?',
    answer:
      'In the next 5 years, I aim to grow both technically and as a leader in the technology space. My specific goals include:\n\n1. Deepening my expertise in distributed systems and cloud architecture\n2. Taking on a technical leadership role where I can mentor junior developers\n3. Contributing to open-source projects in my field\n4. Speaking at industry conferences to share knowledge\n5. Potentially pursuing a specialized certification or advanced degree in computer science\n\nI believe these goals align well with the growth trajectory at your company, especially given your focus on innovative technology solutions and collaborative team environment.',
    categoryPath: ['Professional Development', 'Goals'],
  },
  {
    id: 'q7',
    question: 'Explain the concept of database normalization',
    answer:
      'Database normalization is the process of structuring a relational database to reduce data redundancy and improve data integrity. It involves organizing fields and tables to minimize duplication and dependency.\n\nThe main normalization forms are:\n\n1. **First Normal Form (1NF)**:\n   - Each table cell should contain a single value\n   - Each record needs to be unique\n\n2. **Second Normal Form (2NF)**:\n   - Table is in 1NF\n   - All non-key attributes are fully dependent on the primary key\n\n3. **Third Normal Form (3NF)**:\n   - Table is in 2NF\n   - No transitive dependencies (non-key attributes depend only on the primary key)\n\n4. **Boyce-Codd Normal Form (BCNF)**:\n   - A stricter version of 3NF\n   - For any dependency A → B, A should be a super key\n\n5. **Fourth Normal Form (4NF)** and **Fifth Normal Form (5NF)**:\n   - Deal with multi-valued dependencies and join dependencies\n\nBenefits of normalization include:\n- Reduced data redundancy\n- Better data integrity\n- Smaller database size\n- More efficient queries for certain operations\n\nHowever, excessive normalization can lead to performance issues due to the need for complex joins. In practice, some denormalization might be applied for performance optimization.',
    categoryPath: ['Technical Skills', 'Databases'],
  },
  {
    id: 'q8',
    question: 'How do you handle conflicts in a team environment?',
    answer:
      "My approach to handling conflicts in a team environment follows these principles:\n\n1. **Address issues early**: I believe in addressing conflicts as soon as they arise rather than letting them escalate.\n\n2. **Focus on active listening**: I make sure to understand all perspectives by listening carefully before responding.\n\n3. **Separate people from problems**: I focus on the issue at hand rather than making it personal.\n\n4. **Look for common ground**: I try to identify shared goals and interests that can serve as a foundation for resolution.\n\n5. **Collaborate on solutions**: I work with all parties to brainstorm solutions that address everyone's concerns.\n\nFor example, in my previous role, two team members had different approaches to implementing a feature. Instead of letting the disagreement affect the project, I organized a whiteboarding session where both could present their ideas. We evaluated the pros and cons objectively and ultimately created a hybrid solution that incorporated the strengths of both approaches.\n\nThis collaborative approach not only resolved the immediate conflict but also established a precedent for how we would handle technical disagreements in the future.",
    categoryPath: ['Professional Development', 'Communication Skills'],
  },
  {
    id: 'q9',
    question:
      'What is the difference between var, let, and const in JavaScript?',
    answer:
      "In JavaScript, `var`, `let`, and `const` are used for variable declarations, but they have important differences:\n\n**var**:\n- Function-scoped or globally-scoped, not block-scoped\n- Can be redeclared and updated\n- Hoisted to the top of its scope and initialized with undefined\n- Example: `var x = 10;`\n\n**let**:\n- Block-scoped (available only within the block it's defined in)\n- Can be updated but not redeclared in the same scope\n- Hoisted to the top of its block but not initialized (temporal dead zone)\n- Example: `let y = 20;`\n\n**const**:\n- Block-scoped like let\n- Cannot be updated or redeclared\n- Must be initialized at declaration\n- For objects and arrays, the reference cannot change, but properties/elements can be modified\n- Example: `const z = 30;`\n\nBest practices:\n- Use `const` by default for variables that won't be reassigned\n- Use `let` when you need to reassign variables\n- Avoid `var` in modern JavaScript code\n\nExample showing the differences:\n```javascript\n// var example - function scoped\nfunction varExample() {\n  if (true) {\n    var x = 10;\n  }\n  console.log(x); // 10 - x is accessible outside the if block\n}\n\n// let example - block scoped\nfunction letExample() {\n  if (true) {\n    let y = 20;\n  }\n  // console.log(y); // ReferenceError: y is not defined\n}\n\n// const example - block scoped and cannot be reassigned\nfunction constExample() {\n  const z = { value: 30 };\n  // z = { value: 40 }; // TypeError: Assignment to constant variable\n  z.value = 40; // This works because we're modifying a property, not the reference\n  console.log(z.value); // 40\n}\n```",
    categoryPath: ['Technical Skills', 'Programming', 'JavaScript'],
  },
  {
    id: 'q10',
    question: 'Describe your experience with Agile development methodologies',
    answer:
      "I have extensive experience with Agile development methodologies, particularly Scrum and Kanban frameworks. My experience includes:\n\n**Scrum Implementation**:\n- Participated in daily stand-ups to communicate progress and blockers\n- Worked in 2-week sprint cycles with planning, review, and retrospective meetings\n- Used story points for effort estimation and velocity tracking\n- Collaborated with Product Owners to refine the backlog and prioritize features\n\n**Kanban Practices**:\n- Used visual boards to track work items through different stages\n- Applied WIP (Work In Progress) limits to prevent bottlenecks\n- Implemented continuous delivery with smaller, more frequent releases\n\n**Tools and Techniques**:\n- Proficient with JIRA, Trello, and Azure DevOps for tracking\n- Experience with user story mapping and acceptance criteria definition\n- Practiced test-driven development (TDD) and continuous integration\n\n**Results and Benefits**:\n- Reduced time-to-market for new features by 30%\n- Improved team collaboration and transparency\n- Enhanced ability to adapt to changing requirements\n- Better alignment between development efforts and business goals\n\nI've found that Agile methodologies, when implemented properly, significantly improve team productivity and product quality while maintaining flexibility to respond to changing business needs.",
    categoryPath: ['Professional Development', 'Project Management'],
  },
];
