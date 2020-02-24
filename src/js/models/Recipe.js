import axios from 'axios'
export default class Recipe  {

    constructor (id) {
        this.id = id
    }

    async getRecipeInfo(){
        try{
            const recipeVal = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = recipeVal.data.recipe.title
            this.image = recipeVal.data.recipe.image_url
            this.author = recipeVal.data.recipe.publisher
            this.url = recipeVal.data.recipe.source_url
            this.ingredients = recipeVal.data.recipe.ingredients
        }catch(error){
            console.log(error)
            alert('something went wrong !!!!')
        }
    }

    //assuming we need 15 minutes for 3 servings
    calculateTime(){
        const numIng = 4
        const periods = Math.ceil(numIng / 3)
        this.time = periods * 15
    }

    calculateServings(){
        this.servings = 4
    }

    updateServings(type) {
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1
        this.ingredients.forEach(
            ing => {
                ing.count *= (newServings/this.servings)
            }
        )
        this.servings = newServings
    }

    // chaging the values of the ingredients
    changeIngredients(){
        console.log('inside chage ingredients')
        let longIngredient = ['tablespoon','tablespoons','ounce','ounces','teaspoons','teaspoon','cups','pounds']
        let shortIngreident = ['tbsp','tbsp','oz','oz','tsp','tsp','cup','pound']
        const newIngredients = this.ingredients.map( el => {
            //1). uniform units
            let ingredients = el.toLowerCase()
            longIngredient.forEach( 
                (el,i) => {
                    ingredients = ingredients.replace(el, shortIngreident[i])
                }
            )
            //2). remove parenthesis
            ingredients = ingredients.replace(/\s*\(.*?\)\s*/g, ' ')

            //3). parse
            const ingArr = ingredients.split(' ')
            let arrInd = ingArr.findIndex(
                el2 => {
                    return shortIngreident.includes(el2)
                }
            )
            
            let objIng; 
            if(arrInd > -1){
                // there is a unit 
                const arrCount = ingArr.slice(0, arrInd)
                let count 
                if(arrCount.length === 1){
                    count = eval(ingArr[0].replace('-','+'))
                }else{
                    count = eval(ingArr.slice(0,arrInd).join('+'))
                }
                objIng = {
                    count,
                    unit: ingArr[arrInd],
                    ingredients : ingArr.slice(arrInd + 1).join(' ')
                }
            } else if(parseInt(ingArr[0],10)){
                // there is no unit but the first element is a number
                objIng = {
                    count : parseInt(ingArr[0],10),
                    unit: ' ',
                    ingredients : ingArr.slice(1).join(' ')
                }
            }else if(arrInd === -1){
                // there is no unit
                objIng = {
                    count : 1,
                    unit: ' ',
                    ingredients
                }
            }


            return objIng
        })
        this.ingredients = newIngredients
    }
}