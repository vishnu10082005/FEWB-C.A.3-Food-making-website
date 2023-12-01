const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const food = document.getElementById('food');
const randomFood = document.getElementById('randomfood');
const ingredients_div = document.getElementById('ingredients');
const ingredients_blur_div = document.getElementById('ingredients_blur_div');
const temp = document.getElementById('temp');
const rsultss = document.getElementById('popularSearch');
const url = 'https://www.themealdb.com/api/json/v1/1/random.php';
//onclicking the secrching the search buttons.

 // Function to handle the search on key press (Enter)
function searchOnEnter(event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    searchMeal();
  }
}

// Attach event listener to the search input for the key press (Enter)
searchInput.addEventListener('keypress', searchOnEnter);

// Function to perform the meal search
function searchMeal() {
  var searchValue = searchInput.value;
  var url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchValue}`;
  
  if (searchValue !== '') {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        let output = '';
        for (let i = 0; i < data.meals.length; i++) {
          output += `
            <div id="card">
              <img src="${data.meals[i].strMealThumb}" alt=" ">
              <h3>${data.meals[i].strMeal}</h3>
              <p><a href="${data.meals[i].strYoutube}" target="_blank">Watch on YouTube</a></p>
              <button class="cook-btn" data-mealid="${data.meals[i].idMeal}">Cook</button>
            </div>
          `;
        }
        console.log(output);
        food.innerHTML = output;
        localStorage.setItem("output", output);
        rsultss.style.display="block"
        const cookButtons = document.querySelectorAll('.cook-btn');
        cookButtons.forEach(button => {
          button.addEventListener('click', (event) => {
            const mealId = event.target.getAttribute('data-mealid');
            getIngredients(mealId);
            food.style.filter = 'blur(12px)';
            randomFood.style.filter = 'blur(12px)';
          });
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
}

//getting the ingridients as output.
function getIngredients(mealId) {
    var url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
    ingredients_div.style.display = 'block';
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        const meal = data.meals[0];
        const mealThumbnail = meal.strMealThumb;
        const mealName = meal.strMeal;
        const instructions = meal.strInstructions;
  
        const image = document.createElement('img');
        image.src = mealThumbnail;
        image.alt = mealName;
  
        const imageDiv = document.createElement('div');
        imageDiv.appendChild(image);
  
        const backButton = document.createElement('button');
        backButton.id = 'Back';
        backButton.textContent = 'Back';
        backButton.addEventListener('click', () => {
          ingredients_blur_div.style.display = 'none';
          food.style.filter = 'blur(0px)';
          randomFood.style.filter = 'blur(0px)';
          randomFood.style.display = 'block';
        });
  
        const backButtonDiv = document.createElement('div');
        backButtonDiv.appendChild(backButton);
  
        const backbuttonDiv = document.createElement('div');
        backbuttonDiv.id = 'backbutton';
        backbuttonDiv.appendChild(imageDiv);
        backbuttonDiv.appendChild(backButtonDiv);
  
        const ingredientsDiv = document.createElement('div');
        for (let i = 1; i <= 20; i++) {
          const ingredient = meal[`strIngredient${i}`];
          const measure = meal[`strMeasure${i}`];
  
          if (ingredient) {
            const ingredientDiv = document.createElement('div');
            ingredientDiv.textContent = `${measure} ${ingredient}`;
            ingredientsDiv.appendChild(ingredientDiv);
          } else {
            break;
          }
        }
  
        const instructionsDiv = document.createElement('div');
        instructionsDiv.innerHTML = `<strong>Instructions:</strong> ${instructions}`;
  
        ingredients_div.innerHTML = '';
        ingredients_div.appendChild(backbuttonDiv);
        ingredients_div.appendChild(ingredientsDiv);
        ingredients_div.appendChild(instructionsDiv);
  
        ingredients_blur_div.style.display = 'block';
      })
      .catch(error => {
        console.log(error);
      });
  }
  
//getting the random food on reload
function getRandomFood(url) {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        let meal = data.meals[0];
        let output = document.createElement('div');
        output.id = 'card';
  
        let img = document.createElement('img');
        img.src = meal.strMealThumb;
        img.alt = '';
        output.appendChild(img);
  
        let mealDetails = document.createElement('div');
        mealDetails.classList.add('meal-details');
  
        let mealName = document.createElement('p');
        mealName.textContent = meal.strMeal;
        mealDetails.appendChild(mealName);
  
        let category = document.createElement('p');
        category.textContent = `Category: ${meal.strCategory}`;
        mealDetails.appendChild(category);
  
        let youtubeLink = document.createElement('p');
        let youtubeAnchor = document.createElement('a');
        youtubeAnchor.href = meal.strYoutube;
        youtubeAnchor.textContent = 'Watch on YouTube';
        youtubeAnchor.target = '_blank';
        youtubeLink.appendChild(youtubeAnchor);
        mealDetails.appendChild(youtubeLink);
  
        let cookButton = document.createElement('button');
        cookButton.classList.add('cook-btn');
        cookButton.textContent = 'Cook';
        mealDetails.appendChild(cookButton);
  
        output.appendChild(mealDetails);
        randomFood.appendChild(output);
  
        cookButton.addEventListener('click', () => {
          randomFood.style.display = 'none';
          getIngredients(meal.idMeal);
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
  getRandomFood(url)