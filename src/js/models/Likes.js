export default class Likes  {


    constructor(){
        this.likes = []
    }

    addLike(id,title,author,img){
        const like = {id,title,author,img}
        this.likes.push(like)
        return like
    }

    removeLikes(id){
        const index = this.likes.findIndex(
            el => {
                return el.id === id
            }
        )
        this.likes.splice(index, 1)
    }

    isLiked(id){
        return this.likes.findIndex(el => el.id === id ) !== -1
    }

    getNumberOfLikes(){
        return this.likes.length
    }
}