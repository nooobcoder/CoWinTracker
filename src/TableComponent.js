var React = require('react');
//You need this npm package to do createReactClass
var createReactClass = require('create-react-class');
var items = [
    { name: 'Louise', age: 27, color: 'red' },
    { name: 'Margaret', age: 15, color: 'blue'},
    { name: 'Lisa', age:34, color: 'yellow'}
];
module.exports=tableComponent({
    render:function(){
        return(
            <JsonTable rows={ items } />
        )
    }
