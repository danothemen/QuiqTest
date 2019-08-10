const equality = require("../equality");
const assert = require('assert');
describe("Test Deep Equal",function(){
    it("Equal Objects Returns True",function(){
        let obj1 = {"key1":"key1","key2":"key2","key3":"key3"};
        let obj2 = {"key1":"key1","key2":"key2","key3":"key3"};
        let isEqual = equality.DeepEqual(obj1,obj2);
        if(!isEqual){
            assert.fail("Equal Objects results in a not equal result");
        }
    });

    it("Equal Objects with different key order Returns True",function(){
        let obj1 = {"key1":"key1","key2":"key2","key3":"key3"};
        let obj2 = {"key2":"key2","key1":"key1","key3":"key3"};
        let isEqual = equality.DeepEqual(obj1,obj2);
        if(!isEqual){
            assert.fail("Equal Objects results in a not equal result");
        }
    });
});

describe("Test Similarity",function(){
    let obj1 = {
        "key1":{
            "key1":"key1",
            "key2":2,
            "key3":false
        },
        "key2":[{
            "key1":"key1",
            "key2":2,
            "key3":false
            },
            {
                "key1":"key1",
                "key2":2,
                "key3":false
            },
            {
                "key1":"key1",
                "key2":2,
                "key3":false
            }],
        "key3":"key3"
    }

    let obj2 = {
        "key1":{
            "key1":"key1",
            "key2":2,
            "key3":false
        },
        "key2":[{
            "key1":"key1",
            "key2":2,
            "key3":false
            },
            {
                "key1":"key1",
                "key2":2,
                "key3":false
            },
            {
                "key1":"key1",
                "key2":2,
                "key3":false
            }],
        "key3":"key3"
    }

    let obj3 = {
        "key1":{
            "key1":"key1",
            "key2":2,
            "key3":false
        },
        "key2":[{
            "key1":"key1",
            "key2":2,
            "key3":false
            },
            {
                "key1":"key1",
                "key2":2,
                "key3":false
            },
            {
                "key1":"key2",
                "key2":2,
                "key3":false
            }],
        "key3":"key4"
    }

    it("Equal Objects Return 1",function(){
        let score = equality.GetSimilarity(obj1,obj2);
        if(score != 1){
            assert.fail("Equal Objects results in score not equal to 1");
        }
    });

    it("Values of different type return 0",function(){
        let score = equality.GetSimilarity(obj1,35);
        if(score > 1){
            assert.fail("Should have returned 0 comparing object and int");
        }
    });

    it("Similar Objects should return a value > 0 and < 1",function(){
        let score = equality.GetSimilarity(obj1,obj3);
        if(!(score > 0 && score < 1)){
            assert.fail(`Similar objects returned score: ${score} which was not between 0 and 1`);
        }
    });
});

describe("Test Similarity",function(){
    let obj1 = {
        "key1":{
            "key1":"key1",
            "key2":2,
            "key3":false
        },
        "key2":[{
            "key1":"key1",
            "key2":2,
            "key3":false
            },
            {
                "key1":"key1",
                "key2":2,
                "key3":false
            },
            {
                "key1":"key1",
                "key2":2,
                "key3":false
            }],
        "key3":"key3"
    }

    let obj2 = {
        "key1":{
            "key1":"key1",
            "key2":2,
            "key3":false
        },
        "key2":[{
            "key1":"key1",
            "key2":2,
            "key3":true
            },
            {
                "key1":"key1",
                "key2":2,
                "key3":true
            },
            {
                "key1":"key1",
                "key2":2,
                "key3":true
            }],
        "key3":"key3"
    }
    it("Possible Score is Correct",function(){
        //expected possible score is 43, 15 points for key matches, 15 points for type matches, 13 points for value matches
        let score = equality.Similarity(obj1,obj2);
        if(!score.possibleScore == 43){
            assert.fail(`Possible Score for test objects should have been 43 but was ${score.possibleScore}`);
        }
    });
    it("Score on test objects is 40",function(){
        //expected score is 40, 15 points for key matches, 15 points for type matches, 10 points for value matches
        let score = equality.Similarity(obj1,obj2);
        if(!score.score == 40){
            assert.fail(`Score for test objects should have been 40 but was ${score.score}`);
        }
    })
});