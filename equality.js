function log(toLog){
    //only log if the verbose environment variable is set
    if(process.env.VERBOSE == 1){
        console.log(toLog);
    }
}
module.exports = {
    Similarity(obj1,obj2){
        //Note: Arrays should never be passed into this function, also need to do null checking here because Object.keys doesn't like null values
        if(typeof obj1 != 'object' || typeof obj2 != 'object' || obj2 == null || obj1 == null){
            //possible score here is two because we can't check if the key exists
            let toReturn = {score:0,possibleScore:2};
            let sameType = typeof(obj1) == typeof(obj2);
            if(sameType){
                toReturn.score++;
                log(`primitive ${obj1} is same type as ${obj2}`);
            }
            if(obj1 === obj2){
                toReturn.score++;
                log(`primitive ${obj1} is same as ${obj2}`);
            }
            else{
                log("Same Type But Not Equal");
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
                log(`Point added for key ${key} existing in both objects`);
                score.score++;
                score.possibleScore++;
                //add score for type matching; we will differentiate between "objects" and arrays here
                if(typeof(obj1[key]) == typeof(obj2[key]) && Array.isArray(obj1[key]) == Array.isArray(obj2[key])){
                    log(`Type of key ${key} is the same in both objects`);
                    score.score++;
                    score.possibleScore++;
                    //if array or object calculate similarity 
                    if(typeof(obj1[key]) == 'object' && (Array.isArray(obj1[key]) || Array.isArray(obj2[key]))){
                        //Compare arrays
                        log(`Comparing Arrays for key ${key}`);
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
                        log(`Score for Key ${key} is ${JSON.stringify(score)}`);
                    }
                    else if(typeof(obj1[key]) == 'object'){
                        //if the type is an object recursively run this function to account for possible similarities in nested objects
                        let simScore = this.Similarity(obj1[key],obj2[key]);
                        log(`Similarity for key ${key} is ${JSON.stringify(score)}`);
                        score.score += simScore.score;
                        score.possibleScore += simScore.possibleScore;
                    }
                    else if(obj1[key] == obj2[key]){
                        //values are equal
                        log(`point added for key ${key} because value matched`);
                        score.score++;
                        score.possibleScore++;
                    }
                    else{
                        log(`point not added for key ${key}`);
                        score.possibleScore++;
                    }
                }
                else{
                    //increment possible score, types don't match
                    log(`Types don't match for key ${key}`);
                    score.possibleScore++;
                }
            }
            else{
                //increment possible score, one of the objects contains a key the other does not.
                log(`On object contains key: ${key} and the other does not`);
                score.possibleScore++;
            }
            return score;
        },{score:0,possibleScore:0});
    },
    //sort object only necessary for string comparison as "Deep Equal"
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
        //just compare stringified json objects after sorting
        return JSON.stringify(sorted1) == JSON.stringify(sorted2);
    },
    GetSimilarity(obj1,obj2){
        //similarity score
        let score = 1.0;

        //if objects are equal return 1, deep equal is no longer necessary but I've left it here anyway in accordance with the advice that equality be determined first.
        if(this.DeepEqual(obj1,obj2)){
            log("Objects Are Equal");
            return score;
        }
        //if comparing two items that are not objects, need to return 0
        if(typeof(obj1) != typeof(obj2)){
            log("Objects are not same type, similarity score is 0");
            return 0;
        }
        let calculated = this.Similarity(obj1,obj2);
        log(calculated);
        return calculated.score/calculated.possibleScore;
        
    }
}