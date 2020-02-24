import axios from 'axios'
export default class Search {
    constructor(queryParam){
        this.queryParam = queryParam
    }

    //method in the class
    async getVal(queryParam){
        try{
            const res = await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.queryParam}`);
            this.result = res.data.recipes
        }catch(err){
            alert(err)
        }
    }
}

