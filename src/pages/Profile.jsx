import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../components/Header';
import AppContext from '../context/AppContext';
import Footer from '../components/Footer';
import '../styles/footer.css';
import '../styles/profile.css';

function Profile() {
  const history = useHistory();
  const { setInfoHeader } = useContext(AppContext);
  const [loginEmail, setLoginEmail] = useState('carregando...');

  useEffect(() => {
    setInfoHeader(() => ({
      title: 'Profile',
      profile: true,
      search: false,
    }));
    if (localStorage.length > 0) {
      setLoginEmail(JSON.parse(localStorage.getItem('user')).email);
    }
  }, []);

  const removingLocalStorageAndRedirectingToLogin = () => {
    localStorage.clear();
    history.push('/');
  };

  return (
    <div>
      <Header />
      <section className="profile-container">
        <div className="profile-info">
          <div className="avatar">
            <img
              src="https://cdn.icon-icons.com/icons2/2506/PNG/512/user_icon_150670.png"
              alt="user-avatar"
              className="user-avatar"
              data-testid="profile-image"
            />
          </div>
          <div data-testid="profile-email" className="login-data">{ loginEmail }</div>
        </div>
        <div className="profile-buttons">
          <button
            data-testid="profile-done-btn"
            type="button"
            onClick={ () => history.push('/done-recipes') }
            className="profile-button"
          >
            Done Recipes
          </button>
          <button
            data-testid="profile-favorite-btn"
            type="button"
            onClick={ () => history.push('/favorite-recipes') }
            className="profile-button"
          >
            Favorite Recipes
          </button>
          <button
            data-testid="profile-logout-btn"
            type="button"
            onClick={ removingLocalStorageAndRedirectingToLogin }
            className="profile-button"
          >
            Logout
          </button>
        </div>
      </section>
      <div className="footer-profile">
        <Footer />
      </div>
    </div>
  );
}

export default Profile;
