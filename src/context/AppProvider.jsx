import React, { useState } from 'react';
import PropTypes from 'prop-types';
import AppContext from './AppContext';

function AppProvider({ children }) {
  const [infoHeader, setInfoHeader] = useState({
    title: '', profile: false, search: false,
  });
  const [results, setResults] = useState([]);
  const [categories, setCategories] = useState();
  const [showCat, setShowCat] = useState(false);
  const [idDetails, setIdDetails] = useState();
  const { title, profile, search } = infoHeader;
  const [buttonName, setButtonName] = useState('Start Recipe');

  const contextType = {
    title,
    profile,
    search,
    results,
    categories,
    idDetails,
    buttonName,
    showCat,
    setShowCat,
    setCategories,
    setInfoHeader,
    setResults,
    setIdDetails,
    setButtonName,
  };

  return (
    <AppContext.Provider value={ contextType }>
      {children}
    </AppContext.Provider>
  );
}

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AppProvider;
