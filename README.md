# TreeGrid AngularJs-1 plugin
This table will implement tree data structure in a properly indented way and also allows to take CRUD operations via ajax calls.

<div >
<h3> Features </h3>
<ul>
<li> Show tree data structure in the form of table. </li>
<li> Perform all the CRUD operations on data rows. </li>
<li> Add new new nodes on root level. </li>
<li> Add child nodes to any node. </li>
<li> Toggle complete tree structure in just one click. </li>
<li> Sync all data from server using ajax calls </li>
<li> Easily customize for your needs </li>
</ul>
</div >

<div >
<h3> Usage </h3>
<p> Use this plugin to show your tree data structure in a user friendly way and do CRUD operations on your data and sync them on server using ajax calls. As it is written using angularjs-1 all the data binding and flow of code is so clear and easy.
</p>
</div >

<div >
<h3> How it works? </h3>
<p> I used simple concept to implement this table, just change your complex tree data structure to simple one dimentional array and use angular's ng-repeat to repeat this array. Each node in this array contains parent id and level info, which is used to show each node at proper place and indent it properly.
eg. 
</p>
<p>
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
</p>
<p> <b> Convert this tree data structure to the following one dimentional array </b> </p>

<p>
var oneDArray = [
{
name : aptitude, 
id : 123,
level : 0,
indentClass : "indent-0",
parentId : -1
},
{
name : aptitude, 
id : 123,
level : 0,
indentClass : "indent-1"
parentId : 123
},
{
name : aptitude, 
id : 123,
level : 0,
indentClass : "indent-1",
parentId : 123
}
]
</p>

<p>
This oneDArray contains all the info to show tree data structure in a table with proper parent child relationship and indentation.

<ul>
<li> level : it will show the node depth </li>
<li> indentClass : it will indent rows according to node depth </li>
<li> parentId : it will help to show which node have to show under which node. </li>
</ul>
</p>
<h3> Working example </h3>
<p> http://jsfiddle.net/Aditya199121/y0te91dm/1/ </p>
</div >
