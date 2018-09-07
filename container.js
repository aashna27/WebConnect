const dependable = require('dependable');
const path = require('path');

const container = dependable.container();  // method that creates container ,its part of dependable module

const simpleDependencies = [
    ['_','lodash'],
    ['async','async'],
    ['Group','./models/group'],
    ['Users','./models/user'],
];

simpleDependencies.forEach(function(val){
    container.register(val[0],function(){
        return require(val[1]);
    })
}); 

container.load(path.join(__dirname,'/controllers'));  
container.load(path.join(__dirname,'/helpers'));
/*
 these are so that any of the methods we create in files within these folders 
 can be used by other files without having to individually 
and repeatedly import the files from that folder
*/

container.register('container',function(){
    return container;
});

module.exports = container;