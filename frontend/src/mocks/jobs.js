// Demo/fallback data — keeps the UI fully functional even if the backend
// is offline or a particular endpoint isn't implemented yet.
export const mockJobs = [
  {
    id: 'm1', companyName: 'Nimbus Cloud', role: 'Frontend Engineer (React)',
    location: 'Bengaluru, India', salaryPackage: '12-18 LPA', jobType: 'Full-time',
    experience: '1-3 yrs', remote: true, category: 'Engineering',
    logo: '🌩️', postedAt: '2026-07-20',
    description: 'Own the customer-facing dashboard used by 40k+ teams. You will work closely with design and backend to ship fast, accessible UI in React + TypeScript.',
    requirements: ['Strong React fundamentals', 'Experience with REST/GraphQL APIs', 'Eye for UI detail', 'Comfortable with Git workflows'],
    companyInfo: { about: 'Nimbus Cloud builds infrastructure tooling for modern engineering teams.', size: '201-500', founded: 2016, website: 'https://nimbuscloud.example.com' },
  },
  {
    id: 'm2', companyName: 'Vertex Analytics', role: 'Backend Engineer (Node.js)',
    location: 'Pune, India', salaryPackage: '10-16 LPA', jobType: 'Full-time',
    experience: '2-4 yrs', remote: false, category: 'Engineering',
    logo: '📊', postedAt: '2026-07-22',
    description: 'Design and scale APIs powering real-time analytics pipelines processing 2B+ events/day.',
    requirements: ['Node.js & Express', 'MongoDB or PostgreSQL', 'Understanding of message queues', 'API design experience'],
    companyInfo: { about: 'Vertex Analytics helps companies turn raw data into decisions.', size: '51-200', founded: 2019, website: 'https://vertexanalytics.example.com' },
  },
  {
    id: 'm3', companyName: 'Bloomly', role: 'Product Designer',
    location: 'Remote', salaryPackage: '8-14 LPA', jobType: 'Remote',
    experience: '0-2 yrs', remote: true, category: 'Design',
    logo: '🌸', postedAt: '2026-07-18',
    description: 'Craft delightful, accessible experiences for our consumer wellness app used by millions.',
    requirements: ['Portfolio with shipped products', 'Figma proficiency', 'User research basics', 'Systems thinking'],
    companyInfo: { about: 'Bloomly builds mindful habit-building tools.', size: '11-50', founded: 2021, website: 'https://bloomly.example.com' },
  },
  {
    id: 'm4', companyName: 'Ironclad Security', role: 'DevOps Engineer',
    location: 'Hyderabad, India', salaryPackage: '14-22 LPA', jobType: 'Full-time',
    experience: '3-6 yrs', remote: false, category: 'Engineering',
    logo: '🛡️', postedAt: '2026-07-15',
    description: 'Own CI/CD, observability and cloud infra across AWS multi-account setup for a security-first fintech.',
    requirements: ['AWS / Terraform', 'Kubernetes in production', 'CI/CD pipelines', 'On-call experience'],
    companyInfo: { about: 'Ironclad Security protects fintech companies from fraud.', size: '201-500', founded: 2015, website: 'https://ironcladsecurity.example.com' },
  },
  {
    id: 'm5', companyName: 'Marketly', role: 'Growth Marketing Intern',
    location: 'Lucknow, India', salaryPackage: '15k-25k/mo', jobType: 'Internship',
    experience: '0 yrs', remote: false, category: 'Marketing',
    logo: '📈', postedAt: '2026-07-25',
    description: 'Support campaign execution across paid, email and social channels for early-stage D2C brands.',
    requirements: ['Strong written communication', 'Basic analytics literacy', 'Currently pursuing a degree'],
    companyInfo: { about: 'Marketly is a growth studio for D2C startups.', size: '1-10', founded: 2023, website: 'https://marketly.example.com' },
  },
  {
    id: 'm6', companyName: 'Quanta Health', role: 'Data Scientist',
    location: 'Mumbai, India', salaryPackage: '16-24 LPA', jobType: 'Full-time',
    experience: '2-5 yrs', remote: true, category: 'Data',
    logo: '🧬', postedAt: '2026-07-12',
    description: 'Build predictive models supporting clinical decision-making across our partner hospital network.',
    requirements: ['Python (pandas, scikit-learn)', 'SQL', 'Statistics fundamentals', 'Healthcare data experience a plus'],
    companyInfo: { about: 'Quanta Health builds AI-assisted diagnostics tools.', size: '51-200', founded: 2018, website: 'https://quantahealth.example.com' },
  },
  {
    id: 'm7', companyName: 'Loopline', role: 'Part-time Content Writer',
    location: 'Remote', salaryPackage: '20k-30k/mo', jobType: 'Part-time',
    experience: '0-1 yrs', remote: true, category: 'Content',
    logo: '✍️', postedAt: '2026-07-27',
    description: 'Write clear, engaging technical content for developers evaluating our API platform.',
    requirements: ['Excellent English writing', 'Basic understanding of APIs', 'Portfolio of published work'],
    companyInfo: { about: 'Loopline is a developer-first API platform.', size: '11-50', founded: 2020, website: 'https://loopline.example.com' },
  },
  {
    id: 'm8', companyName: 'Sable Robotics', role: 'Embedded Systems Engineer',
    location: 'Chennai, India', salaryPackage: '13-20 LPA', jobType: 'Full-time',
    experience: '2-5 yrs', remote: false, category: 'Engineering',
    logo: '🤖', postedAt: '2026-07-10',
    description: 'Develop firmware for autonomous warehouse robots operating at scale in fulfilment centers.',
    requirements: ['C/C++', 'RTOS experience', 'Familiarity with sensor fusion', 'PCB debugging'],
    companyInfo: { about: 'Sable Robotics automates warehouse logistics.', size: '51-200', founded: 2017, website: 'https://sablerobotics.example.com' },
  },
]

export const categories = ['Engineering', 'Design', 'Data', 'Marketing', 'Content', 'Sales', 'Operations']
export const jobTypes = ['Full-time', 'Part-time', 'Internship', 'Remote']
export const experienceLevels = ['0 yrs', '0-2 yrs', '1-3 yrs', '2-4 yrs', '2-5 yrs', '3-6 yrs', '5+ yrs']
