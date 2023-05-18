import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectItem from './components/ProjectItem'

import './App.css'

// This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

// Replace your code here

const apiConstants = {
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
  initial: 'INITIAL',
}

class App extends Component {
  state = {
    projectsArray: [],
    optionSelected: categoriesList[0].id,
    apiStatus: apiConstants.initial,
  }

  componentDidMount() {
    this.getProjectsDetails()
  }

  getFormattedObject = project => ({
    id: project.id,
    imageUrl: project.image_url,
    name: project.name,
  })

  getProjectsDetails = async () => {
    this.setState({apiStatus: apiConstants.inProgress})
    const {optionSelected} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${optionSelected}`

    const response = await fetch(url)
    if (response.ok) {
      const responseData = await response.json()

      const projectsArray = responseData.projects.map(eachProject =>
        this.getFormattedObject(eachProject),
      )

      this.setState({projectsArray, apiStatus: apiConstants.success})
    } else {
      this.setState({apiStatus: apiConstants.failure})
    }
  }

  updateOptionFilter = e => {
    this.setState({optionSelected: e.target.value}, this.getProjectsDetails)
  }

  getResultantView = () => {
    const {apiStatus, projectsArray} = this.state
    switch (apiStatus) {
      case apiConstants.success:
        return (
          <ul className="projects-container">
            {projectsArray.map(eachProject => (
              <ProjectItem projectDetails={eachProject} key={eachProject.id} />
            ))}
          </ul>
        )
      case apiConstants.inProgress:
        return (
          <div data-testid="loader" className="loader-container">
            <Loader type="ThreeDots" color="#328af2" height={50} width={50} />
          </div>
        )

      case apiConstants.failure:
        return (
          <div className="loader-container">
            <img
              className="failure-image"
              src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
              alt="failure view"
            />
            <h1 className="failure-heading">Oops! Something Went Wrong</h1>
            <p className="failure-text">
              We cannot seem to find the page you are looking for
            </p>
            <button
              onClick={this.getProjectsDetails}
              type="button"
              className="retry-button"
            >
              Retry
            </button>
          </div>
        )

      default:
        return null
    }
  }

  render() {
    const {projectsArray} = this.state
    return (
      <div className="page-main-container">
        <nav className="nav-bar">
          <img
            alt="website logo"
            className="website-logo"
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
          />
        </nav>
        <div className="page-bottom-container">
          <select
            onChange={this.updateOptionFilter}
            className="options-dropdown"
          >
            {categoriesList.map(eachOption => (
              <option
                className="option"
                defaultValue={categoriesList[0].id === eachOption.id}
                value={eachOption.id}
                key={eachOption.id}
              >
                {eachOption.displayText}
              </option>
            ))}
          </select>
          {this.getResultantView()}
        </div>
      </div>
    )
  }
}

export default App
