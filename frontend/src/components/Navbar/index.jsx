import React from "react";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  function logout(){
    localStorage.removeItem('currentUser');
    window.location.href='/login';
  }
  return (
    <div>
      <nav className="navbar navbar-expand-lg ">
        <a className="navbar-brand" href="#">
        ＢｏｏｋＳｈｏｏｋ
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
        <span className="navbar-toggler-icon" ><i className="fa-solid fa-bars" style={{color: 'white'}}></i></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            {user ? (
              <>
                <div class="dropdown">
                  <button
                    class="btn btn-secondary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                     <i class="fa-solid fa-user"></i>{user.name}
                  </button>
                  <ul class="dropdown-menu">
                  <li>
                   <a href="/profile">
                   Profile
                   </a>
                   </li>
                    <li>
                      <a class="dropdown-item" href="#" onClick={logout}>
                        Logout
                      </a>
                    </li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <li className="nav-item active">
                  <a className="nav-link" href="/register">
                    Register
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/login">
                    Login
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
