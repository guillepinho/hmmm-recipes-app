const apiRequisitionRecommendation = async (type) => {
  let food = type;
  if (food === 'drinks') {
    food = 'thecocktaildb';
  } else {
    food = 'themealdb';
  }
  try {
    const URL = `https://www.${food}.com/api/json/v1/1/search.php?s=`;
    const request = await fetch(URL);
    const data = await request.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default apiRequisitionRecommendation;
