
class MediaValue {
    constructor(globalRank, localRank, websiteCost, text, image, video){
        this._globalRank = globalRank || 0
        this._localRank = localRank || 0
        this._websiteCost = websiteCost || 300
        this._text = text
        this._images = image
        this._videos = video
    }

    async Rank(){
        const localRank = this._localRank
        const globalRank = this._localRank
        const p = new Promise((resolve, reject)=>{
            try {
                let rank = 0
                if(localRank > 0){
                    rank = localRank
                }else if(globalRank > 0){
                    rank = globalRank
                }
                resolve(rank)
            } catch (error) {
                reject(0)
            }
        })
        return p
    }

    async Pubcost(){
        const rank = await this.Rank()
        const websiteCost = this._websiteCost
        const p = new Promise((resolve, reject)=>{
            try {
                let pubcost = 0
                if(websiteCost > 0){
                    pubcost = websiteCost
                }

                if(rank >= 501 || rank === 0){
                    pubcost = 180
                }
                resolve(pubcost)
            } catch (error) {
                reject(0)
            }
        })
        return p
    }

    async WordCount(){
        const textLength = this._text.split(' ').filter(v=>v).length
        const imageLength = this._images.length
        
        const p = new Promise((resolve, reject)=>{
            try {
                let wordcount = textLength
                if(imageLength > 0){
                    wordcount = wordcount + 100
                }

                if(wordcount === 1000){
                    wordcount = 1000
                }
                resolve(wordcount)
            } catch (error) {
                reject(0)
            }
        })
        return p
    }

    async AdValue(){
        const pubcost = await this.Pubcost()
        const wordcount = await this.WordCount()
        const p = new Promise((resolve, reject)=>{
            try {
                let advalue = wordcount * pubcost
                resolve(advalue)
            } catch (error) {
                reject(0)
            }
        })
        return p
    }

    async PrValue(){
        const advalue = await this.AdValue()
        const rank = await this.Rank()
        const videoLength = this._videos.length
        const p = new Promise((resolve, reject)=>{
            try {
                let modifier = 0
                if(rank <= 10 && rank > 0){
                    console.log("Rank 1-10 : plus 100%");
                    modifier = modifier + advalue;
                }
                else if(rank >= 11 && rank <= 50){
                    console.log("Rank 11-50 : plus 75%");
                    modifier = modifier + (advalue * 0.75);
                }
                else if(rank >= 51 && rank <= 100){
                    console.log("Rank 51-100 : plus 50%");
                    modifier = modifier + (advalue * 0.50);
                }
                else if(rank >= 101 && rank <= 500){
                    console.log("Rank 101-500 : plus 40%");
                    modifier = modifier + (advalue * 0.40);
                }
                else if(rank >= 501 || rank === 0){
                    console.log("Rank 501 & up : plus 30%");
                    modifier = modifier + (advalue * 0.30);
                }
    
                // Video
    
                if(videoLength > 0){
                    console.log("Has video: plus 20%");
                    modifier = modifier + (advalue * 0.20);
                }
    
                const prvalue = advalue + modifier;                
                resolve(prvalue)
            } catch (error) {
                reject(0)
            }
        })
        return p
    }
}

module.exports = async function(globalRank, localRank, websiteCost, text, images, videos){
    const p = new Promise(async(resolve, reject) => {
        try {
            const mediaValue = new MediaValue(globalRank, localRank, websiteCost, text, images, videos)
            const advalue = await mediaValue.AdValue()
            const prvalue = await mediaValue.PrValue()
            const wordcount = await mediaValue.WordCount()
            const rank = await mediaValue.Rank()
            const pubcost = await mediaValue.Pubcost()
            console.log('Rank', rank)
            console.log('Word Count', wordcount)
            console.log('Pubcost', pubcost)
            console.log('Ad Value', advalue)
            console.log('Pr Value', prvalue)
            resolve({advalue, prvalue})
        } catch (error) {
            console.log(error)
            reject({
                "advalue": 0,
                "prvalue": 0
            })
        }
    })
    return p
}