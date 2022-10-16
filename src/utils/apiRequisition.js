const apiRequisition = async (type, search, drinkOrFood) => {
  let urlex = 'search';
  let api = 'themealdb';
  if (type === 'i') {
    urlex = 'filter';
  }
  if (drinkOrFood === 'drinks') {
    api = 'thecocktaildb';
  }
  try {
    const URL = `https://www.${api}.com/api/json/v1/1/${urlex}.php?${type}=${search}`;
    const request = await fetch(URL);
    const data = await request.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default apiRequisition;
