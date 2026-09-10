import dotenv from 'dotenv'
dotenv.config()
import { connectDb, sequelize } from './utils/db'
import Project from './models/project'
import Skill from './models/skill'
import Profile from './models/profile'
import * as logger from './utils/logger'

const seedDatabase = async (): Promise<void> => {
  try {
    logger.info('Connecting to db for seeding...')
    await connectDb()
    logger.info('Connected to db!')

    logger.info('Checking for existing profile...')
    const profileCount = await Profile.count()
    if (profileCount === 0) {
      logger.info('Seeding initial profile...')

      await Profile.create({
        name: 'Kyösti Männistö',
        email: 'kmannisto@hotmail.com',
        phone: '+358 50 5179151',
        aboutText: 'Software developer with a Master of Laws degree.',
        location: 'Espoo, Finland',
        githubUrl: 'https://github.com/KMStacker',
        status: 'Open for Software Engineering Opportunities'
      })
      logger.info('Profile seeded successfully.')
    } else {
      logger.info('Profile already exists. Skipping seed.')
    }
    logger.info('Checking for existing projects...')
    const projectCount = await Project.count()
    if (projectCount === 0) {
      logger.info('Seeding initial projects...')
      await Project.bulkCreate([
        {
          title: 'MyCV Fullstack Application',
          description:
            'Modern fullstack CV and portfolio web application built with React, TypeScript, Node.js, Vite, and PostgreSQL. Includes Material UI components, containerized Docker deployment, and automated Vitest tests.',
          technologies: 'React, TypeScript, Node.js, Express, PostgreSQL, Vite, Docker, Vitest, Material UI',
          githubUrl: 'https://github.com/KMStacker/mycv'
        },
        {
          title: 'Service Keepalive',
          description:
            'Lightweight Go worker running on GitHub Actions to keep free-tier cloud services active.',
          technologies: 'Go, GitHub Actions, CI/CD',
          githubUrl: 'https://github.com/KMStacker/service-keepalive'
        },
        {
          title: 'Feature Flag Management System',
          description:
            'A scalable feature flag platform group project developed for Elisa Oyj, highlighting backend microservice architecture and OpenFeature SDK integrations.',
          technologies: 'Go, React, PostgreSQL, Docker, OpenShift, OpenFeature',
          githubUrl: 'https://github.com/KMStacker/feature-flag-management-system'
        },
        {
          title: 'Five-in-a-Row (TypeScript)',
          description:
            'A TypeScript version of a Five-in-a-Row game, built for the MyCV web app and based on an original Python university project.',
          technologies: 'TypeScript, React, Vite, Vitest',
          githubUrl: 'https://github.com/KMStacker/xoxo-game-typescript'
        },
        {
          title: 'Spot Price Optimizer',
          description:
            'Electricity spot price optimizer and ETL pipeline built with FastAPI, PostgreSQL, Pandas, and React.',
          technologies: 'Python, FastAPI, Pandas, PostgreSQL, React, TypeScript',
          githubUrl: 'https://github.com/KMStacker/spot-price-optimizer'
        },
        {
          title: 'Full Stack Open Project',
          description:
            'Source code and documentation for the course project completed for the Full Stack Open course at the University of Helsinki.',
          technologies: 'TypeScript, React, Node.js, Express, MongoDB, REST API',
          githubUrl: 'https://github.com/KMStacker/fullstack-project'
        },
        {
          title: 'Local Automation Scripts',
          description:
            'A collection of custom automation and utility scripts for local workflow optimization, file processing, and environment maintenance.',
          technologies: 'Shell, Bash, Python, Linux',
          githubUrl: 'https://github.com/KMStacker/scripts'
        },
        {
          title: 'Cyber Security Base Project',
          description:
            'Course project demonstrating web application vulnerability discovery and mitigation for the University of Helsinki Cyber Security Base course.',
          technologies: 'Python, Django, Web Security, OWASP',
          githubUrl: 'https://github.com/KMStacker/csb-project'
        },
        {
          title: 'Party Planner App',
          description:
            'A web application for organizing events, managing RSVPs, and tracking user availability.',
          technologies: 'Python, Flask, SQLite, HTML, CSS',
          githubUrl: 'https://github.com/KMStacker/party-planner'
        },
        {
          title: 'Five-in-a-Row AI (Tiralabra)',
          description:
            'A Python implementation of Five-in-a-Row powered by Minimax and Alpha-Beta pruning, developed for the Data Structures and Algorithms lab course.',
          technologies: 'Python, Algorithms, Minimax, Alpha-Beta Pruning, Pytest',
          githubUrl: 'https://github.com/KMStacker/Harjoitustyo_tiralabra_ristinolla'
        },
        {
          title: 'Interactive Memory Card Game',
          description:
            'Python-based interactive memory card game managed with Poetry and Invoke, developed as a software engineering course project.',
          technologies: 'Python, Pygame, Poetry, Invoke, Unittest',
          githubUrl: 'https://github.com/KMStacker/ot-harjoitustyo'
        }
      ])
      logger.info('Projects seeded successfully.')
    } else {
      logger.info('Projects already exist. Skipping seed.')
    }

    logger.info('Checking for existing skills...')
    const skillCount = await Skill.count()
    if (skillCount === 0) {
      logger.info('Seeding initial skills...')
      await Skill.bulkCreate([
        {
          name: 'TypeScript',
          level: 'Advanced',
          usedOn: 'Frontend & Backend'
        },
        {
          name: 'JavaScript',
          level: 'Advanced',
          usedOn: 'Frontend & Backend'
        },
        {
          name: 'React',
          level: 'Advanced',
          usedOn: 'Frontend'
        },
        {
          name: 'Node.js',
          level: 'Advanced',
          usedOn: 'Backend'
        },
        {
          name: 'Express',
          level: 'Advanced',
          usedOn: 'Backend'
        },
        {
          name: 'Python',
          level: 'Advanced',
          usedOn: 'Backend & Data/Scripting'
        },
        {
          name: 'FastAPI',
          level: 'Intermediate',
          usedOn: 'Backend'
        },
        {
          name: 'Flask',
          level: 'Intermediate',
          usedOn: 'Backend'
        },
        {
          name: 'PostgreSQL',
          level: 'Advanced',
          usedOn: 'Database'
        },
        {
          name: 'MongoDB',
          level: 'Intermediate',
          usedOn: 'Database'
        },
        {
          name: 'SQLite',
          level: 'Intermediate',
          usedOn: 'Database'
        },
        {
          name: 'Golang',
          level: 'Intermediate',
          usedOn: 'Backend'
        },
        {
          name: 'Docker',
          level: 'Intermediate',
          usedOn: 'DevOps & Tooling'
        },
        {
          name: 'GitHub Actions',
          level: 'Intermediate',
          usedOn: 'CI/CD'
        },
        {
          name: 'Bash & Shell Scripting',
          level: 'Intermediate',
          usedOn: 'Tooling & Automation'
        },
        {
          name: 'Vite',
          level: 'Advanced',
          usedOn: 'Frontend Tooling'
        },
        {
          name: 'Vitest & Pytest',
          level: 'Intermediate',
          usedOn: 'Testing'
        },
        {
          name: 'Pandas',
          level: 'Intermediate',
          usedOn: 'Data Processing'
        }
      ])
      logger.info('Skills seeded successfully.')
    } else {
      logger.info('Skills already exist. Skipping seed.')
    }

    logger.info('Database seeding completed successfully!')
  } catch (error: any) {
    logger.error('Error seeding database:', error.message)
  } finally {
    logger.info('Closing db connection...')
    await sequelize.close()
    logger.info('Db connection closed!')
  }
}

void seedDatabase()
