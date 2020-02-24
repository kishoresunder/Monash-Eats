import Search from './models/Search'
import * as searchView from './view/searchView'
import * as listView from './view/shoppingListView'
import {domValues} from './view/domEle'
import Recipe from '../js/models/Recipe'
import ShoppingList from '../js/models/ShoppingList'
import * as recipeView from './view/RenderRecipe'
import * as likesView from './view/likesView'
import Likes from './models/Likes'

const state ={

}
window.state = state

/**
 * search controller
 */
const controlSearch = async () => {
    //1. get the query from view
    const query = searchView.getInput()
    console.log('query ele', query)
    if(query){
        //2). Make the search
        state.search = new Search(query)

        //3). prepare UI for result
        await state.search.getVal()
        searchView.deleteInput()
        searchView.deleteResults()
        searchView.renderLoader(domValues.results)

        //4). search for recipes

        //5). render result in UI
        searchView.clearLoader()
        searchView.renderResults(state.search.result)
    }
   
}


domValues.search.addEventListener('submit', (val)=>{
    val.preventDefault()
    controlSearch().then(()=>{
        console.log('success')
    })
})


domValues.resultPages.addEventListener('click', e=>{
    const btn = e.target.closest('.btn-inline')
    if(btn){
        const btnVal = parseInt(btn.dataset.goto)
        searchView.deleteResults()
        searchView.renderResults(state.search.result,btnVal)
    }
})

/**
 * recipe controller
 */
const hashChange =  async () => {
    const id = window.location.hash.replace('#','')
    console.log(id)
    if(id){
        //1). changes in ui

        //2). create the recipe obj
        state.recipe = new Recipe(id)

        //3). get recipe data
        searchView.renderLoader(domValues.results)
        await state.recipe.getRecipeInfo()
        state.recipe.changeIngredients()

        //4). calculate serving and time
        state.recipe.calculateServings()
        state.recipe.calculateTime()

        //5). render the recipe
        searchView.clearLoader()
        recipeView.clearRecipeRender()
        recipeView.renderRecipe(state.recipe, state.likes.isLiked(id))
    }
}

/**
 * list controller
 */

const constrolShoppingList = () => {

 if(!state.shoppingList) state.shoppingList = new ShoppingList()
 
 state.recipe.ingredients.forEach(
     el => {
        const items = state.shoppingList.addItems(el.count, el.unit, el.ingredients)
        console.log('items',items) 
        listView.renderItems(items)   
     }
 ) 

}

//TESTING TODO
state.likes = new Likes()
const controlLikes = () => {
    if(!state.likes) state.likes = new Likes()
    const currId = state.recipe.id

    if(!state.likes.isLiked(currId)){
        //add like to state

        state.likes.addLike(state.recipe.id,state.recipe.title,state.recipe.author,state.recipe.img)
        //toggle like button
        const liked = state.likes.isLiked(state.recipe.id)
        console.log('isLiked? ',liked)
        likesView.toggleLikeButton(liked)
        //add like to the UI
        console.log(state.likes)

    }else{
        //remove like from the state
        state.likes.removeLikes(state.recipe.id)
        //toggle like button
        const liked = state.likes.isLiked(state.recipe.id)
        likesView.toggleLikeButton(liked)
        //remove like to the UI
        console.log(state.likes)
    }
}

// window.addEventListener('hashchange',hashChange)
// window.addEventListener('load',hashChange)

['hashchange','load'].forEach((events)=>{
    window.addEventListener(events,hashChange)
})

// to decrease/increase the servings
domValues.recipe.addEventListener('click', e=>{
    if(e.target.matches('.btn-decrease, .btn-decrease * ')){
        if(state.recipe.servings > 1){
            state.recipe.updateServings('dec')
            recipeView.updateRecipeIngredients(state.recipe)
        } 
    } else if(e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc')
        recipeView.updateRecipeIngredients(state.recipe)
    }else if(e.target.matches('.recipe__btn__add, .recipe__btn__add *')) {
        constrolShoppingList()
    }else if(e.target.matches('.recipe__love *')){
        console.log('heart clicked!!')
        controlLikes()
    }
}
)

//deleting or updating the shopping lise

domValues.shopping.addEventListener('click',
e => {
    
    //get the id of the elemwent to delete
    const id = e.target.closest('.shopping__item').dataset.itemid;
    
    console.log('id',id, e.target)
    //handle the delete
    if(e.target.matches('.shopping__delete *')){
       //delete it from state
       console.log('inside delete')
        state.shoppingList.deleteItems(id)

       //delete it from UI
        listView.deleteItems(id)
    }else if(e.target.matches('.shopping__count-value')){
        const val = parseFloat(e.target.value)
        state.shoppingList.updateCount(id,val)
    }
}

)