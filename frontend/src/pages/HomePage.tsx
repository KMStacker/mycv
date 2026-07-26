import { useState, useEffect, JSX } from 'react'
import axios from 'axios'

interface User {
  username: string
  token: string
  role: 'USER' | 'ADMIN'
}

interface ProfileData {
  name: string
  email: string
  phone: string
  aboutText: string
  location: string
  githubUrl: string
  status: string
}

interface HomePageProps {
  user: User | null
  theme: 'nightsky' | 'golden' | 'rainbow'
  setTheme: (theme: 'nightsky' | 'golden' | 'rainbow') => void
}

const HomePage = ({ user, theme, setTheme }: HomePageProps): JSX.Element => {
  const [profile, setProfile] = useState<ProfileData | null>(null)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get<ProfileData>('/api/profile')
        setProfile(response.data)
      } catch (error) {
        console.error('Error fetching profile:', error)
      }
    }
    void fetchProfile()
  }, [])

  return (
    <div className="content-window showcase-container home-container">
      <h1 className="showcase-header">Welcome to My CV!</h1>

      <div className="home-layout">
        <div className="home-sidebar">
          <div className="info-box home-profile-card">
            <h3>About Me</h3>
            <p>{profile?.aboutText || 'No info yet...'}</p>
          </div>

          <div className="info-box home-contact-card">
            <h3>Contact Information</h3>
            <ul className="contact-list">
              {profile?.name && (
                <li>
                  <strong>Name:</strong> {profile.name}
                </li>
              )}
              {profile?.email && (
                <li>
                  <strong>Email:</strong> {profile.email}
                </li>
              )}
              {profile?.phone && (
                <li>
                  <strong>Phone:</strong> {profile.phone}
                </li>
              )}
              {profile?.location && (
                <li>
                  <strong>Location:</strong> {profile.location}
                </li>
              )}
              {profile?.githubUrl && (
                <li>
                  <strong>GitHub:</strong>{' '}
                  <a
                    href={profile.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-link"
                  >
                    GitHub Profile
                  </a>
                </li>
              )}
              {profile?.status && (
                <li>
                  <strong>Status:</strong> {profile.status}
                </li>
              )}
              {!profile && <li>No info yet...</li>}
            </ul>
          </div>
        </div>

        <div className="home-main">
          <div className="info-box" style={{ paddingBottom: 20 }}>
            <p>Here you will find dedicated showcases of my projects and technical skills.</p>
            <p>Feel free to explore the site and check out the guestbook.</p>
            <p>
              You can sign up to unlock extra layout features, or choose to post comments freely as
              a guest.
            </p>
            <p>
              By signing up, you can try out the custom "Golden" and "Rainbow" themes on this site
              below!
            </p>
          </div>
          {user && (
            <div className="theme-selector-group">
              <button
                className={`button ${theme === 'nightsky' ? 'active-theme-btn' : ''}`}
                onClick={() => setTheme('nightsky')}
              >
                Night Sky
              </button>
              <button
                className={`button ${theme === 'golden' ? 'active-theme-btn' : ''}`}
                onClick={() => setTheme('golden')}
              >
                Golden
              </button>
              <button
                className={`button ${theme === 'rainbow' ? 'active-theme-btn' : ''}`}
                onClick={() => setTheme('rainbow')}
              >
                Rainbow
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage
