# TreeGrid AngularJs-1 plugin
This table will implement tree data structure in a properly indented way and also allows to take basic operation like create, edit and delete operations with sync functionality with server using ajax calls.

### Features
1. Show tree data structure in the form of a table.
2. Add new nodes on root level.
3. Add child nodes to any node.
4. Edit/delete any node.
5. Expand/collapse all nodes with just one click.
6. Update all data with server using ajax calls.

### Usage
Use this plugin to show your tree data structure in a user friendly way using collapsible bootstrap table. Perform operations on your data and sync them on server using ajax calls.

### How it works?
It uses simple concept of converting your tree data structure into 1-D array, just change your complex tree data structure to simple one dimentional array and use angular's ng-repeat to show this array. Each node in this array contains parent id and level/depth info, which is used to show each node at proper place and indent it.
eg.
```
var treeDS = [
{
name : aptitude,
id : 123,
childNodes : [
                 {
                      name : time and work,
                      id : 125
                 },
                 {
                      name : problem on trains,
                      id : 127
                 }
             ]
}
]
```

###### Convert this tree data structure to the following one dimentional array
```
var oneDArray = [
{
name : aptitude,
id : 123,
level : 0,
indentClass : "indent-0",
parentId : -1
},
{
name : time and work,
id : 125,
level : 1,
indentClass : "indent-1"
parentId : 123
},
{
name : problem on trains,
id : 127,
level : 1,
indentClass : "indent-1",
parentId : 123
}
]
```

This oneDArray contains all the info to show tree data structure in a table with proper parent child relationship and indentation.

* level : it represents node depth.
* indentClass : it will indent rows according to node depth.
* parentId : it will help to show which node have to show under which node.

### Working example
[Working example on js-fiddle](http://jsfiddle.net/Aditya199121/y0te91dm/1/)
### On github
[See on github](https://github.com/chhikaradi21/tree-table)