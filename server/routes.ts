import type { Express, Request, Response } from 'express';
import { createServer, type Server } from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
// Temporarily commenting out MongoDB connection
// import connectDB from './config/db';
import { setupAuth } from './auth';
import { db } from './db';
import { careers, mentors, assessments, modules, users } from '@shared/schema';

// Load environment variables
dotenv.config();

export async function registerRoutes(app: Express): Promise<Server> {
  // Temporarily skip MongoDB connection to avoid timeout
  // await connectDB();
  console.log('Setting up application routes...');

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: false // Disable for development
  }));
  
  // CORS for cross-origin requests (mobile app)
  app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
  }));

  // Setup session storage and authentication
  // This also adds auth routes (/api/auth/login, /api/auth/register, /api/auth/logout, /api/users/profile)
  setupAuth(app);
  
  // Users endpoint
  app.get('/api/users', async (req: Request, res: Response) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        return res.status(401).json({ message: 'Not authenticated' });
      }
      
      const allUsers = await db.select({
        id: users.id,
        username: users.username,
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName,
        profilePicture: users.profilePicture
      }).from(users);
      
      res.json(allUsers);
    } catch (error) {
      console.error('Error getting users:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  });
  
  // Career paths endpoint
  app.get('/api/careers', async (req: Request, res: Response) => {
    try {
      // Try to get from database first
      const dbCareers = await db.select().from(careers).limit(10);
      
      if (dbCareers && dbCareers.length > 0) {
        return res.json(dbCareers);
      }
      
      // Fallback to demo data
      res.json([
        { 
          id: 1, 
          title: 'Full Stack Developer', 
          description: 'Build web applications from front to back',
          requirements: ['JavaScript', 'React', 'Node.js', 'SQL'],
          salaryMin: 80000,
          salaryMax: 150000,
          salaryCurrency: 'USD',
          skills: ['JavaScript', 'React', 'Node.js', 'SQL', 'Git'],
          demand: 'High',
          growthRate: 15,
          categories: ['Web Development', 'Software Engineering']
        },
        { 
          id: 2, 
          title: 'Data Scientist', 
          description: 'Analyze and interpret complex data',
          requirements: ['Python', 'R', 'Statistics', 'Machine Learning'],
          salaryMin: 90000,
          salaryMax: 160000,
          salaryCurrency: 'USD',
          skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Statistics'],
          demand: 'High',
          growthRate: 20,
          categories: ['Data Science', 'AI']
        },
        { 
          id: 3, 
          title: 'DevOps Engineer', 
          description: 'Combine development and operations',
          requirements: ['Linux', 'AWS', 'CI/CD', 'Docker'],
          salaryMin: 85000,
          salaryMax: 145000,
          salaryCurrency: 'USD',
          skills: ['Linux', 'AWS', 'Docker', 'Kubernetes', 'CI/CD'],
          demand: 'Medium',
          growthRate: 18,
          categories: ['Cloud', 'Infrastructure']
        }
      ]);
    } catch (error) {
      console.error('Error getting careers:', error);
      // Fallback to demo data on error
      res.json([
        { 
          id: 1, 
          title: 'Full Stack Developer', 
          description: 'Build web applications from front to back',
          requirements: ['JavaScript', 'React', 'Node.js', 'SQL'],
          salaryMin: 80000,
          salaryMax: 150000,
          salaryCurrency: 'USD',
          skills: ['JavaScript', 'React', 'Node.js', 'SQL', 'Git'],
          demand: 'High',
          growthRate: 15,
          categories: ['Web Development', 'Software Engineering']
        },
        { 
          id: 2, 
          title: 'Data Scientist', 
          description: 'Analyze and interpret complex data',
          requirements: ['Python', 'R', 'Statistics', 'Machine Learning'],
          salaryMin: 90000,
          salaryMax: 160000,
          salaryCurrency: 'USD',
          skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Statistics'],
          demand: 'High',
          growthRate: 20,
          categories: ['Data Science', 'AI']
        }
      ]);
    }
  });

  // Career path detail
  app.get('/api/careers/:id', (req: Request, res: Response) => {
    const careerPath = {
      id: parseInt(req.params.id),
      title: req.params.id === '1' ? 'Full Stack Developer' : 'Data Scientist',
      description: req.params.id === '1' 
        ? 'Full Stack Developers create web applications from front to back, handling both client-side and server-side development.' 
        : 'Data Scientists analyze and interpret complex data to help organizations make better decisions.',
      requirements: req.params.id === '1' 
        ? ['JavaScript', 'React', 'Node.js', 'SQL'] 
        : ['Python', 'R', 'Statistics', 'Machine Learning'],
      salaryMin: req.params.id === '1' ? 80000 : 90000,
      salaryMax: req.params.id === '1' ? 150000 : 160000,
      salaryCurrency: 'USD',
      skills: req.params.id === '1' 
        ? ['JavaScript', 'React', 'Node.js', 'SQL', 'Git'] 
        : ['Python', 'R', 'SQL', 'Machine Learning', 'Statistics'],
      demand: 'High',
      growthRate: req.params.id === '1' ? 15 : 20,
      categories: req.params.id === '1' 
        ? ['Web Development', 'Software Engineering'] 
        : ['Data Science', 'AI']
    };
    
    res.json(careerPath);
  });

  // Mentors endpoint
  app.get('/api/mentors', async (req: Request, res: Response) => {
    try {
      // Try to get from database first
      const dbMentors = await db.select().from(mentors).limit(10);
      
      if (dbMentors && dbMentors.length > 0) {
        return res.json(dbMentors);
      }
      
      // Fallback to demo data
      res.json([
        { 
          id: 1, 
          name: 'John Doe', 
          title: 'Senior Developer', 
          company: 'TechCorp',
          bio: 'Senior developer with 10+ years of experience in web development',
          expertise: ['JavaScript', 'React', 'Node.js'],
          yearsOfExperience: 10,
          availability: [
            { day: 'Monday', startTime: '10:00', endTime: '12:00' },
            { day: 'Wednesday', startTime: '14:00', endTime: '16:00' }
          ]
        },
        { 
          id: 2, 
          name: 'Jane Smith', 
          title: 'Data Science Lead', 
          company: 'DataTech',
          bio: 'Data science professional specializing in machine learning and AI',
          expertise: ['Python', 'Machine Learning', 'AI'],
          yearsOfExperience: 8,
          availability: [
            { day: 'Tuesday', startTime: '11:00', endTime: '13:00' },
            { day: 'Thursday', startTime: '15:00', endTime: '17:00' }
          ]
        }
      ]);
    } catch (error) {
      console.error('Error getting mentors:', error);
      // Fallback to demo data on error
      res.json([
        { 
          id: 1, 
          name: 'John Doe', 
          title: 'Senior Developer', 
          company: 'TechCorp',
          bio: 'Senior developer with 10+ years of experience in web development',
          expertise: ['JavaScript', 'React', 'Node.js'],
          yearsOfExperience: 10
        },
        { 
          id: 2, 
          name: 'Jane Smith', 
          title: 'Data Science Lead', 
          company: 'DataTech',
          bio: 'Data science professional specializing in machine learning and AI',
          expertise: ['Python', 'Machine Learning', 'AI'],
          yearsOfExperience: 8
        }
      ]);
    }
  });

  // Mentor detail
  app.get('/api/mentors/:id', (req: Request, res: Response) => {
    const mentor = {
      id: parseInt(req.params.id),
      name: req.params.id === '1' ? 'John Doe' : 'Jane Smith', 
      title: req.params.id === '1' ? 'Senior Developer' : 'Data Science Lead', 
      company: req.params.id === '1' ? 'TechCorp' : 'DataTech',
      bio: req.params.id === '1' 
        ? 'Senior developer with 10+ years of experience in web development' 
        : 'Data science professional specializing in machine learning and AI',
      expertise: req.params.id === '1' 
        ? ['JavaScript', 'React', 'Node.js'] 
        : ['Python', 'Machine Learning', 'AI'],
      yearsOfExperience: req.params.id === '1' ? 10 : 8,
      availability: req.params.id === '1' 
        ? [
            { day: 'Monday', startTime: '10:00', endTime: '12:00' },
            { day: 'Wednesday', startTime: '14:00', endTime: '16:00' }
          ] 
        : [
            { day: 'Tuesday', startTime: '11:00', endTime: '13:00' },
            { day: 'Thursday', startTime: '15:00', endTime: '17:00' }
          ]
    };
    
    res.json(mentor);
  });

  // Assessments endpoint
  app.get('/api/assessments', async (req: Request, res: Response) => {
    try {
      // Try to get from database first
      const dbAssessments = await db.select().from(assessments).limit(10);
      
      if (dbAssessments && dbAssessments.length > 0) {
        return res.json(dbAssessments);
      }
      
      // Fallback to demo data
      res.json([
        { 
          id: 1, 
          title: 'JavaScript Skills', 
          description: 'Test your JavaScript knowledge',
          timeLimit: 30, // 30 minutes
          questions: [
            {
              id: '1',
              text: 'What is a closure in JavaScript?',
              options: [
                { id: 'a', text: 'A function that has access to variables in its outer scope' },
                { id: 'b', text: 'A method to close browser windows' },
                { id: 'c', text: 'A way to end JavaScript execution' },
                { id: 'd', text: 'A data structure for storing key-value pairs' }
              ],
              type: 'multiple-choice'
            },
            {
              id: '2',
              text: 'What does the "=== operator do?',
              options: [
                { id: 'a', text: 'Assigns a value to a variable' },
                { id: 'b', text: 'Compares values and types, returning true if both match' },
                { id: 'c', text: 'Compares only values, not types' },
                { id: 'd', text: 'Creates a new variable' }
              ],
              type: 'multiple-choice'
            }
          ],
          category: 'Web Development',
          difficulty: 'intermediate'
        },
        { 
          id: 2, 
          title: 'Data Analysis', 
          description: 'Evaluate your data analysis capabilities',
          timeLimit: 45, // 45 minutes
          questions: [
            {
              id: '1',
              text: 'Which of these is not a common Python library for data analysis?',
              options: [
                { id: 'a', text: 'Pandas' },
                { id: 'b', text: 'NumPy' },
                { id: 'c', text: 'ReactPy' },
                { id: 'd', text: 'Matplotlib' }
              ],
              type: 'multiple-choice'
            },
            {
              id: '2',
              text: 'What does SQL stand for?',
              options: [
                { id: 'a', text: 'Structured Query Language' },
                { id: 'b', text: 'Simple Question Language' },
                { id: 'c', text: 'System Quality Level' },
                { id: 'd', text: 'Sequential Query Logic' }
              ],
              type: 'multiple-choice'
            }
          ],
          category: 'Data Science',
          difficulty: 'beginner'
        }
      ]);
    } catch (error) {
      console.error('Error getting assessments:', error);
      // Fallback to demo data on error
      res.json([
        { id: 1, title: 'JavaScript Skills', description: 'Test your JavaScript knowledge' },
        { id: 2, title: 'Data Analysis', description: 'Evaluate your data analysis capabilities' }
      ]);
    }
  });

  // Assessment detail
  app.get('/api/assessments/:id', (req: Request, res: Response) => {
    const assessment = {
      id: parseInt(req.params.id),
      title: req.params.id === '1' ? 'JavaScript Skills' : 'Data Analysis',
      description: req.params.id === '1' 
        ? 'Test your JavaScript knowledge' 
        : 'Evaluate your data analysis capabilities',
      timeLimit: req.params.id === '1' ? 30 : 45, // minutes
      questions: req.params.id === '1' 
        ? [
            {
              id: '1',
              text: 'What is a closure in JavaScript?',
              options: [
                { id: 'a', text: 'A function that has access to variables in its outer scope' },
                { id: 'b', text: 'A method to close browser windows' },
                { id: 'c', text: 'A way to end JavaScript execution' },
                { id: 'd', text: 'A data structure for storing key-value pairs' }
              ],
              type: 'multiple-choice'
            },
            {
              id: '2',
              text: 'What does the "=== operator do?',
              options: [
                { id: 'a', text: 'Assigns a value to a variable' },
                { id: 'b', text: 'Compares values and types, returning true if both match' },
                { id: 'c', text: 'Compares only values, not types' },
                { id: 'd', text: 'Creates a new variable' }
              ],
              type: 'multiple-choice'
            }
          ]
        : [
            {
              id: '1',
              text: 'Which of these is not a common Python library for data analysis?',
              options: [
                { id: 'a', text: 'Pandas' },
                { id: 'b', text: 'NumPy' },
                { id: 'c', text: 'ReactPy' },
                { id: 'd', text: 'Matplotlib' }
              ],
              type: 'multiple-choice'
            },
            {
              id: '2',
              text: 'What does SQL stand for?',
              options: [
                { id: 'a', text: 'Structured Query Language' },
                { id: 'b', text: 'Simple Question Language' },
                { id: 'c', text: 'System Quality Level' },
                { id: 'd', text: 'Sequential Query Logic' }
              ],
              type: 'multiple-choice'
            }
          ],
      category: req.params.id === '1' ? 'Web Development' : 'Data Science',
      difficulty: req.params.id === '1' ? 'intermediate' : 'beginner'
    };
    
    res.json(assessment);
  });

  // Learning modules endpoint
  app.get('/api/modules', async (req: Request, res: Response) => {
    try {
      // Try to get from database first
      const dbModules = await db.select().from(modules).limit(10);
      
      if (dbModules && dbModules.length > 0) {
        return res.json(dbModules);
      }
      
      // Fallback to demo data
      res.json([
        { 
          id: 1, 
          title: 'JavaScript Fundamentals', 
          description: 'Learn the basics of JavaScript',
          content: 'Introduction to JavaScript, variables, functions, and objects',
          estimatedTime: 120, // 2 hours
          category: 'Web Development',
          prerequisites: [],
          resources: [
            { title: 'MDN JavaScript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', type: 'article' },
            { title: 'JavaScript Crash Course', url: 'https://www.youtube.com/watch?v=hdI2bqOjy3c', type: 'video' }
          ]
        },
        { 
          id: 2, 
          title: 'Python for Data Science', 
          description: 'Master Python for data analysis',
          content: 'Introduction to Python, pandas, NumPy, and data visualization',
          estimatedTime: 180, // 3 hours
          category: 'Data Science',
          prerequisites: [],
          resources: [
            { title: 'Python Data Science Handbook', url: 'https://jakevdp.github.io/PythonDataScienceHandbook/', type: 'ebook' },
            { title: 'Python for Data Science Tutorial', url: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI', type: 'video' }
          ]
        }
      ]);
    } catch (error) {
      console.error('Error getting modules:', error);
      // Fallback to demo data on error
      res.json([
        { id: 1, title: 'JavaScript Fundamentals', description: 'Learn the basics of JavaScript' },
        { id: 2, title: 'Python for Data Science', description: 'Master Python for data analysis' }
      ]);
    }
  });

  // Module detail
  app.get('/api/modules/:id', (req: Request, res: Response) => {
    const module = {
      id: parseInt(req.params.id),
      title: req.params.id === '1' ? 'JavaScript Fundamentals' : 'Python for Data Science',
      description: req.params.id === '1' 
        ? 'Learn the basics of JavaScript' 
        : 'Master Python for data analysis',
      content: req.params.id === '1'
        ? `
        <h1>JavaScript Fundamentals</h1>
        <p>JavaScript is a programming language that powers the web. It's essential for web developers to understand it.</p>
        
        <h2>Variables</h2>
        <p>Variables in JavaScript are declared using \`let\`, \`const\`, or \`var\`:</p>
        <pre>
        let name = 'John';
        const age = 30;
        var isStudent = true;
        </pre>
        
        <h2>Functions</h2>
        <p>Functions in JavaScript can be defined in multiple ways:</p>
        <pre>
        // Function declaration
        function greet(name) {
          return 'Hello, ' + name + '!';
        }
        
        // Arrow function
        const greet = (name) => {
          return 'Hello, ' + name + '!';
        };
        </pre>
        
        <h2>Objects</h2>
        <p>Objects in JavaScript are collections of key-value pairs:</p>
        <pre>
        const person = {
          name: 'John',
          age: 30,
          greet: function() {
            return 'Hello, ' + this.name + '!';
          }
        };
        </pre>
        `
        : `
        <h1>Python for Data Science</h1>
        <p>Python is one of the most popular languages for data science and analysis.</p>
        
        <h2>Pandas</h2>
        <p>Pandas is a powerful library for data manipulation and analysis:</p>
        <pre>
        import pandas as pd
        
        # Create a dataframe
        df = pd.DataFrame({
            'Name': ['John', 'Jane', 'Bob'],
            'Age': [25, 30, 35],
            'City': ['New York', 'London', 'Paris']
        })
        
        # Basic operations
        print(df.describe())
        print(df.sort_values('Age'))
        </pre>
        
        <h2>NumPy</h2>
        <p>NumPy is the fundamental package for scientific computing in Python:</p>
        <pre>
        import numpy as np
        
        # Create arrays
        arr = np.array([1, 2, 3, 4, 5])
        
        # Basic operations
        print(arr.mean())
        print(arr.std())
        print(arr * 2)
        </pre>
        
        <h2>Data Visualization</h2>
        <p>Matplotlib and Seaborn are popular libraries for data visualization:</p>
        <pre>
        import matplotlib.pyplot as plt
        import seaborn as sns
        
        # Create a simple plot
        x = np.linspace(0, 10, 100)
        y = np.sin(x)
        
        plt.plot(x, y)
        plt.title('Sine Wave')
        plt.xlabel('x')
        plt.ylabel('sin(x)')
        plt.show()
        </pre>
        `,
      estimatedTime: req.params.id === '1' ? 120 : 180, // minutes
      category: req.params.id === '1' ? 'Web Development' : 'Data Science',
      prerequisites: [],
      resources: req.params.id === '1'
        ? [
            { title: 'MDN JavaScript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', type: 'article' },
            { title: 'JavaScript Crash Course', url: 'https://www.youtube.com/watch?v=hdI2bqOjy3c', type: 'video' }
          ]
        : [
            { title: 'Python Data Science Handbook', url: 'https://jakevdp.github.io/PythonDataScienceHandbook/', type: 'ebook' },
            { title: 'Python for Data Science Tutorial', url: 'https://www.youtube.com/watch?v=LHBE6Q9XlzI', type: 'video' }
          ]
    };
    
    res.json(module);
  });
  
  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'ok' });
  });
  
  // Error handling for non-existent API routes
  app.use('/api/*', (req: Request, res: Response) => {
    res.status(404).json({ message: 'API endpoint not found' });
  });

  const httpServer = createServer(app);

  return httpServer;
}
