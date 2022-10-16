const apiRequisitionDetails = async (type, id) => {
  let food = type;
  if (food === 'drinks' || food === 'drink') {
    food = 'thecocktaildb';
  } else {
    food = 'themealdb';
  }
  try {
    const URL = `https://www.${food}.com/api/json/v1/1/lookup.php?i=${id}`;
    const request = await fetch(URL);
    const data = await request.json();
    return data;
  } catch (error) {
    console.log(error);
  }
};

export default apiRequisitionDetails;
