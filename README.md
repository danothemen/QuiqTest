# Quiq JSON Object Comparison

This software generates a comparison score between two json objects and takes two json files as positional arguments like so:

```
node index.js data\BreweriesMaster.json data\BreweriesMaster.json
```

There is an included script for comparing all of the sample data provided called runall.ps1

To view addtional information about the comparison set the environment variable VERBOSE=1 like so (assuming powershell is your shell):

```
$env:VERBOSE=1; ./runall.ps1
```

There are two key assumptions made in this program about arrays. The first is that no JSON file provided as an argument will contain only an array as the outer most object, the second is that no value in the JSON document will be an array of arrays.

The score is calculated by awarding a point for each key, type an value that matches in both objects and dividing the result by total possible points that could have been awarded

To run this program NodeJS is required, this was developer with v11.12.0
If you'd like to run the unit tests for this program (mocha) run:
```
npm install
```
After that installs mocha and it's dependencies the tests can be run with the following command:
```
npm test
```