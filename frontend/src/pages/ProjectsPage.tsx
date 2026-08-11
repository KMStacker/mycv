import { useState, useEffect, JSX } from 'react'
import axios from 'axios'

export interface Project {
  id: number
  title: string
  description: string
  technologies: string
  githubUrl: string
}

const ProjectsPage = (): JSX.Element => {
  const [projects, setProjects] = useState<Project[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get<Project[]>('/api/projects')
        setProjects(response.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    void fetchProjects()
  }, [])

  if (loading) {
    return (
      <div className="content-window showcase-container">
        <h1 className="showcase-header">Projects Showcase</h1>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading projects...</p>
      </div>
    )
  }

  const handleNext = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % projects.length)
  }

  const handlePrevious = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + projects.length) % projects.length)
  }

  if (projects.length === 0) {
    return (
      <div className="content-window showcase-container">
        <h1 className="showcase-header">Projects Showcase</h1>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>No projects found.</p>
      </div>
    )
  }

  const currentProject = projects[currentIndex]

  return (
    <div className="content-window showcase-container">
      <h1 className="showcase-header">Projects Showcase</h1>

      <div className="showcase-layout">
        <div className="showcase-sidebar">
          {projects.map((project, index) => (
            <button
              key={project.id}
              className={`showcase-sidebar-item ${currentIndex === index ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            >
              {project.title}
            </button>
          ))}
        </div>

        <div className="showcase-main">
          <div className="showcase-nav-wrapper">
            <button
              className="button"
              onClick={handlePrevious}
              style={{ padding: '12px 16px', fontSize: '1.2rem' }}
            >
              &larr;
            </button>

            <div key={currentProject.id} className="animated-slide-card showcase-card">
              <div>
                <h3 className="showcase-title">{currentProject.title}</h3>
                <p className="showcase-description">{currentProject.description}</p>
                <p className="showcase-tech">
                  <strong className="showcase-tech-label">Technologies:</strong>{' '}
                  {currentProject.technologies}
                </p>
              </div>

              <div>
                {currentProject.githubUrl && (
                  <a
                    href={currentProject.githubUrl}
                    className="button"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'inline-block', marginTop: '10px', marginBottom: '5px' }}
                  >
                    View in GitHub
                  </a>
                )}
              </div>
            </div>

            <button
              className="button"
              onClick={handleNext}
              style={{ padding: '12px 16px', fontSize: '1.2rem' }}
            >
              &rarr;
            </button>
          </div>

          <div className="showcase-nav-lists">
            {projects.map((_, index) => (
              <button
                key={index}
                className={`showcase-nav-list ${currentIndex === index ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectsPage
