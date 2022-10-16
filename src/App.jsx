import React from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom';
import AppProvider from './context/AppProvider';
import Login from './pages/Login';
import MealsRecipe from './pages/MealsRecipe';
import DrinksRecipe from './pages/DrinksRecipe';
import Profile from './pages/Profile';
import DoneRecipes from './pages/DoneRecipes';
import FavoriteRecipes from './pages/FavoriteRecipes';
import MealsRecipeId from './pages/MealsRecipeId';
import DrinksRecipeId from './pages/DrinksRecipeId';
import MealsRecipeIdInProgress from './pages/MealsRecipeIdInProgress';
import DrinksRecipeIdInProgress from './pages/DrinksRecipeIdInProgress';

function App() {
  return (
    <Switch>
      <AppProvider>
        <Route exact path="/" component={ Login } />
        <Route exact path="/meals" component={ MealsRecipe } />
        <Route exact path="/drinks" component={ DrinksRecipe } />
        <Route exact path="/meals/:0" component={ MealsRecipeId } />
        <Route exact path="/drinks/:0" component={ DrinksRecipeId } />
        <Route
          exact
          path="/meals/:0/in-progress"
          component={ MealsRecipeIdInProgress }
        />
        <Route
          exact
          path="/drinks/:0/in-progress"
          component={ DrinksRecipeIdInProgress }
        />
        <Route path="/profile" component={ Profile } />
        <Route path="/done-recipes" component={ DoneRecipes } />
        <Route path="/favorite-recipes" component={ FavoriteRecipes } />
      </AppProvider>
    </Switch>

  );
}

export default App;
