const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let userSearchHistory = []; // Store user searches
let searchCount = {}; // Track trending searches

// Route to search recipes
app.post('/get_recipes', async (req, res) => {
    const { ingredients } = req.body;
    userSearchHistory.push(ingredients); // Store search

    try {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${ingredients}`);

        if (!response.data.meals) {
            return res.json({ recipes: [] }); // No results found
        }

        const recipes = response.data.meals.map(meal => ({
            id: meal.idMeal,  
            name: meal.strMeal,
            image: meal.strMealThumb
        }));

        res.json({ recipes });
    } catch (error) {
        console.error("❌ API Error:", error.message);
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
});

// Route to get recipe details by ID
app.get('/recipe/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);

        if (!response.data.meals) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        const meal = response.data.meals[0];

        const recipeDetails = {
            name: meal.strMeal,
            category: meal.strCategory,
            area: meal.strArea,
            instructions: meal.strInstructions,
            image: meal.strMealThumb,
            youtube: meal.strYoutube
        };

        res.json(recipeDetails);
    } catch (error) {
        console.error("❌ API Error:", error.message);
        res.status(500).json({ error: 'Failed to fetch recipe details' });
    }
});

// Route for AI Recipe Recommendations
app.get('/recommendations', async (req, res) => {
    if (userSearchHistory.length === 0) {
        return res.json({ recommendations: [] });
    }

    const lastSearch = userSearchHistory[userSearchHistory.length - 1];

    try {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${lastSearch}`);

        if (!response.data.meals) {
            return res.json({ recommendations: [] });
        }

        const recommendations = response.data.meals.slice(0, 3).map(meal => ({
            id: meal.idMeal,
            name: meal.strMeal,
            image: meal.strMealThumb
        }));

        res.json({ recommendations });
    } catch (error) {
        console.error("❌ API Error:", error.message);
        res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
});

// Route to search recipes
app.post('/get_recipes', async (req, res) => {
    const { ingredients } = req.body;

    // Track search trends
    if (searchCount[ingredients]) {
        searchCount[ingredients]++;
    } else {
        searchCount[ingredients] = 1;
    }

    try {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${ingredients}`);

        if (!response.data.meals) {
            return res.json({ recipes: [] }); // No results found
        }

        const recipes = response.data.meals.map(meal => ({
            id: meal.idMeal,
            name: meal.strMeal,
            image: meal.strMealThumb
        }));

        res.json({ recipes });
    } catch (error) {
        console.error("❌ API Error:", error.message);
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
});

// Route to get trending recipes
app.get('/trending', async (req, res) => {
    const sortedTrends = Object.keys(searchCount)
        .sort((a, b) => searchCount[b] - searchCount[a]) // Sort by search frequency
        .slice(0, 3); // Get top 3 trending searches

    if (sortedTrends.length === 0) {
        return res.json({ trending: [] });
    }

    let trendingRecipes = [];
    for (let ingredient of sortedTrends) {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/search.php?s=${ingredient}`);

        if (response.data.meals) {
            trendingRecipes.push({
                name: response.data.meals[0].strMeal,
                image: response.data.meals[0].strMealThumb,
                id: response.data.meals[0].idMeal
            });
        }
    }

    res.json({ trending: trendingRecipes });
});

// Route to filter recipes by cuisine
app.get('/filter_by_cuisine', async (req, res) => {
    const { cuisine } = req.query;

    try {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${cuisine}`);

        if (!response.data.meals) {
            return res.json({ recipes: [] });
        }

        const recipes = response.data.meals.map(meal => ({
            id: meal.idMeal,
            name: meal.strMeal,
            image: meal.strMealThumb
        }));

        res.json({ recipes });
    } catch (error) {
        console.error("❌ API Error:", error.message);
        res.status(500).json({ error: 'Failed to fetch recipes by cuisine' });
    }
});


app.listen(5000, () => {
    console.log('🍴 HauteCuisine backend running on http://localhost:5000');
});
