module.exports = {
    Similarity(obj1,obj2){
        //Note: Arrays should never be passed into this function, also need to do null checking here because Object.keys doesn't like null values
        if(typeof obj1 != 'object' || typeof obj2 != 'object' || obj2 == null || obj1 == null){
            //possible score here is two because we can't check if the key exists
            let toReturn = {score:0,possibleScore:2};
            let sameType = typeof(obj1) == typeof(obj2);
            toReturn.score = sameType ? 1 : 0;
            if(obj1 == obj2){
                toReturn.score++;
            }
            return toReturn;
        }

        //get keys of each object and set of unique keys between the two objects
        let keys1 = Object.keys(obj1);
        let keys2 = Object.keys(obj2);
        let uniqueKeys = new Set(keys1.concat(keys2));
        // a point is given each for key, type and value, spread set back into array for reduce
        return [...uniqueKeys].reduce((score,key,i)=>{
            if(keys1.includes(key) && keys2.includes(key)){
                //add point for key matching
                score.score++;
                //add score for type matching
                if(typeof(obj1[key]) == typeof(obj2[key])){
                    //we will differentiate between "objects" and arrays here
                    if(typeof(obj1[key]) == 'object'){
                        if(Array.isArray(obj1[key]) == Array.isArray(obj2[key])){
                            score.score++;
                        }
                    }
                    else{
                        score.score++;
                    }
                    //if array or object calculate similarity 
                    if(typeof(obj1[key]) == 'object' && (Array.isArray(obj1[key]) || Array.isArray(obj2[key]))){
                        //Compare arrays
                        console.log(`Comparing Arrays for key ${key}`);
                        let longest = null;
                        //if we're comparing two arrays map the longest one, otherwise map the one that is an array
                        if(Array.isArray(obj1[key]) && Array.isArray(obj2[key])){
                            longest = obj1[key].length > obj2[key].length ? obj1[key] : obj2[key];
                        }
                        else if(Array.isArray(obj2[key])){
                            longest = obj2[key];
                        }
                        else{
                            longest = obj1[key];
                        }
                        let scores = longest
                            .map((value,index) =>{
                                return this.Similarity(obj1[key][index],obj2[key][index]);
                            })
                            .reduce((arrScores,scoreObj)=>{
                                arrScores.score += scoreObj.score;
                                arrScores.possibleScore += scoreObj.possibleScore;
                                return arrScores;
                            },{score:0,possibleScore:0});
                        score.score += scores.score;
                        score.possibleScore += scores.possibleScore;
                        console.log(`Score for Key ${key} is ${JSON.stringify(score)}`);
                    }
                    else if(typeof(obj1[key]) == 'object'){
                        //if the type is an object recursively run this function to account for possible similarities in nested objects
                        let simScore = this.Similarity(obj1[key],obj2[key]);
                        score.score += simScore.score;
                        score.possibleScore += simScore.score;
                    }
                    else if(obj1[key] == obj2[key]){
                        score.score++;
                    }
                }
            }
            score.possibleScore+=3;
            return score;
        },{score:0,possibleScore:0});
    },
    KeysEqual(obj1,obj2){
        let keys1 = Object.keys(obj1);
        let keys2 = Object.keys(obj2);
        if(keys1.length != keys2.length){
            return false;
        }
        let sameSetOfKeys = keys1.every((key)=>keys2.includes(key)) && keys2.every((key)=>keys1.includes(key));
        return sameSetOfKeys;
    },
    SortObject:function(object){
        if(object == null || object == undefined){
            return object;
        }

        return Object.keys(object)
        .sort()
        .reduce((sorted,key) => {
            if(typeof(object[key]) == 'object' && Array.isArray(object[key])){
                //sort nested objects in arrays too, but don't change order of array
                sorted[key] = object[key].map(item => {
                    if(typeof item == 'object'){
                        return this.SortObject(item);
                    }
                    else{
                        return item;
                    }
                });
            }
            else if(typeof(object[key]) == 'object'){
                //sort nested objects too
                sorted[key] = this.SortObject(object[key]);
            }
            else{
                sorted[key] = object[key];
            }
            return sorted;
        },{});
    },
    DeepEqual: function(obj1, obj2){
        //sort objects by key so that string comparison works for equality comparison
        let sorted1 = this.SortObject(obj1);
        let sorted2 = this.SortObject(obj2);
        
        return JSON.stringify(sorted1) == JSON.stringify(sorted2);
    },
    GetSimilarity(obj1,obj2){
        //similarity score
        let score = 1.0;

        //if objects are equal return 1
        // if(this.DeepEqual(obj1,obj2)){
        //     console.log("Objects Are Equal");
        //     return score;
        // }
        if(typeof(obj1) != typeof(obj2)){
            console.log("Objects are not same type, similarity score is 0");
            return 0;
        }
        let calculated = this.Similarity(obj1,obj2);
        console.log(calculated);
        
    }
}