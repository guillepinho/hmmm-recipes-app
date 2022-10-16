import React, { useContext, useEffect } from 'react';
import Header from '../components/Header';
import AppContext from '../context/AppContext';
import Recipes from '../components/Recipes';
import Footer from '../components/Footer';
import '../styles/footer.css';

function MealsRecipe() {
  const { setInfoHeader, setResults, setCategories } = useContext(AppContext);
  useEffect(() => {
    setInfoHeader(() => ({
      title: 'meals',
      profile: true,
      search: true,
    }));
    const generateInitialRecipes = async () => {
      const URLRECIPES = 'https://www.themealdb.com/api/json/v1/1/search.php?s=';
      const requestRecipes = await fetch(URLRECIPES);
      const dataRecipes = await requestRecipes.json();
      const { meals: mealsRecipes } = dataRecipes;
      setResults(mealsRecipes);
      const URLCATEGORIES = 'https://www.themealdb.com/api/json/v1/1/list.php?c=list';
      const requestCategories = await fetch(URLCATEGORIES);
      const dataCategories = await requestCategories.json();
      const { meals: mealsCategories } = dataCategories;
      setCategories(mealsCategories);
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

export default MealsRecipe;
