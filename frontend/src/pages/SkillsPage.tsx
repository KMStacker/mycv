import { useState, useEffect, JSX } from 'react'
import axios from 'axios'

export interface Skill {
  id: number
  name: string
  level: string
  usedOn: string
}

const SkillsPage = (): JSX.Element => {
  const [skills, setSkills] = useState<Skill[]>([])
  const [currentIndex, setCurrentIndex] = useState<number>(0)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get<Skill[]>('/api/skills')
        setSkills(response.data)
      } catch (error) {
        console.error(error)
      }
    }
    void fetchSkills()
  }, [])

  const handleNext = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % skills.length)
  }

  const handlePrevious = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + skills.length) % skills.length)
  }

  if (skills.length === 0) {
    return (
      <div className="content-window showcase-container">
        <h1 className="showcase-header">Skills Showcase</h1>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>No skills found.</p>
      </div>
    )
  }

  const currentSkill = skills[currentIndex]

  return (
    <div className="content-window showcase-container">
      <h1 className="showcase-header">Skills Showcase</h1>

      <div className="showcase-layout">
        <div className="showcase-sidebar">
          {skills.map((skill, index) => (
            <button
              key={skill.id}
              className={`showcase-sidebar-item ${currentIndex === index ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
            >
              {skill.name}
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

            <div
              key={currentSkill.id}
              className="animated-slide-card showcase-card"
              style={{ justifyContent: 'center', boxSizing: 'border-box' }}
            >
              <h3 className="showcase-title">{currentSkill.name}</h3>
              <p
                style={{
                  fontSize: '1rem',
                  color: '#f1f5f9',
                  lineHeight: '1.6',
                  marginTop: '1rem',
                  marginBottom: 0
                }}
              >
                <strong className="showcase-tech-label">Level:</strong> {currentSkill.level}
              </p>
              <p
                style={{
                  fontSize: '1rem',
                  color: '#f1f5f9',
                  lineHeight: '1.6',
                  marginTop: '0.25rem',
                  marginBottom: '1rem'
                }}
              >
                <strong className="showcase-tech-label">Used on:</strong> {currentSkill.usedOn}
              </p>
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
            {skills.map((_, index) => (
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

export default SkillsPage
