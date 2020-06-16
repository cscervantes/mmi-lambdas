
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

                // old computation

                // if(rank <= 10 && rank > 0){
                //     console.log("Rank 1-10 : plus 100%");
                //     modifier = modifier + advalue;
                // }
                // else if(rank >= 11 && rank <= 50){
                //     console.log("Rank 11-50 : plus 75%");
                //     modifier = modifier + (advalue * 0.75);
                // }
                // else if(rank >= 51 && rank <= 100){
                //     console.log("Rank 51-100 : plus 50%");
                //     modifier = modifier + (advalue * 0.50);
                // }
                // else if(rank >= 101 && rank <= 500){
                //     console.log("Rank 101-500 : plus 40%");
                //     modifier = modifier + (advalue * 0.40);
                // }
                // else if(rank >= 501 || rank === 0){
                //     console.log("Rank 501 & up : plus 30%");
                //     modifier = modifier + (advalue * 0.30);
                // }

                // new computation

                if(rank <= 10 && rank > 0){
                    console.log("Rank 1-10 : plus 100%");
                    modifier = modifier + advalue;
                }
                else if(rank >= 11 && rank <= 20){
                    console.log("Rank 11-20 : plus 99%");
                    modifier = modifier + (advalue * 0.99);
                }
                else if(rank >= 21 && rank <= 30){
                    console.log("Rank 21-30 : plus 98%");
                    modifier = modifier + (advalue * 0.98);
                }
                else if(rank >= 31 && rank <= 40){
                    console.log("Rank 31-40 : plus 97%");
                    modifier = modifier + (advalue * 0.97);
                }
                else if(rank >= 41 && rank <= 50){
                    console.log("Rank 41-50 : plus 96%");
                    modifier = modifier + (advalue * 0.96);
                }
                else if(rank >= 51 && rank <= 60){
                    console.log("Rank 51-60 : plus 95%");
                    modifier = modifier + (advalue * 0.95);
                }
                else if(rank >= 61 && rank <= 70){
                    console.log("Rank 61-70 : plus 94%");
                    modifier = modifier + (advalue * 0.94);
                }
                else if(rank >= 71 && rank <= 80){
                    console.log("Rank 71-80 : plus 93%");
                    modifier = modifier + (advalue * 0.93);
                }
                else if(rank >= 81 && rank <= 90){
                    console.log("Rank 81-90 : plus 92%");
                    modifier = modifier + (advalue * 0.92);
                }
                else if(rank >= 91 && rank <= 100){
                    console.log("Rank 91-100 : plus 91%");
                    modifier = modifier + (advalue * 0.91);
                }
                else if(rank >= 101 && rank <= 110){
                    console.log("Rank 101-100 : plus 90%");
                    modifier = modifier + (advalue * 0.90);
                }
                else if(rank >= 111 && rank <= 120){
                    console.log("Rank 111-120 : plus 89%");
                    modifier = modifier + (advalue * 0.89);
                }
                else if(rank >= 121 && rank <= 130){
                    console.log("Rank 121-130 : plus 88%");
                    modifier = modifier + (advalue * 0.88);
                }
                else if(rank >= 131 && rank <= 140){
                    console.log("Rank 131-140 : plus 87%");
                    modifier = modifier + (advalue * 0.87);
                }
                else if(rank >= 141 && rank <= 150){
                    console.log("Rank 141-150 : plus 86%");
                    modifier = modifier + (advalue * 0.86);
                }
                else if(rank >= 151 && rank <= 160){
                    console.log("Rank 151-160 : plus 85%");
                    modifier = modifier + (advalue * 0.85);
                }
                else if(rank >= 161 && rank <= 170){
                    console.log("Rank 161-170 : plus 84%");
                    modifier = modifier + (advalue * 0.84);
                }
                else if(rank >= 171 && rank <= 180){
                    console.log("Rank 171-180 : plus 83%");
                    modifier = modifier + (advalue * 0.83);
                }
                else if(rank >= 181 && rank <= 190){
                    console.log("Rank 181-190 : plus 82%");
                    modifier = modifier + (advalue * 0.82);
                }
                else if(rank >= 191 && rank <= 200){
                    console.log("Rank 191-200 : plus 81%");
                    modifier = modifier + (advalue * 0.81);
                }
                else if(rank >= 201 && rank <= 210){
                    console.log("Rank 201-210 : plus 80%");
                    modifier = modifier + (advalue * 0.80);
                }
                else if(rank >= 211 && rank <= 220){
                    console.log("Rank 211-220 : plus 79%");
                    modifier = modifier + (advalue * 0.79);
                }
                else if(rank >= 221 && rank <= 230){
                    console.log("Rank 221-230 : plus 78%");
                    modifier = modifier + (advalue * 0.78);
                }
                else if(rank >= 231 && rank <= 240){
                    console.log("Rank 231-240 : plus 77%");
                    modifier = modifier + (advalue * 0.77);
                }
                else if(rank >= 241 && rank <= 250){
                    console.log("Rank 241-250 : plus 76%");
                    modifier = modifier + (advalue * 0.76);
                }
                else if(rank >= 251 && rank <= 260){
                    console.log("Rank 251-260 : plus 75%");
                    modifier = modifier + (advalue * 0.75);
                }
                else if(rank >= 261 && rank <= 270){
                    console.log("Rank 261-270 : plus 74%");
                    modifier = modifier + (advalue * 0.74);
                }
                else if(rank >= 271 && rank <= 280){
                    console.log("Rank 271-280 : plus 73%");
                    modifier = modifier + (advalue * 0.73);
                }
                else if(rank >= 281 && rank <= 290){
                    console.log("Rank 281-290 : plus 72%");
                    modifier = modifier + (advalue * 0.72);
                }
                else if(rank >= 291 && rank <= 300){
                    console.log("Rank 291-300 : plus 71%");
                    modifier = modifier + (advalue * 0.71);
                }
                else if(rank >= 301 && rank <= 310){
                    console.log("Rank 301-310 : plus 70%");
                    modifier = modifier + (advalue * 0.70);
                }
                else if(rank >= 311 && rank <= 320){
                    console.log("Rank 311-320 : plus 69%");
                    modifier = modifier + (advalue * 0.69);
                }
                else if(rank >= 321 && rank <= 330){
                    console.log("Rank 321-330 : plus 68%");
                    modifier = modifier + (advalue * 0.68);
                }
                else if(rank >= 331 && rank <= 340){
                    console.log("Rank 331-340 : plus 67%");
                    modifier = modifier + (advalue * 0.67);
                }
                else if(rank >= 341 && rank <= 350){
                    console.log("Rank 341-350 : plus 66%");
                    modifier = modifier + (advalue * 0.66);
                }
                else if(rank >= 351 && rank <= 360){
                    console.log("Rank 351-360 : plus 65%");
                    modifier = modifier + (advalue * 0.65);
                }
                else if(rank >= 361 && rank <= 370){
                    console.log("Rank 361-370 : plus 64%");
                    modifier = modifier + (advalue * 0.64);
                }
                else if(rank >= 371 && rank <= 380){
                    console.log("Rank 371-380 : plus 63%");
                    modifier = modifier + (advalue * 0.63);
                }
                else if(rank >= 381 && rank <= 390){
                    console.log("Rank 381-390 : plus 62%");
                    modifier = modifier + (advalue * 0.62);
                }
                else if(rank >= 391 && rank <= 400){
                    console.log("Rank 391-400 : plus 61%");
                    modifier = modifier + (advalue * 0.61);
                }
                else if(rank >= 401 && rank <= 410){
                    console.log("Rank 401-410 : plus 60%");
                    modifier = modifier + (advalue * 0.60);
                }
                else if(rank >= 411 && rank <= 420){
                    console.log("Rank 411-420 : plus 59%");
                    modifier = modifier + (advalue * 0.59);
                }
                else if(rank >= 421 && rank <= 430){
                    console.log("Rank 421-430 : plus 58%");
                    modifier = modifier + (advalue * 0.58);
                }
                else if(rank >= 431 && rank <= 440){
                    console.log("Rank 431-440 : plus 57%");
                    modifier = modifier + (advalue * 0.57);
                }
                else if(rank >= 441 && rank <= 450){
                    console.log("Rank 441-450 : plus 56%");
                    modifier = modifier + (advalue * 0.56);
                }
                else if(rank >= 451 && rank <= 460){
                    console.log("Rank 451-460 : plus 55%");
                    modifier = modifier + (advalue * 0.55);
                }
                else if(rank >= 461 && rank <= 470){
                    console.log("Rank 461-470 : plus 54%");
                    modifier = modifier + (advalue * 0.54);
                }
                else if(rank >= 471 && rank <= 480){
                    console.log("Rank 471-480 : plus 53%");
                    modifier = modifier + (advalue * 0.53);
                }
                else if(rank >= 481 && rank <= 490){
                    console.log("Rank 481-490 : plus 52%");
                    modifier = modifier + (advalue * 0.52);
                }
                else if(rank >= 491 && rank <= 500){
                    console.log("Rank 491-500 : plus 51%");
                    modifier = modifier + (advalue * 0.51);
                }
                else if(rank >= 501 && rank <= 510){
                    console.log("Rank 501-510 : plus 50%");
                    modifier = modifier + (advalue * 0.50);
                }
                else if(rank >= 511 && rank <= 520){
                    console.log("Rank 501-510 : plus 49%");
                    modifier = modifier + (advalue * 0.49);
                }
                else if(rank >= 521 && rank <= 530){
                    console.log("Rank 401-410 : plus 48%");
                    modifier = modifier + (advalue * 0.48);
                }
                else if(rank >= 531 && rank <= 540){
                    console.log("Rank 531-540 : plus 47%");
                    modifier = modifier + (advalue * 0.47);
                }
                else if(rank >= 541 && rank <= 550){
                    console.log("Rank 541-550 : plus 46%");
                    modifier = modifier + (advalue * 0.46);
                }
                else if(rank >= 551 && rank <= 560){
                    console.log("Rank 551-560 : plus 45%");
                    modifier = modifier + (advalue * 0.45);
                }
                else if(rank >= 561 && rank <= 570){
                    console.log("Rank 561-570 : plus 44%");
                    modifier = modifier + (advalue * 0.44);
                }
                else if(rank >= 571 && rank <= 580){
                    console.log("Rank 571-580 : plus 43%");
                    modifier = modifier + (advalue * 0.43);
                }
                else if(rank >= 581 && rank <= 590){
                    console.log("Rank 581-590 : plus 42%");
                    modifier = modifier + (advalue * 0.42);
                }
                else if(rank >= 591 && rank <= 600){
                    console.log("Rank 591-600 : plus 41%");
                    modifier = modifier + (advalue * 0.41);
                }
                else if(rank >= 601 && rank <= 610){
                    console.log("Rank 601-610 : plus 40%");
                    modifier = modifier + (advalue * 0.40);
                }
                else if(rank >= 611 && rank <= 620){
                    console.log("Rank 611-620 : plus 39%");
                    modifier = modifier + (advalue * 0.39);
                }
                else if(rank >= 621 && rank <= 630){
                    console.log("Rank 621-630 : plus 38%");
                    modifier = modifier + (advalue * 0.38);
                }
                else if(rank >= 631 && rank <= 640){
                    console.log("Rank 631-640 : plus 37%");
                    modifier = modifier + (advalue * 0.37);
                }
                else if(rank >= 641 && rank <= 650){
                    console.log("Rank 641-650 : plus 36%");
                    modifier = modifier + (advalue * 0.36);
                }
                else if(rank >= 651 && rank <= 660){
                    console.log("Rank 651-660 : plus 35%");
                    modifier = modifier + (advalue * 0.35);
                }
                else if(rank >= 661 && rank <= 670){
                    console.log("Rank 661-670 : plus 34%");
                    modifier = modifier + (advalue * 0.34);
                }
                else if(rank >= 671 && rank <= 680){
                    console.log("Rank 671-680 : plus 33%");
                    modifier = modifier + (advalue * 0.33);
                }
                else if(rank >= 681 && rank <= 690){
                    console.log("Rank 681-690 : plus 32%");
                    modifier = modifier + (advalue * 0.32);
                }
                else if(rank >= 691 && rank <= 700){
                    console.log("Rank 691-700 : plus 31%");
                    modifier = modifier + (advalue * 0.31);
                }
                else if(rank >= 701 && rank <= 710){
                    console.log("Rank 701-710 : plus 30%");
                    modifier = modifier + (advalue * 0.30);
                }
                else if(rank >= 711 && rank <= 720){
                    console.log("Rank 711-720 : plus 29%");
                    modifier = modifier + (advalue * 0.29);
                }
                else if(rank >= 721 && rank <= 730){
                    console.log("Rank 721-730 : plus 28%");
                    modifier = modifier + (advalue * 0.28);
                }
                else if(rank >= 731 && rank <= 740){
                    console.log("Rank 731-740 : plus 27%");
                    modifier = modifier + (advalue * 0.27);
                }
                else if(rank >= 741 && rank <= 750){
                    console.log("Rank 741-750 : plus 26%");
                    modifier = modifier + (advalue * 0.26);
                }
                else if(rank >= 751 && rank <= 760){
                    console.log("Rank 751-760 : plus 25%");
                    modifier = modifier + (advalue * 0.25);
                }
                else if(rank >= 761 && rank <= 770){
                    console.log("Rank 761-770 : plus 24%");
                    modifier = modifier + (advalue * 0.24);
                }
                else if(rank >= 771 && rank <= 780){
                    console.log("Rank 771-780 : plus 23%");
                    modifier = modifier + (advalue * 0.23);
                }
                else if(rank >= 781 && rank <= 790){
                    console.log("Rank 781-790 : plus 22%");
                    modifier = modifier + (advalue * 0.22);
                }
                else if(rank >= 791 && rank <= 800){
                    console.log("Rank 791-800 : plus 21%");
                    modifier = modifier + (advalue * 0.21);
                }
                else if(rank >= 801 && rank <= 810){
                    console.log("Rank 801-810 : plus 20%");
                    modifier = modifier + (advalue * 0.20);
                }
                else if(rank >= 811 && rank <= 820){
                    console.log("Rank 811-820 : plus 19%");
                    modifier = modifier + (advalue * 0.19);
                }
                else if(rank >= 821 && rank <= 830){
                    console.log("Rank 821-830 : plus 18%");
                    modifier = modifier + (advalue * 0.18);
                }
                else if(rank >= 831 && rank <= 840){
                    console.log("Rank 831-840 : plus 17%");
                    modifier = modifier + (advalue * 0.17);
                }
                else if(rank >= 841 && rank <= 850){
                    console.log("Rank 841-850 : plus 16%");
                    modifier = modifier + (advalue * 0.16);
                }
                else if(rank >= 851 && rank <= 860){
                    console.log("Rank 851-860 : plus 15%");
                    modifier = modifier + (advalue * 0.15);
                }
                else if(rank >= 861 && rank <= 870){
                    console.log("Rank 861-870 : plus 14%");
                    modifier = modifier + (advalue * 0.14);
                }
                else if(rank >= 871 && rank <= 880){
                    console.log("Rank 871-880 : plus 13%");
                    modifier = modifier + (advalue * 0.13);
                }
                else if(rank >= 881 && rank <= 890){
                    console.log("Rank 881-890 : plus 12%");
                    modifier = modifier + (advalue * 0.12);
                }
                else if(rank >= 891 && rank <= 900){
                    console.log("Rank 891-900 : plus 11%");
                    modifier = modifier + (advalue * 0.11);
                }
                else if(rank >= 901 && rank <= 910){
                    console.log("Rank 901-910 : plus 10%");
                    modifier = modifier + (advalue * 0.10);
                }
                else if(rank >= 911 && rank <= 920){
                    console.log("Rank 911-920 : plus 9%");
                    modifier = modifier + (advalue * 0.09);
                }
                else if(rank >= 921 && rank <= 930){
                    console.log("Rank 921-930 : plus 8%");
                    modifier = modifier + (advalue * 0.08);
                }
                else if(rank >= 931 && rank <= 940){
                    console.log("Rank 931-940 : plus 7%");
                    modifier = modifier + (advalue * 0.07);
                }
                else if(rank >= 941 && rank <= 950){
                    console.log("Rank 941-950 : plus 6%");
                    modifier = modifier + (advalue * 0.06);
                }
                else if(rank >= 951 && rank <= 960){
                    console.log("Rank 951-960 : plus 5%");
                    modifier = modifier + (advalue * 0.05);
                }
                else if(rank >= 961 && rank <= 970){
                    console.log("Rank 961-970 : plus 4%");
                    modifier = modifier + (advalue * 0.04);
                }
                else if(rank >= 971 && rank <= 980){
                    console.log("Rank 971-980 : plus 3%");
                    modifier = modifier + (advalue * 0.03);
                }
                else if(rank >= 981 && rank <= 990){
                    console.log("Rank 981-990 : plus 2%");
                    modifier = modifier + (advalue * 0.02);
                }
                else if(rank >= 991 && rank <= 1000){
                    console.log("Rank 991-1000 : plus 1%");
                    modifier = modifier + (advalue * 0.01);
                }
                else if(rank >= 1000 || rank === 0){
                    console.log("Rank 1000 & up or Rank 0: plus 1%");
                    modifier = modifier + (advalue * 0.01);
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