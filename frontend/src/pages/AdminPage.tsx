import { useState, useEffect, JSX } from 'react'
import axios from 'axios'

export interface ProfileData {
  name: string
  email: string
  phone: string
  aboutText: string
  location: string
  githubUrl: string
  status: string
}

export interface Project {
  id: number
  title: string
  description: string
  technologies: string
  githubUrl: string
}

export interface Skill {
  id: number
  name: string
  level: string
  usedOn: string
  description?: string
  technologies?: string
}

export interface UserWithStats {
  id: number
  username: string
  role: string
  fullName?: string | null
  email?: string | null
  phone?: string | null
  commentingDisabled: boolean
  commentCount: number
}

interface User {
  username: string
  token: string
  role: 'USER' | 'ADMIN'
}

interface AdminPageProps {
  user: User | null
}

const AdminPage = ({ user }: AdminPageProps): JSX.Element => {
  const [adminUsers, setAdminUsers] = useState<UserWithStats[]>([])
  const [visibleUserInfos, setVisibleUserInfos] = useState<number[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    technologies: '',
    githubUrl: ''
  })
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [visibleProjects, setVisibleProjects] = useState<number[]>([])
  const [addingProject, setAddingProject] = useState<boolean>(false)
  const [projectError, setProjectError] = useState<string | null>(null)
  const [projectSuccess, setProjectSuccess] = useState<string | null>(null)

  const [skills, setSkills] = useState<Skill[]>([])
  const [newSkill, setNewSkill] = useState({
    name: '',
    level: '',
    usedOn: ''
  })
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null)
  const [visibleSkills, setVisibleSkills] = useState<number[]>([])
  const [addingSkill, setAddingSkill] = useState<boolean>(false)
  const [skillError, setSkillError] = useState<string | null>(null)
  const [skillSuccess, setSkillSuccess] = useState<string | null>(null)

  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    phone: '',
    aboutText: '',
    location: '',
    githubUrl: '',
    status: ''
  })
  const [editingProfile, setEditingProfile] = useState<boolean>(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null)

  useEffect(() => {
    axios.get<Skill[]>('/api/skills').then((response) => {
      setSkills(response.data)
    })
    axios.get<Project[]>('/api/projects').then((response) => {
      setProjects(response.data)
    })
    axios
      .get<ProfileData>('/api/profile')
      .then((response) => {
        if (response.data) {
          setProfileData(response.data)
        }
      })
      .catch((err) => console.error('Error fetching profile:', err))
  }, [])

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      const config = { headers: { Authorization: `Bearer ${user.token}` } }
      axios
        .get<UserWithStats[]>('/api/users', config)
        .then((response) => {
          setAdminUsers(response.data)
        })
        .catch((err) => console.error('Error fetching users:', err))
    }
  }, [user])

  const toggleInfo = (
    id: number,
    visibleItems: number[],
    setVisibleItems: React.Dispatch<React.SetStateAction<number[]>>
  ): void => {
    if (visibleItems.includes(id)) {
      setVisibleItems(visibleItems.filter((itemId) => itemId !== id))
    } else {
      setVisibleItems([...visibleItems, id])
    }
  }

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<any>>,
    state: any
  ): void => {
    const { name, value } = event.target
    setState({
      ...state,
      [name]: value
    })
  }

  const handleAddProject = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault()
    if (!newProject.title.trim()) {
      setProjectError('Project title is required')
      return
    }

    try {
      setProjectError(null)
      setProjectSuccess(null)
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` }
      }
      const response = await axios.post('/api/projects', newProject, config)
      setProjects([...projects, response.data])
      setNewProject({
        title: '',
        description: '',
        technologies: '',
        githubUrl: ''
      })
      setAddingProject(false)
      setProjectSuccess('Project created successfully!')
    } catch (error: any) {
      console.error('Error creating project:', error)
      setProjectError(error.response?.data?.error || 'Failed to create project.')
    }
  }

  const handleDeleteProject = async (id: number): Promise<void> => {
    try {
      setProjectError(null)
      setProjectSuccess(null)
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` }
      }
      await axios.delete(`/api/projects/${id}`, config)
      setProjects(projects.filter((project) => project.id !== id))
      setProjectSuccess('Project deleted successfully!')
    } catch (error: any) {
      console.error('Error deleting project:', error)
      setProjectError(error.response?.data?.error || 'Failed to delete project.')
    }
  }

  const handleEditProject = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault()
    if (!editingProject) return
    try {
      setProjectError(null)
      setProjectSuccess(null)
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` }
      }
      const response = await axios.put(`/api/projects/${editingProject.id}`, editingProject, config)
      setProjects(
        projects.map((project) => (project.id === editingProject.id ? response.data : project))
      )
      setEditingProject(null)
      setProjectSuccess('Project updated successfully!')
    } catch (error: any) {
      console.error('Error editing project:', error)
      setProjectError(error.response?.data?.error || 'Failed to edit project.')
    }
  }

  const handleAddSkill = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault()
    if (!newSkill.name.trim()) {
      setSkillError('Skill name is required')
      return
    }

    try {
      setSkillError(null)
      setSkillSuccess(null)
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` }
      }
      const response = await axios.post('/api/skills', newSkill, config)
      setSkills([...skills, response.data])
      setNewSkill({
        name: '',
        level: '',
        usedOn: ''
      })
      setAddingSkill(false)
      setSkillSuccess('Skill created successfully!')
    } catch (error: any) {
      console.error('Error creating skill:', error)
      setSkillError(error.response?.data?.error || 'Failed to create skill.')
    }
  }

  const handleDeleteSkill = async (id: number): Promise<void> => {
    try {
      setSkillError(null)
      setSkillSuccess(null)
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` }
      }
      await axios.delete(`/api/skills/${id}`, config)
      setSkills(skills.filter((skill) => skill.id !== id))
      setSkillSuccess('Skill deleted successfully!')
    } catch (error: any) {
      console.error('Error deleting skill:', error)
      setSkillError(error.response?.data?.error || 'Failed to delete skill.')
    }
  }

  const handleEditSkill = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault()
    if (!editingSkill) return
    try {
      setSkillError(null)
      setSkillSuccess(null)
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` }
      }
      const response = await axios.put(`/api/skills/${editingSkill.id}`, editingSkill, config)
      setSkills(skills.map((skill) => (skill.id === editingSkill.id ? response.data : skill)))
      setEditingSkill(null)
      setSkillSuccess('Skill updated successfully!')
    } catch (error: any) {
      console.error('Error editing skill:', error)
      setSkillError(error.response?.data?.error || 'Failed to edit skill.')
    }
  }

  const handleReorderProjects = async (index: number, direction: 'UP' | 'DOWN'): Promise<void> => {
    const newProjects = [...projects]
    if (direction === 'UP' && index > 0) {
      ;[newProjects[index], newProjects[index - 1]] = [newProjects[index - 1], newProjects[index]]
    } else if (direction === 'DOWN' && index < newProjects.length - 1) {
      ;[newProjects[index], newProjects[index + 1]] = [newProjects[index + 1], newProjects[index]]
    } else {
      return
    }

    setProjects(newProjects)
    try {
      setProjectError(null)
      setProjectSuccess(null)
      const config = { headers: { Authorization: `Bearer ${user?.token}` } }
      await axios.put('/api/projects/reorder', { orderedIds: newProjects.map((p) => p.id) }, config)
      setProjectSuccess('Projects reordered successfully!')
    } catch (error: any) {
      console.error('Error reordering projects:', error)
      setProjectError(error.response?.data?.error || 'Failed to reorder projects.')
    }
  }

  const handleReorderSkills = async (index: number, direction: 'UP' | 'DOWN'): Promise<void> => {
    const newSkills = [...skills]
    if (direction === 'UP' && index > 0) {
      ;[newSkills[index], newSkills[index - 1]] = [newSkills[index - 1], newSkills[index]]
    } else if (direction === 'DOWN' && index < newSkills.length - 1) {
      ;[newSkills[index], newSkills[index + 1]] = [newSkills[index + 1], newSkills[index]]
    } else {
      return
    }

    setSkills(newSkills)
    try {
      setSkillError(null)
      setSkillSuccess(null)
      const config = { headers: { Authorization: `Bearer ${user?.token}` } }
      await axios.put('/api/skills/reorder', { orderedIds: newSkills.map((s) => s.id) }, config)
      setSkillSuccess('Skills reordered successfully!')
    } catch (error: any) {
      console.error('Error reordering skills:', error)
      setSkillError(error.response?.data?.error || 'Failed to reorder skills.')
    }
  }

  const handleToggleCommentStatus = async (id: number): Promise<void> => {
    try {
      const config = { headers: { Authorization: `Bearer ${user?.token}` } }
      const response = await axios.put<UserWithStats>(
        `/api/users/${id}/comments-status`,
        {},
        config
      )
      setAdminUsers(adminUsers.map((u) => (u.id === id ? response.data : u)))
    } catch (error) {
      console.error('Error toggling comment status:', error)
    }
  }

  const handleSaveProfile = async (event: React.SyntheticEvent): Promise<void> => {
    event.preventDefault()
    try {
      setProfileError(null)
      setProfileSuccess(null)
      const config = { headers: { Authorization: `Bearer ${user?.token}` } }
      const response = await axios.put<ProfileData>('/api/profile', profileData, config)
      setProfileData(response.data)
      setEditingProfile(false)
      setProfileSuccess('Profile updated successfully!')
    } catch (error: any) {
      console.error('Error updating profile:', error)
      setProfileError(
        error.response?.data?.error ||
          'Failed to update profile. Ensure database is seeded and admin token is valid.'
      )
    }
  }

  const handleDeleteUser = async (userId: number): Promise<void> => {
    if (!user) return
    if (
      window.confirm(
        'Are you sure you want to delete this user? All associated comments will also be removed.'
      )
    ) {
      try {
        await axios.delete(`/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${user.token}` }
        })
        setAdminUsers(adminUsers.filter((u) => u.id !== userId))
      } catch (err: any) {
        console.error(err)
      }
    }
  }

  const toggleUserInfo = (userId: number): void => {
    if (visibleUserInfos.includes(userId)) {
      setVisibleUserInfos(visibleUserInfos.filter((id) => id !== userId))
    } else {
      setVisibleUserInfos([...visibleUserInfos, userId])
    }
  }

  return (
    <>
      <div className="content-window">
        <h1>This is the admin page!</h1>
      </div>
      <hr></hr>
      <div>
        <div className="content-window">
          <div>
            <button className="button" onClick={() => setAddingProject(!addingProject)}>
              {addingProject ? 'Stop adding new project' : 'Add new project'}
            </button>
          </div>

          {projectSuccess && <p style={{ color: 'green', marginTop: '10px' }}>{projectSuccess}</p>}
          {projectError && <p style={{ color: 'red', marginTop: '10px' }}>{projectError}</p>}

          {addingProject && (
            <div>
              <h4>Here you can add a new project:</h4>
              <form onSubmit={handleAddProject}>
                <div className="form-grid">
                  Title:{' '}
                  <input
                    className="theme-input"
                    type="text"
                    name="title"
                    value={newProject.title}
                    onChange={(event) => handleInputChange(event, setNewProject, newProject)}
                  />
                  Description:{' '}
                  <input
                    className="theme-input"
                    type="text"
                    name="description"
                    value={newProject.description}
                    onChange={(event) => handleInputChange(event, setNewProject, newProject)}
                  />
                  Technologies: &nbsp;{' '}
                  <input
                    className="theme-input"
                    type="text"
                    name="technologies"
                    value={newProject.technologies}
                    onChange={(event) => handleInputChange(event, setNewProject, newProject)}
                  />
                  GitHub:{' '}
                  <input
                    className="theme-input"
                    type="text"
                    name="githubUrl"
                    value={newProject.githubUrl}
                    onChange={(event) => handleInputChange(event, setNewProject, newProject)}
                  />
                  <button className="button" style={{ marginTop: '10px' }} type="submit">
                    Add project
                  </button>
                </div>
              </form>
            </div>
          )}

          <h4 style={{ marginBottom: '5px' }}>Projects:</h4>
          {projects.map((project, index) => (
            <li key={project.id}>
              {project.title} &nbsp;
              <button
                className="button"
                onClick={() => void handleReorderProjects(index, 'UP')}
                disabled={index === 0}
              >
                ↑
              </button>
              <button
                className="button"
                onClick={() => void handleReorderProjects(index, 'DOWN')}
                disabled={index === projects.length - 1}
              >
                ↓
              </button>
              <button
                className="button"
                onClick={() => toggleInfo(project.id, visibleProjects, setVisibleProjects)}
              >
                {visibleProjects.includes(project.id) ? 'Hide info' : 'Show info'}
              </button>
              <button
                className="button"
                onClick={() => {
                  setEditingProject(
                    editingProject && editingProject.id === project.id ? null : project
                  )
                }}
              >
                {editingProject && editingProject.id === project.id ? 'Stop editing' : 'Edit'}
              </button>
              <button className="button" onClick={() => void handleDeleteProject(project.id)}>
                Delete
              </button>
              {visibleProjects.includes(project.id) && (
                <ul>
                  <li>Description: {project.description}</li>
                  <li>Technologies: {project.technologies}</li>
                  <li>GitHub: {project.githubUrl}</li>
                </ul>
              )}
              {editingProject && editingProject.id === project.id && (
                <div>
                  <h4>Here you can edit the project you have chosen: "{editingProject.title}"</h4>
                  <form onSubmit={handleEditProject}>
                    <div className="form-grid">
                      Title:{' '}
                      <input
                        className="theme-input"
                        type="text"
                        name="title"
                        value={editingProject.title}
                        onChange={(event) =>
                          handleInputChange(event, setEditingProject, editingProject)
                        }
                      />
                      Description:{' '}
                      <input
                        className="theme-input"
                        type="text"
                        name="description"
                        value={editingProject.description}
                        onChange={(event) =>
                          handleInputChange(event, setEditingProject, editingProject)
                        }
                      />
                      Technologies:{' '}
                      <input
                        className="theme-input"
                        type="text"
                        name="technologies"
                        value={editingProject.technologies}
                        onChange={(event) =>
                          handleInputChange(event, setEditingProject, editingProject)
                        }
                      />
                      GitHub:{' '}
                      <input
                        className="theme-input"
                        type="text"
                        name="githubUrl"
                        value={editingProject.githubUrl}
                        onChange={(event) =>
                          handleInputChange(event, setEditingProject, editingProject)
                        }
                      />
                      <button className="button" style={{ marginTop: '10px' }} type="submit">
                        Save editions
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </li>
          ))}
        </div>

        <hr></hr>

        <div className="content-window">
          <div>
            <button className="button" onClick={() => setAddingSkill(!addingSkill)}>
              {addingSkill ? 'Stop adding new skill' : 'Add new skill'}
            </button>
          </div>

          {skillSuccess && <p style={{ color: 'green', marginTop: '10px' }}>{skillSuccess}</p>}
          {skillError && <p style={{ color: 'red', marginTop: '10px' }}>{skillError}</p>}

          {addingSkill && (
            <div>
              <h4>Here you can add a new skill:</h4>
              <form onSubmit={handleAddSkill}>
                <div className="form-grid">
                  Name:{' '}
                  <input
                    className="theme-input"
                    type="text"
                    name="name"
                    value={newSkill.name}
                    onChange={(event) => handleInputChange(event, setNewSkill, newSkill)}
                  />
                  Level:{' '}
                  <input
                    className="theme-input"
                    type="text"
                    name="level"
                    value={newSkill.level}
                    onChange={(event) => handleInputChange(event, setNewSkill, newSkill)}
                  />
                  UsedOn:{' '}
                  <input
                    className="theme-input"
                    type="text"
                    name="usedOn"
                    value={newSkill.usedOn}
                    onChange={(event) => handleInputChange(event, setNewSkill, newSkill)}
                  />
                  <button className="button" style={{ marginTop: '10px' }} type="submit">
                    Add skill
                  </button>
                </div>
              </form>
            </div>
          )}

          <h4 style={{ marginBottom: '5px' }}>Skills:</h4>
          {skills.map((skill, index) => (
            <li key={skill.id}>
              {skill.name} &nbsp;
              <button
                className="button"
                onClick={() => void handleReorderSkills(index, 'UP')}
                disabled={index === 0}
              >
                ↑
              </button>
              <button
                className="button"
                onClick={() => void handleReorderSkills(index, 'DOWN')}
                disabled={index === skills.length - 1}
              >
                ↓
              </button>
              <button
                className="button"
                onClick={() => toggleInfo(skill.id, visibleSkills, setVisibleSkills)}
              >
                {visibleSkills.includes(skill.id) ? 'Hide info' : 'Show info'}
              </button>
              <button
                className="button"
                onClick={() => {
                  setEditingSkill(editingSkill && editingSkill.id === skill.id ? null : skill)
                }}
              >
                {editingSkill && editingSkill.id === skill.id ? 'Stop editing' : 'Edit'}
              </button>
              <button className="button" onClick={() => void handleDeleteSkill(skill.id)}>
                Delete
              </button>
              {visibleSkills.includes(skill.id) && (
                <ul>
                  <li>Level: {skill.level}</li>
                  <li>UsedOn: {skill.usedOn}</li>
                </ul>
              )}
              {editingSkill && editingSkill.id === skill.id && (
                <div>
                  <h4>Here you can edit the skill you have chosen: "{editingSkill.name}"</h4>
                  <form onSubmit={handleEditSkill}>
                    <div className="form-grid">
                      Name:{' '}
                      <input
                        className="theme-input"
                        type="text"
                        name="name"
                        value={editingSkill.name}
                        onChange={(event) =>
                          handleInputChange(event, setEditingSkill, editingSkill)
                        }
                      />
                      Level:{' '}
                      <input
                        className="theme-input"
                        type="text"
                        name="level"
                        value={editingSkill.level}
                        onChange={(event) =>
                          handleInputChange(event, setEditingSkill, editingSkill)
                        }
                      />
                      UsedOn:{' '}
                      <input
                        className="theme-input"
                        type="text"
                        name="usedOn"
                        value={editingSkill.usedOn}
                        onChange={(event) =>
                          handleInputChange(event, setEditingSkill, editingSkill)
                        }
                      />
                      <button className="button" style={{ marginTop: '10px' }} type="submit">
                        Save editions
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </li>
          ))}
        </div>

        <hr></hr>

        <div className="content-window">
          <h4 style={{ marginBottom: '5px' }}>Profile & Contact Info Management:</h4>
          <button className="button" onClick={() => setEditingProfile(!editingProfile)}>
            {editingProfile ? 'Cancel Editing Profile' : 'Edit Profile Info'}
          </button>

          {profileSuccess && <p style={{ color: 'green', marginTop: '10px' }}>{profileSuccess}</p>}
          {profileError && <p style={{ color: 'red', marginTop: '10px' }}>{profileError}</p>}

          {editingProfile && (
            <form onSubmit={handleSaveProfile} style={{ marginTop: '10px' }}>
              <div className="form-grid">
                About Text:
                <textarea
                  rows={4}
                  name="aboutText"
                  className="theme-input"
                  style={{ width: '100%', resize: 'vertical' }}
                  value={profileData.aboutText}
                  onChange={(e) => setProfileData({ ...profileData, aboutText: e.target.value })}
                />
                Name:
                <input
                  className="theme-input"
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                />
                Email:
                <input
                  className="theme-input"
                  type="text"
                  name="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                />
                Phone:
                <input
                  className="theme-input"
                  type="text"
                  name="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                />
                Location:
                <input
                  className="theme-input"
                  type="text"
                  name="location"
                  value={profileData.location}
                  onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                />
                GitHub URL:
                <input
                  className="theme-input"
                  type="text"
                  name="githubUrl"
                  value={profileData.githubUrl}
                  onChange={(e) => setProfileData({ ...profileData, githubUrl: e.target.value })}
                />
                Status:
                <input
                  className="theme-input"
                  type="text"
                  name="status"
                  value={profileData.status}
                  onChange={(e) => setProfileData({ ...profileData, status: e.target.value })}
                />
                <button className="button" style={{ marginTop: '10px' }} type="submit">
                  Save Profile Changes
                </button>
              </div>
            </form>
          )}
        </div>

        <hr></hr>

        <div className="content-window">
          <h4 style={{ marginBottom: '5px' }}>Users Management:</h4>
          {adminUsers.map((u) => (
            <li key={u.id} style={{ marginBottom: '10px' }}>
              <strong>{u.username}</strong> ({u.role}) - Comments: {u.commentCount} &nbsp; Status:{' '}
              {u.commentingDisabled ? (
                <span style={{ color: 'red', fontWeight: 'bold' }}>Banned</span>
              ) : (
                <span style={{ color: 'green' }}>Active</span>
              )}
              <button
                className="button"
                style={{ marginLeft: '10px' }}
                onClick={() => toggleUserInfo(u.id)}
              >
                {visibleUserInfos.includes(u.id) ? 'Hide Info' : 'Show Info'}
              </button>
              {visibleUserInfos.includes(u.id) && (
                <div
                  style={{ fontSize: '0.85rem', color: 'var(--text-highlight)', margin: '5px 0' }}
                >
                  {u.fullName || u.email || u.phone ? (
                    <>
                      {u.fullName && <div>Name: {u.fullName}</div>}
                      {u.email && <div>Email: {u.email}</div>}
                      {u.phone && <div>Phone: {u.phone}</div>}
                    </>
                  ) : (
                    <div style={{ opacity: 0.7 }}>
                      No optional information provided.
                    </div>
                  )}
                </div>
              )}
              {u.role !== 'ADMIN' && (
                <>
                  <button
                    className="button"
                    style={{ marginLeft: '10px' }}
                    onClick={() => void handleToggleCommentStatus(u.id)}
                  >
                    {u.commentingDisabled ? 'Unban User' : 'Ban User'}
                  </button>
                  <button
                    className="button"
                    style={{ marginLeft: '5px' }}
                    onClick={() => void handleDeleteUser(u.id)}
                  >
                    Delete User
                  </button>
                </>
              )}
            </li>
          ))}
        </div>
      </div>
    </>
  )
}

export default AdminPage
