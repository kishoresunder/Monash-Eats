import uniqId from 'uniqid'
export default class ShoppingList {

    constructor(list){
        this.list = []
    }

    addItems(count, unit, ingredients){
        const listItems = {
            id: uniqId(),
            count,
            unit,
            ingredients
        }
        console.log('lsitItems',listItems)
        this.list.push(listItems)
        return listItems
    }

    deleteItems(id){
        const index = this.list.findIndex(
            el => el.id === id
        )
        //[2,3,4] splice(1,2) => will return [3,4], the final array is [2]
        //[2,3,4] slice(1,2) => will return [3], the final array is [2,3,4]
        this.list.splice(index,1)
    }

    updateCount(id, newCount){
        this.list.find( el => el.id === id).count = newCount
    }
}