import {domValues} from './domEle'
export const getInput = () => domValues.searchInp.value;

export const renderResults = (recipes,  page = 1, itemsPerPage = 10) => {
    var start = (page - 1) * itemsPerPage
    var end = page * itemsPerPage
    recipes.slice(start,end).forEach(recipe => renderRecipe(recipe))
    pageView(page, recipes.length, itemsPerPage)
}

export const deleteInput = () => {
    domValues.searchInp.value = ''
}

export const deleteResults = () => {
    domValues.renderResults.innerHTML = ''
    domValues.resultPages.innerHTML = ''
}

export const renderLoader = (parent) => {
    console.log('inside render loader', parent)
    const loader = `
    <div class = "loader">
        <svg>
            <use href = "img/icons.svg#icon-cw"></use>
        </svg>
    </div>
    `
    parent.insertAdjacentHTML('afterbegin', loader)
}

export const clearLoader = () => {

    const loader = document.querySelector('.loader')
    if(loader) loader.parentElement.removeChild(loader)
}

const createButton = (page, type) => {
    const buttonRender = `
    <button class="btn-inline results__btn--${type}" data-goto = ${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg> 
    </button>
    `
    return buttonRender
}

// to decinde how mane pages needed
const pageView = (page, numResults, resultsPerPage) => {
    const pages = Math.ceil(numResults/resultsPerPage)
    let button;
    if(page === 1){
        button = createButton(page,'next')
    } else if (page < pages ){
        // show prev and next page
        button = `
        ${button = createButton(page,'next')}
        ${button = createButton(page,'prev')}
        `
    }else if (page === pages && pages > 1){
        // show only prev page
        button = createButton(page,'prev')
    }
    domValues.resultPages.insertAdjacentHTML('afterbegin', button)
}

const reduceTitle = (title,limit) => {
    const newTitle = []
    if(title.length > limit){
        title.split(' ').reduce(
            (acc,cur) => {
                if(acc+cur.length < limit){
                    newTitle.push(cur) 
                }
            return acc + cur.length // this will be the new acc
        }, 0)
        return `${newTitle.join(' ')}...` // join will convert the array to string. {} will consider a js inside it
    }
    return title
}

const renderRecipe = recipe => {
    const markup = `<li>
    <a class="results__link " href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="Test">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${reduceTitle(recipe.title,17)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
</li>`
domValues.renderResults.insertAdjacentHTML('beforeend', markup)

}


