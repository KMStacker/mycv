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
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await axios.get<Skill[]>('/api/skills')
        setSkills(response.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    void fetchSkills()
  }, [])

  if (loading) {
    return (
      <div className="content-window showcase-container">
        <h1 className="showcase-header">Skills Showcase</h1>
        <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading skills...</p>
      </div>
    )
  }
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
            <button className="button showcase-nav-btn" onClick={handlePrevious}>
              &larr;
            </button>

            <div key={currentSkill.id} className="animated-slide-card showcase-card">
              <div>
                <h3 className="showcase-title">{currentSkill.name}</h3>
                <p className="showcase-tech">
                  <strong className="showcase-tech-label">Level:</strong> {currentSkill.level}
                </p>
                <p className="showcase-tech">
                  <strong className="showcase-tech-label">Used on:</strong> {currentSkill.usedOn}
                </p>
              </div>
            </div>

            <button className="button showcase-nav-btn" onClick={handleNext}>
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
