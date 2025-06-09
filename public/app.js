let currentLanguage = 'en';

function toggleLanguage() {
  currentLanguage = currentLanguage === 'en' ? 'hi' : 'en';
  document.getElementById('languageBtn').innerText = currentLanguage === 'en' ? 'Hindi' : 'English';

  // Refresh recipes with new language (for future multilingual support)
  getRecipes();
}

async function getRecipes() {
  const ingredients = document.getElementById('ingredients').value;

  const response = await fetch('http://localhost:5000/get_recipes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ingredients })
  });

  const data = await response.json();
  const container = document.getElementById('recipes');
  container.innerHTML = '';

  if (data.recipes.length === 0) {
    container.innerHTML = '<p>No recipes found. Try another ingredient!</p>';
    return;
  }

  data.recipes.forEach(recipe => {
    const div = document.createElement('div');
    div.className = 'recipe';
    div.innerHTML = `
      <h3>${recipe.name}</h3>
      <img src="${recipe.image}" alt="${recipe.name}" width="200">
      <button onclick="getRecipeDetails(${recipe.id})">View Details</button>
    `;
    container.appendChild(div);
  });
}

async function getRecipeDetails(id) {
  const response = await fetch(`http://localhost:5000/recipe/${id}`);
  const data = await response.json();

  const detailsContainer = document.getElementById('recipeDetails');
  detailsContainer.innerHTML = `
    <h2>${data.name}</h2>
    <p><strong>Category:</strong> ${data.category}</p>
    <p><strong>Area:</strong> ${data.area}</p>
    <p><strong>Instructions:</strong> ${data.instructions}</p>
    <img src="${data.image}" alt="${data.name}" width="300">
    <br>
    <a href="${data.youtube}" target="_blank">Watch on YouTube</a>
  `;
}

function findGroceryStores() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
  
        // Open Google Maps with the nearby grocery store search
        window.open(`https://www.google.com/maps/search/grocery+stores/@${lat},${lon},15z`, "_blank");
      }, error => {
        alert("Failed to fetch location. Please enable GPS and try again.");
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
  
  async function getRecommendations() {
    const response = await fetch('http://localhost:5000/recommendations');
    const data = await response.json();
    
    const container = document.getElementById('recommendations');
    container.innerHTML = '<h2>🍽️ Recommended Recipes</h2>';

    if (data.recommendations.length === 0) {
        container.innerHTML += '<p>No recommendations yet. Search for a recipe first!</p>';
        return;
    }

    data.recommendations.forEach(recipe => {
        const div = document.createElement('div');
        div.className = 'recipe';
        div.innerHTML = `
            <h3>${recipe.name}</h3>
            <img src="${recipe.image}" alt="${recipe.name}" width="200">
        `;
        container.appendChild(div);
    });
}

// Fetch Trending Recipes
async function getTrendingRecipes() {
    const response = await fetch('http://localhost:5000/trending');
    const data = await response.json();

    const container = document.getElementById('trending');
    container.innerHTML = '<h2>📊 Trending Recipes</h2>';

    if (data.trending.length === 0) {
        container.innerHTML += '<p>No trending recipes yet!</p>';
        return;
    }

    data.trending.forEach(recipe => {
        const div = document.createElement('div');
        div.className = 'recipe';
        div.innerHTML = `
            <h3>${recipe.name}</h3>
            <img src="${recipe.image}" alt="${recipe.name}" width="200">
            <button onclick="getRecipeDetails(${recipe.id})">View Details</button>
        `;
        container.appendChild(div);
    });
}



// Fetch recipes based on selected cuisine
async function getCuisineRecipes() {
    const cuisine = document.getElementById('cuisineSelect').value;

    const response = await fetch(`http://localhost:5000/filter_by_cuisine?cuisine=${cuisine}`);
    const data = await response.json();

    const container = document.getElementById('recipes');
    container.innerHTML = `<h2>🍽️ ${cuisine} Recipes</h2>`;

    if (data.recipes.length === 0) {
        container.innerHTML += '<p>No recipes found for this cuisine!</p>';
        return;
    }

    data.recipes.forEach(recipe => {
        const div = document.createElement('div');
        div.className = 'recipe';
        div.innerHTML = `
            <h3>${recipe.name}</h3>
            <img src="${recipe.image}" alt="${recipe.name}" width="200">
            <button onclick="getRecipeDetails(${recipe.id})">View Details</button>
        `;
        container.appendChild(div);
    });
}




async function getPersonalizedSuggestions(userId) {
    const response = await fetch('http://localhost:5000/personalized_suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId })
    });

    const data = await response.json();
    const container = document.getElementById('suggestions');
    container.innerHTML = '<h2>🤖 Personalized Suggestions</h2>';

    if (data.suggestions.length === 0) {
        container.innerHTML += '<p>No suggestions available!</p>';
        return;
    }

    data.suggestions.forEach(recipe => {
        const div = document.createElement('div');
        div.className = 'recipe';
        div.innerHTML = `
            <h3>${recipe.name}</h3>
            <img src="${recipe.image}" alt="${recipe.name}" width="200">
            <button onclick="getRecipeDetails(${recipe.id})">View Details</button>
        `;
        container.appendChild(div);
    });
}


// const cuisineSelect = document.getElementById("cuisineSelect");

// const internationalCuisines = [
//   { value: "Indian", label: "Indian" },
//   { value: "Chinese", label: "Chinese" },
//   { value: "Italian", label: "Italian" },
//   { value: "Mexican", label: "Mexican" },
//   { value: "Thai", label: "Thai" },
//   { value: "Japanese", label: "Japanese" },
//   { value: "Greek", label: "Greek" },
//   { value: "French", label: "French" },
//   { value: "Spanish", label: "Spanish" },
//   { value: "Turkish", label: "Turkish" },
// ];

// const indianCuisines = [
//   { value: "North Indian", label: "North Indian" },
//   { value: "South Indian", label: "South Indian" },
//   { value: "Gujarati", label: "Gujarati" },
//   { value: "Punjabi", label: "Punjabi" },
//   { value: "Bengali", label: "Bengali" },
//   { value: "Rajasthani", label: "Rajasthani" },
//   { value: "Maharashtrian", label: "Maharashtrian" },
//   { value: "Goan", label: "Goan" },
//   { value: "Kashmiri", label: "Kashmiri" },
//   { value: "Hyderabadi", label: "Hyderabadi" },
// ];

// function populateCuisineOptions(options) {
//   cuisineSelect.innerHTML = "";
//   options.forEach(opt => {
//     const option = document.createElement("option");
//     option.value = opt.value;
//     option.textContent = opt.label;
//     cuisineSelect.appendChild(option);
//   });
// }

// function toggleCuisineOptions() {
//   const selectedType = document.getElementById("cuisineType").value;
//   if (selectedType === "indian") {
//     populateCuisineOptions(indianCuisines);
//   } else {
//     populateCuisineOptions(internationalCuisines);
//   }
// }

// // Initial load
// toggleCuisineOptions();
