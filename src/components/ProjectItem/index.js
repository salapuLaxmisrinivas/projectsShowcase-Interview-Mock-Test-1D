import './index.css'

const ProjectItem = props => {
  const {projectDetails} = props
  const {imageUrl, name} = projectDetails
  return (
    <li className="each-project-container">
      <img className="project-image" src={imageUrl} alt={name} />
      <p className="project-title">{name}</p>
    </li>
  )
}

export default ProjectItem
