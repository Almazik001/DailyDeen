import MyInput from '../UI/MyInput/MyInput'
import MyButton from '../UI/MyButton/MyButton'
import Search from '../../assets/icons8-search.svg'
import BellIcon from '../../assets/bell-icon.svg'
import Calendar from '../../assets/calendar-icon.svg'

const Header = () => {
  return (
    <header className="header container">
      <div className="header-logo" aria-label="Dashboard">
        <span>Dash</span>board
      </div>

      <form
        className="header-form"
        onSubmit={(event) => {
          event.preventDefault()
        }}
      >
        <MyInput placeholder="Search your task here..." />
        <MyButton aria-label="Search">
          <img src={Search} alt="search icon" style={{ width: 14, height: 14 }} />
        </MyButton>
      </form>

      <div className="header-tools">
        <div className="header-button">
          <MyButton aria-label="Notifications">
            <img src={BellIcon} alt="bell icon" style={{ width: 14, height: 14 }} />
          </MyButton>
          <MyButton aria-label="Calendar">
            <img src={Calendar} alt="calendar icon" style={{ width: 14, height: 14 }} />
          </MyButton>
        </div>

        <div className="header-data">
          <p>Tuesday</p>
          <span>20/06/2023</span>
        </div>
      </div>
    </header>
  )
}

export default Header
