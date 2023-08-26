import {Component} from 'react'
import Loader from 'react-loader-spinner'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProjectShowCase extends Component {
  state = {
    projectsList: [],
    apiStatus: apiStatusConstants.initial,
    activeId: categoriesList[0].id,
  }

  componentDidMount() {
    this.getProjectsData()
  }

  getProjectsData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {activeId} = this.state

    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${activeId}`
    const response = await fetch(apiUrl)
    if (response.ok) {
      const data = await response.json()

      const formattedData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))

      this.setState({
        apiStatus: apiStatusConstants.success,
        projectsList: formattedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onOptionChange = event => {
    this.setState(
      {
        activeId: event.target.value,
      },
      this.getProjectsData,
    )
  }

  renderSuccessView = () => {
    const {projectsList} = this.state

    return (
      <ul>
        {projectsList.map(each => {
          const {id, name, imageUrl} = each

          return (
            <li key={id}>
              <img src={imageUrl} alt={name} />
              <p>{name}</p>
            </li>
          )
        })}
      </ul>
    )
  }

  // Render Loading View
  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="red" height="50" width="50" />
    </div>
  )

  // Render Failure View
  renderFailureView = () => {
    const failureViewImg =
      'https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png'

    const onTryAgainBtn = () => {
      this.getProjectsData()
    }

    return (
      <div className="failure-view-container">
        <img
          className="failure-view-img"
          src={failureViewImg}
          alt="failure view"
        />
        <h1 className="heading">Oops! Something Went Wrong</h1>
        <p className="para">
          We cannot seem to find the page you are looking for
        </p>
        <button type="button" className="try-again-btn" onClick={onTryAgainBtn}>
          Retry
        </button>
      </div>
    )
  }

  getRenderViews = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()

      case apiStatusConstants.success:
        return this.renderSuccessView()

      case apiStatusConstants.failure:
        return this.renderFailureView()

      default:
        return null
    }
  }

  render() {
    const {activeId} = this.state
    // console.log(activeId)

    return (
      <div>
        <nav>
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </nav>
        <div>
          <select value={activeId} onChange={this.onOptionChange}>
            {categoriesList.map(each => {
              const {id, displayText} = each

              return (
                <option value={id} key={id}>
                  {displayText}
                </option>
              )
            })}
          </select>
          {this.getRenderViews()}
        </div>
      </div>
    )
  }
}

export default ProjectShowCase
