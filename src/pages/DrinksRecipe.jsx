import React, { useContext, useEffect } from 'react';
import Header from '../components/Header';
import AppContext from '../context/AppContext';
import Recipes from '../components/Recipes';
import Footer from '../components/Footer';
import '../styles/footer.css';

function DrinksRecipe() {
  const { setInfoHeader, setResults, setCategories } = useContext(AppContext);
  useEffect(() => {
    setInfoHeader(() => ({
      title: 'drinks',
      profile: true,
      search: true,
    }));
    const generateInitialRecipes = async () => {
      const URLRECIPES = 'https://www.thecocktaildb.com/api/json/v1/1/search.php?s=';
      const requestRecipes = await fetch(URLRECIPES);
      const dataRecipes = await requestRecipes.json();
      const { drinks: drinksRecipes } = dataRecipes;
      setResults(drinksRecipes);
      const URLCATEGORIES = 'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list';
      const requestCategories = await fetch(URLCATEGORIES);
      const dataCategories = await requestCategories.json();
      const { drinks: drinksCategories } = dataCategories;
      setCategories(drinksCategories);
    };
    generateInitialRecipes();
  }, []);

  return (
    <>
      <Header />
      <Recipes />
      <Footer />
    </>
  );
}

export default DrinksRecipe;
