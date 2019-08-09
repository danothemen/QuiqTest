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