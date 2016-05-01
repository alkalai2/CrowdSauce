
var Nav = ReactBootstrap.Navbar

/*
* Navbar:
* React Class to replace duplicate navbars in html files as
* part of refactoring our code.
*/
var Navbar = React.createClass ({

  render:function(){
    return(
      <Nav role="navigation" fixedTop="true" inverse="true" fluid="true">
        <a className="navbar-brand" href="/">CrowdSauce</a>
        <ul className="nav navbar-nav">
          <li className="nav-item">
            <a className="nav-link" href="/feed">Home</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/about">About</a>
          </li>
          <li className="nav-item ">
            <a className="nav-link" href="/favorites">Favorites</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/profile">My Profile</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/shopping">Shopping List</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/settings">Settings</a>
          </li>
        </ul>
      </Nav>
    );
  },
});

ReactDOM.render(<Navbar/>, navbar);