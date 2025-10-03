export interface Project {
  title: string;
  client: string;
  duration: string;
  description: string;
  techStack: string[];
  responsibilities: string[];
}

export interface AuthorInfo {
  name: string;
  title: string;
  company: string;
  experience: string;
  summary_one: string;
  summary_two: string;
  education: {
    degree: string;
    field: string;
    university: string;
    location: string;
  };
  skills: {
    programming: string[];
    webTechnologies: string[];
    tools: string[];
  };
  projects: Project[];
  email: string;
}

export const authorInfo: AuthorInfo = {
  name: 'Rohit Gupta',
  title: 'Staff Engineer',
  company: 'Nagarro',
  email: 'rohitgupta887@gmail.com',
  experience: '9+ years',
  summary_one:
    'The author is, a Staff Engineer at an MNC with over 10 years of experience in developing application software. He specializes in JavaScript, React.js, Redux, Node.js, Angular, Express, HTML, SCSS (CSS), Jest, MySQL, and AWS, with domain knowledge in e-commerce, media, and finance.',
  summary_two: ' He has extensive exposure to Agile methodologies and currently works with a tech stack that includes React.js, Node.js, Express, REST, GraphQL, SSO (Single Sign-On), Auth0, Jira, and Bitbucket.',
  education: {
    degree: 'Bachelor of Technology',
    field: 'Electronics and Communications',
    university: 'Guru Jambheshwar University of Science and Technology',
    location: 'Hisar, Haryana, India',
  },
  skills: {
    programming: ['JavaScript', 'Node.js', 'Express', 'React.js', 'Angular'],
    webTechnologies: ['HTML', 'CSS/SCSS', 'REST', 'JSON', 'GraphQL'],
    tools: [
      'Jenkins',
      'CircleCI',
      'Kubernetes (K8s)',
      'JIRA',
      'VS Code',
      'Bitbucket',
      'GitHub',
      'Postman',
      'AWS (Lambda, CloudWatch, CloudSearch, IoT)',
      'Auth0',
      'SSO (Ping Federate)',
    ],
  },
  projects: [
    {
      title: 'Leading E-commerce in Middle East',
      client: 'Confidential',
      duration: 'Feb 2021 - Sep 2024',
      description: 'He led the development of a marketplace for registered sellers.',
      techStack: [
        'React.js',
        'Node.js',
        'Express',
        'Material-UI',
        'REST',
        'GraphQL',
        'Zoho',
        'Strapi (CMS)',
        'Kubernetes',
        'Azure',
      ],
      responsibilities: [
        'Handling end-to-end development using React.js, Material-UI, Node.js, REST, and GraphQL APIs.',
        'Implemented user registration module with document uploads (e.g., company letterhead, trade license).',
        'Implemented Auth0 authentication and role-based access management.',
        'Implemented SSO for the business team.',
        'Developed orders, shops, support, help/FAQ, users, and reports modules.',
        'Coordinated sprint releases and DevOps transitions (e.g., CircleCI to Kubernetes).',
        'Mentored junior developers and conducted code reviews.',
      ],
    },
    {
      title: 'Leading American Office Supply Holding Company',
      client: 'Confidential',
      duration: 'Sep 2019 - Feb 2021',
      description:
        'He contributed to migrating the client’s e-commerce frontend from Angular to React.js with a user-friendly UI.',
      techStack: ['React.js', 'Redux', 'CircleCI', 'JavaScript', 'HTML5', 'CSS3', 'Jest'],
      responsibilities: [
        'Handled end-to-end development using React.js.',
        'Migrated flyers, copies, and banners modules from Angular to React.js.',
        'Wrote test cases maintaining 90% coverage.',
        'Managed releases and coordinated with onshore teams.',
        'Performed story grooming, estimation, and peer code reviews.',
      ],
    },
    {
      title: 'American Video Streaming Company',
      client: 'Confidential',
      duration: 'Feb 2018 - Sep 2019',
      description:
        'He worked on a media streaming app for web, Tizen OS, LG OS, and Xbox platforms.',
      techStack: [
        'React.js',
        'Redux Thunk',
        'Node.js',
        'AWS (Lambda, CloudWatch, CloudSearch, IoT)',
        'Alexa Video Skill',
        'Google Actions',
        'Jenkins',
      ],
      responsibilities: [
        'Developed an Alexa Video Skill as an individual contributor.',
        'Handled end-to-end development and sprint releases.',
        'Integrated Google Actions and implemented Countly and Adobe Media Analytics.',
        'Coordinated with onshore teams for story estimation and grooming.',
      ],
    },
    {
      title: 'XWAPP (Startup Remittance Platform)',
      client: 'Startup',
      duration: 'Feb 2015 - Feb 2018',
      description: 'He built a web portal for a remittance platform.',
      techStack: ['Angular'],
      responsibilities: [
        'Implemented user registration and remittance modules.',
        'Developed JWT-based authentication.',
        'Gathered requirements and performed story estimation.',
      ],
    },
  ],
};