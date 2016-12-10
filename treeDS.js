/**
 * Created by Aditya on 15/10/2015.
 */
'use strict';

var app = angular.module('treeDataStructureApp',[]);
    app.controller('treeDataStructureCtrl', ['$scope',function ($scope){
        
    // add new node at top level here
        $scope.isAddExamNode = false;
        $scope.addNewNodeAtRootLevel = function(){
            $scope.isAddExamNode = true;
            var newNode = {
                        name: "new node",
                        id : "",
                        level: 0,
                        parent: "root",
                        toggleStatus : false,
                        parentId : -1,
                        isShow: true,
                        isEditable : false,
                        childCount: 0,
                        isSaveBtn : false,
                        isShowMessage : false,
                        type : "exam"
                    };
           $scope.nodesTableArr.unshift(newNode);   
        };

        // add new node.
        $scope.operationStatusMessage = "";
        $scope.currentNodeSelected = {};
        var uniqueIdForNewNodes = 0;
        $scope.addChildNode = function(node){
            // add row to table.
            $scope.operationStatusMessage = "";
            $scope.currentNodeSelected = node;
            for (var i = 0; i < $scope.nodesTableArr.length; i++) {
                if($scope.nodesTableArr[i].id === node.id){
                    $scope.nodesTableArr.splice(i + 1, 0, {
                        name: "new node",
                        id : uniqueIdForNewNodes,
                        level: node.level + 1,
                        parent: node.name,
                        toggleStatus : false,
                        parentId : node.id,
                        isShow: true,
                        isEditable : false,
                        childCount: 0,
                        isSaveBtn : false,
                        isShowMessage : false,
                        type : "nonExam"
                    });
                    break;
                }
            }

            uniqueIdForNewNodes += 1;
        };

        $scope.saveNewNode = function(node){
            alert("You can send request on server to add this node here.");
            $scope.saveNewNodeCB();
        };

        $scope.saveNewNodeCB = function(){
                $scope.resetOperationStatusMessage();
                $scope.operationStatusMessage = "node Saved Successfully";
                $scope.currentNodeSelected.isShowMessage = true;
                $scope.currentNodeSelected.isSaveBtn = false;

                // update node id in newly added node object, so that if we add new node under it, it has its valid parent id.
                for(var i = 0 ; i < $scope.nodesTableArr.length ; i++){
                    var node = $scope.nodesTableArr[i];
                    if(node == $scope.conceptNodeToAdd)
                        node.id = response.data.node;
                }
                alert("send request to server here to save this node.");
        };

        $scope.editNode = function(node){
            $scope.nodeNameInOperation = node.name;
            $scope.operationStatusMessage = "";
            $scope.currentNodeSelected = node;
            var nodeName = prompt("Please enter New node Name", node.name);
            if(nodeName != "" && nodeName != null && node.name != undefined && nodeName != node.name){
              node.name = nodeName;
              if(node.id != ""){
                  node.isUpdateBtn = true;
              }
              else{
                  node.isSaveBtn = true;
              }
            }
        };

        $scope.updateNode = function(node){
            alert("You can send request on server to update this node.");
            $scope.updateNodeCB();
        };

        $scope.updateNodeCB = function(response){                

            $scope.resetOperationStatusMessage();
            $scope.currentNodeSelected.isShowMessage = true;
            $scope.operationStatusMessage = "node Updated Successfully";
            $scope.currentNodeSelected.isUpdateBtn = false;
        };

        // nodeType = concept/nonConcept
        $scope.nodeToDelete = {};
        $scope.deleteNode = function(node, nodeType){

            $scope.nodeNameInOperation = node.name;
            $scope.nodeTypeForMessage = nodeType;
            $scope.nodeToDelete = node;
            $scope.operationStatusMessage = "";
            $scope.currentNodeSelected = node;
            var message;
            if(node.id == ""){
                for(var i = 0 ; i < $scope.nodesTableArr.length ; i++){
                    if($scope.nodesTableArr[i] == $scope.currentNodeSelected)
                        $scope.nodesTableArr.splice(i, 1);
                }
                return 0 ;
            }
            var r = confirm("Warning! Be Carefull! On deletion all nodes under this node will be deleted.\nPress ok to delete node");
            if (r == true) {
                $scope.deleteNodeCB();
            }
            $scope.curPageNo = 1;
        };

        $scope.deleteNodeCB = function(){

          $scope.resetOperationStatusMessage();
          $scope.operationStatusMessage = "node deleted Successfully";
          $scope.currentNodeSelected.isShowMessage = true;

          for(var i = 0 ; i < $scope.nodesTableArr.length ; i++){
              if($scope.nodesTableArr[i] == $scope.currentNodeSelected)
                  $scope.nodesTableArr.splice(i, 1);
          }
        };

        $scope.resetOperationStatusMessage = function(){
            for(var i = 0 ; i < $scope.nodesTableArr.length ; i++){
                $scope.nodesTableArr[i].isShowMessage = false;
            }
        };

        // concept nodes related operations ends here

        // view related functions.
        $scope.selectIndentationClass = function(node){
            return 'level' + node.level;
        };

        $scope.hasDropdown = function(node){
            return node.childCount > 0 ? "hasDropdown" : "noDropdown";
        };

        $scope.colorBackgroundOfNewNode = function(node){
            return node.id == "";
        };


        $scope.toggleStatus = false;
        $scope.toggleDropdown = function(node){
            node.toggleStatus = node.toggleStatus == true ? false : true;
            $scope.toggleStatus = node.toggleStatus;
            $scope.toggleDropdownHelper(node.id, $scope.toggleStatus );
        };

        $scope.toggleDropdownHelper = function(parentNodeId, toggleStatus ){
            for(var i = 0 ; i < $scope.nodesTableArr.length ; i++) {
                var node = $scope.nodesTableArr[i];
                if(node.parentId == parentNodeId) {
                    if(toggleStatus == false)
                    $scope.toggleDropdownHelper(node.id, toggleStatus);
                    $scope.nodesTableArr[i].isShow = toggleStatus;
                }
            }
        };
        
        $scope.showAll = false;
        $scope.expandAll = function(){
            var  i = 0;
            $scope.showAll = $scope.showAll == true ? false : true;
            if($scope.showAll) {
                for (i = 0; i < $scope.nodesTableArr.length; i++)
                    $scope.nodesTableArr[i]['isShow'] = true;
            }
            else {
                for (i = 0; i < $scope.nodesTableArr.length; i++)
                    if($scope.nodesTableArr[i]['level'] != 0)
                      $scope.nodesTableArr[i]['isShow'] = false;
            }
        };

        $scope.nodesTableArr = [];
        $scope.initializeTable = function(treeDataArr){
            for(var i = 0 ; i < treeDataArr.length ; i++){
                var level = 0;
                var node = treeDataArr[i];
                if(node.children && node.children.length){
                    $scope.nodesTableArr.push({
                          name : node.name,
                          id : node._id,
                          parent : "root", // root : this is top level element
                          toggleStatus : false, // initially in collapsed state
                          parentId : -1, // -1 : this is a root element
                          isShow : true, // show hide row
                          isEditable : false,
                          level : level,
                          childCount : node.children.length,
                          isSaveBtn : false, // to show/hide save button
                          isUpdateBtn : false, // to show/hide update button
                          properties : node.properties // other properties you want to maintain about node
                    });
                }
                if(node.children && node.children.length) { // if node is not leaf node then call helper function again
                    $scope.initializeTableHelper(node.children, node.text, node._id, level);
                }

            }
        };

        $scope.initializeTableHelper = function(pChildArr, pParentName, pParentId, pLevel){
            var isShowNode = false;
            pLevel = pLevel + 1 ;
            for(var i = 0 ; i < pChildArr.length ; i++){
                var node = pChildArr[i];
                var childCount = node.children != undefined ? node.children.length : 0;
                $scope.nodesTableArr.push({
                    id : node._id,
                    name : node.name,
                    parent : pParentName,
                    toggleStatus : false,
                    parentId : pParentId,
                    isShow : isShowNode,
                    isEditable : false,
                    level : pLevel,
                    childCount : childCount,
                    isSaveBtn : false,
                    isUpdateBtn : false,
                    properties : node.properties
                });
                if(node.children && node.children.length) {
                    $scope.initializeTableHelper(node.children, node.text, node._id, pLevel);
                }
            }
        };

        $scope.initializeTable(sampleData)
    }]);

var sampleData = [
    {
        "_id": "557569e82a39650f65425104",
        "depth": 0,
        "name": "SBI Clerk",
        "properties" : { "exam": "SBI Clerk" },
        "children": [
            {
                "_id": "55c2dee72a3965432eaac6a7",
                "depth": 1,
                "name": "Quantitative Aptitude",
                "properties" : { "exam": "SBI Clerk" },
                "children": [
                    {
                        "_id": "55c2dee72a3965432eaac6a8",
                        "depth": 2,
                        "name": "Simplification",
                        "properties" : { "exam": "SBI Clerk" },
                        "children": [
                            {
                                "_id": "55c2dee72a3965432eaac6a9",
                                "depth": 3,
                                "name": "Bodmas Rule",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Bodmas Rule"
                            },
                            {
                                "_id": "55c2dee72a3965432eaac6aa",
                                "depth": 3,
                                "name": "Surds And Indices",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Surds And Indices"
                            },
                            {
                                "_id": "55c2dee82a3965432eaac6ab",
                                "depth": 3,
                                "name": "Approx Value",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Approx Value"
                            },
                            {
                                "_id": "55c2dee82a3965432eaac6ac",
                                "depth": 3,
                                "name": "Percennodee",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Percennodee"
                            }
                        ],
                        "type": "chapter",
                        "par": "Simplification"
                    },
                    {
                        "_id": "55c2dee82a3965432eaac6ad",
                        "depth": 2,
                        "name": "Algebra",
                        "properties" : { "exam": "SBI Clerk" },
                        "children": [
                            {
                                "_id": "55c2dee82a3965432eaac6ae",
                                "depth": 3,
                                "name": "Linear Equation In 1 Variable",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Linear Equation In 1 Variable"
                            },
                            {
                                "_id": "55c2dee82a3965432eaac6af",
                                "depth": 3,
                                "name": "Linear Equation In 2 Variable",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Linear Equation In 2 Variable"
                            },
                            {
                                "_id": "55c2dee82a3965432eaac6b0",
                                "depth": 3,
                                "name": "Quadratic Equation",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Quadratic Equation"
                            }
                        ],
                        "type": "chapter",
                        "par": "Algebra"
                    },
                    {
                        "_id": "55c2dee92a3965432eaac6b1",
                        "depth": 2,
                        "name": "Average",
                        "properties" : { "exam": "SBI Clerk" },
                        "type": "chapter",
                        "par": "Average"
                    },
                    {
                        "_id": "55c2dee92a3965432eaac6b2",
                        "depth": 2,
                        "name": "Ratio And Proportion",
                        "properties" : { "exam": "SBI Clerk" },
                        "children": [
                            {
                                "_id": "55c2dee92a3965432eaac6b3",
                                "depth": 3,
                                "name": "Simple Ratios",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Simple Ratios"
                            },
                            {
                                "_id": "55c2dee92a3965432eaac6b4",
                                "depth": 3,
                                "name": "Compound Ratios",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Compound Ratios"
                            },
                            {
                                "_id": "55c2dee92a3965432eaac6b5",
                                "depth": 3,
                                "name": "Direct or Indirect Proportion",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Direct or Indirect Proportion"
                            },
                            {
                                "_id": "55c2dee92a3965432eaac6b6",
                                "depth": 3,
                                "name": "Componendo or Dividendo",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Componendo or Dividendo"
                            },
                            {
                                "_id": "55c2dee92a3965432eaac6b7",
                                "depth": 3,
                                "name": "Fourth proportional",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Fourth proportional"
                            },
                            {
                                "_id": "55c2deea2a3965432eaac6b8",
                                "depth": 3,
                                "name": "Third proportional",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Third proportional"
                            },
                            {
                                "_id": "55c2deea2a3965432eaac6b9",
                                "depth": 3,
                                "name": "Mean proportional",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Mean proportional"
                            }
                        ],
                        "type": "chapter",
                        "par": "Ratio And Proportion"
                    },
                    {
                        "_id": "55c2deea2a3965432eaac6ba",
                        "depth": 2,
                        "name": "Interest",
                        "properties" : { "exam": "SBI Clerk" },
                        "children": [
                            {
                                "_id": "55c2deea2a3965432eaac6bb",
                                "depth": 3,
                                "name": "Simple interest",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Simple interest"
                            },
                            {
                                "_id": "55c2deea2a3965432eaac6bc",
                                "depth": 3,
                                "name": "Compound interest",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Compound interest"
                            },
                            {
                                "_id": "55c2deea2a3965432eaac6bd",
                                "depth": 3,
                                "name": "Simple and Compound",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Simple and Compound"
                            },
                            {
                                "_id": "55c2deeb2a3965432eaac6be",
                                "depth": 3,
                                "name": "Installments",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Installments"
                            }
                        ],
                        "type": "chapter",
                        "par": "Interest"
                    },
                    {
                        "_id": "55c2deeb2a3965432eaac6bf",
                        "depth": 2,
                        "name": "Profit And Loss",
                        "properties" : { "exam": "SBI Clerk" },
                        "children": [
                            {
                                "_id": "55c2deeb2a3965432eaac6c0",
                                "depth": 3,
                                "name": "Dishonest Dealings",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Dishonest Dealings"
                            },
                            {
                                "_id": "55c2deeb2a3965432eaac6c1",
                                "depth": 3,
                                "name": "Succesive Selling",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Succesive Selling"
                            },
                            {
                                "_id": "55c2deeb2a3965432eaac6c2",
                                "depth": 3,
                                "name": "Partnership",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Partnership"
                            },
                            {
                                "_id": "55c2deeb2a3965432eaac6c3",
                                "depth": 3,
                                "name": "Discount And MP",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Discount And MP"
                            },
                            {
                                "_id": "55c2deec2a3965432eaac6c4",
                                "depth": 3,
                                "name": "Sales Tax",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Sales Tax"
                            }
                        ],
                        "type": "chapter",
                        "par": "Profit And Loss"
                    },
                    {
                        "_id": "55c2deec2a3965432eaac6c5",
                        "depth": 2,
                        "name": "Time And Work",
                        "properties" : { "exam": "SBI Clerk" },
                        "children": [
                            {
                                "_id": "55c2deec2a3965432eaac6c6",
                                "depth": 3,
                                "name": "Work Efficiency",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Work Efficiency"
                            },
                            {
                                "_id": "55c2deec2a3965432eaac6c7",
                                "depth": 3,
                                "name": "work and wages",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "work and wages"
                            },
                            {
                                "_id": "55c2deec2a3965432eaac6c8",
                                "depth": 3,
                                "name": "Pipe And Cistern",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Pipe And Cistern"
                            }
                        ],
                        "type": "chapter",
                        "par": "Time And Work"
                    },
                    {
                        "_id": "55c2deed2a3965432eaac6c9",
                        "depth": 2,
                        "name": "Speed Time And Distance",
                        "properties" : { "exam": "SBI Clerk" },
                        "children": [
                            {
                                "_id": "55c2deed2a3965432eaac6ca",
                                "depth": 3,
                                "name": "Partial Speed",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Partial Speed"
                            },
                            {
                                "_id": "55c2deed2a3965432eaac6cb",
                                "depth": 3,
                                "name": "Relative Speed",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Relative Speed"
                            },
                            {
                                "_id": "55c2deed2a3965432eaac6cc",
                                "depth": 3,
                                "name": "Average speed",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Average speed"
                            },
                            {
                                "_id": "55c2deed2a3965432eaac6cd",
                                "depth": 3,
                                "name": "Boat And River",
                                "properties" : { "exam": "SBI Clerk" },
                                "children": [
                                    {
                                        "_id": "55c2deed2a3965432eaac6ce",
                                        "depth": 4,
                                        "name": "Upstream Or Down Stream",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Upstream Or Down Stream"
                                    },
                                    {
                                        "_id": "55c2deed2a3965432eaac6cf",
                                        "depth": 4,
                                        "name": "Up And Down Both",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Up And Down Both"
                                    }
                                ],
                                "type": "topic",
                                "par": "Boat And River"
                            },
                            {
                                "_id": "55c2deee2a3965432eaac6d0",
                                "depth": 3,
                                "name": "Problem On Trains",
                                "properties" : { "exam": "SBI Clerk" },
                                "children": [
                                    {
                                        "_id": "55c2deee2a3965432eaac6d1",
                                        "depth": 4,
                                        "name": "Train Crossing A Stationary Object or Man",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Train Crossing A Stationary Object or Man"
                                    },
                                    {
                                        "_id": "55c2deee2a3965432eaac6d2",
                                        "depth": 4,
                                        "name": "Train Crossing A Platform",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Train Crossing A Platform"
                                    },
                                    {
                                        "_id": "55c2deee2a3965432eaac6d3",
                                        "depth": 4,
                                        "name": "Train Crossing A Running Man or Object",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Train Crossing A Running Man or Object"
                                    }
                                ],
                                "type": "topic",
                                "par": "Problem On Trains"
                            }
                        ],
                        "type": "chapter",
                        "par": "Speed Time And Distance"
                    },
                    {
                        "_id": "55c2deee2a3965432eaac6d4",
                        "depth": 2,
                        "name": "Mensuration",
                        "properties" : { "exam": "SBI Clerk" },
                        "children": [
                            {
                                "_id": "55c2deee2a3965432eaac6d5",
                                "depth": 3,
                                "name": "Square",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Square"
                            },
                            {
                                "_id": "55c2deee2a3965432eaac6d6",
                                "depth": 3,
                                "name": "Rectangle",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Rectangle"
                            },
                            {
                                "_id": "55c2deef2a3965432eaac6d7",
                                "depth": 3,
                                "name": "Circle or Semi Circle",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Circle or Semi Circle"
                            },
                            {
                                "_id": "55c2deef2a3965432eaac6d8",
                                "depth": 3,
                                "name": "Triangle",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Triangle"
                            },
                            {
                                "_id": "55c2deef2a3965432eaac6d9",
                                "depth": 3,
                                "name": "Rhombus",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Rhombus"
                            },
                            {
                                "_id": "55c2deef2a3965432eaac6da",
                                "depth": 3,
                                "name": "Trapezium",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Trapezium"
                            },
                            {
                                "_id": "55c2deef2a3965432eaac6db",
                                "depth": 3,
                                "name": "Parallelogram",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Parallelogram"
                            },
                            {
                                "_id": "55c2deef2a3965432eaac6dc",
                                "depth": 3,
                                "name": "Two Figures",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Two Figures"
                            }
                        ],
                        "type": "chapter",
                        "par": "Mensuration"
                    },
                    {
                        "_id": "55c2def02a3965432eaac6dd",
                        "depth": 2,
                        "name": "Permutation And Combination",
                        "properties" : { "exam": "SBI Clerk" },
                        "type": "chapter",
                        "par": "Permutation And Combination"
                    },
                    {
                        "_id": "55c2def02a3965432eaac6de",
                        "depth": 2,
                        "name": "Number Series",
                        "properties" : { "exam": "SBI Clerk" },
                        "type": "chapter",
                        "par": "Number Series"
                    },
                    {
                        "_id": "55c2def02a3965432eaac6df",
                        "depth": 2,
                        "name": "Mixture Problems",
                        "properties" : { "exam": "SBI Clerk" },
                        "children": [
                            {
                                "_id": "55c2def02a3965432eaac6e0",
                                "depth": 3,
                                "name": "To Make A Mixture From Two Or More Things",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "To Make A Mixture From Two Or More Things"
                            },
                            {
                                "_id": "55c2def02a3965432eaac6e1",
                                "depth": 3,
                                "name": "To Make A Mixture From Two Mixtures",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "To Make A Mixture From Two Mixtures"
                            }
                        ],
                        "type": "chapter",
                        "par": "Mixture Problems"
                    },
                    {
                        "_id": "55c2def12a3965432eaac6e2",
                        "depth": 2,
                        "name": "Data Sufficiency",
                        "properties" : { "exam": "SBI Clerk" },
                        "type": "chapter",
                        "par": "Data Sufficiency"
                    },
                    {
                        "_id": "55c2def12a3965432eaac6e3",
                        "depth": 2,
                        "name": "Probability",
                        "properties" : { "exam": "SBI Clerk" },
                        "type": "chapter",
                        "par": "Probability"
                    }
                ],
                "type": "subject",
                "par": "Quantitative Aptitude"
            },
            {
                "_id": "55c2def12a3965432eaac6e4",
                "depth": 1,
                "name": "Data Interpretation",
                "properties" : { "exam": "SBI Clerk" },
                "children": [
                    {
                        "_id": "55c2def12a3965432eaac6e5",
                        "depth": 2,
                        "name": "Bar Graph",
                        "properties" : { "exam": "SBI Clerk" },
                        "type": "chapter",
                        "par": "Bar Graph"
                    },
                    {
                        "_id": "55c2def12a3965432eaac6e6",
                        "depth": 2,
                        "name": "Pie Chart",
                        "properties" : { "exam": "SBI Clerk" },
                        "type": "chapter",
                        "par": "Pie Chart"
                    },
                    {
                        "_id": "55c2def12a3965432eaac6e7",
                        "depth": 2,
                        "name": "Line Graph",
                        "properties" : { "exam": "SBI Clerk" },
                        "type": "chapter",
                        "par": "Line Graph"
                    },
                    {
                        "_id": "55c2def22a3965432eaac6e8",
                        "depth": 2,
                        "name": "Miscellaneous",
                        "properties" : { "exam": "SBI Clerk" },
                        "type": "chapter",
                        "par": "Miscellaneous"
                    },
                    {
                        "_id": "55c2def22a3965432eaac6e9",
                        "depth": 2,
                        "name": "Tabulation",
                        "properties" : { "exam": "SBI Clerk" },
                        "type": "chapter",
                        "par": "Tabulation"
                    }
                ],
                "type": "subject",
                "par": "Data Interpretation"
            },
            {
                "_id": "55c2def22a3965432eaac6ea",
                "depth": 1,
                "name": "English",
                "properties" : { "exam": "SBI Clerk" },
                "children": [
                    {
                        "_id": "55c2def22a3965432eaac6eb",
                        "depth": 2,
                        "name": "Grammar",
                        "properties" : { "exam": "SBI Clerk" },
                        "children": [
                            {
                                "_id": "55c2def22a3965432eaac6ec",
                                "depth": 3,
                                "name": "Error Spotting",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Error Spotting"
                            },
                            {
                                "_id": "55c2def22a3965432eaac6ed",
                                "depth": 3,
                                "name": "Phrase Replacement",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Phrase Replacement"
                            },
                            {
                                "_id": "55c2def22a3965432eaac6ee",
                                "depth": 3,
                                "name": "Fill in the Blanks",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Fill in the Blanks"
                            }
                        ],
                        "type": "chapter",
                        "par": "Grammar"
                    },
                    {
                        "_id": "55c2def32a3965432eaac6ef",
                        "depth": 2,
                        "name": "Vocabulary",
                        "properties" : { "exam": "SBI Clerk" },
                        "children": [
                            {
                                "_id": "55c2def32a3965432eaac6f0",
                                "depth": 3,
                                "name": "Cloze Test",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Cloze Test"
                            },
                            {
                                "_id": "55c2def32a3965432eaac6f1",
                                "depth": 3,
                                "name": "Synonyms or Antonyms",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Synonyms or Antonyms"
                            },
                            {
                                "_id": "55c2def32a3965432eaac6f2",
                                "depth": 3,
                                "name": "Phrase or Idiom Meaning",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Phrase or Idiom Meaning"
                            },
                            {
                                "_id": "55c2def32a3965432eaac6f3",
                                "depth": 3,
                                "name": "Fill in the Blanks",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Fill in the Blanks"
                            },
                            {
                                "_id": "55c2def32a3965432eaac6f4",
                                "depth": 3,
                                "name": "Phrase Replacement",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Phrase Replacement"
                            },
                            {
                                "_id": "55c2def42a3965432eaac6f5",
                                "depth": 3,
                                "name": "Error Spotting",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Error Spotting"
                            }
                        ],
                        "type": "chapter",
                        "par": "Vocabulary"
                    },
                    {
                        "_id": "55c2def42a3965432eaac6f6",
                        "depth": 2,
                        "name": "Verbal Ability",
                        "properties" : { "exam": "SBI Clerk" },
                        "children": [
                            {
                                "_id": "55c2def42a3965432eaac6f7",
                                "depth": 3,
                                "name": "Sentence Completion",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Sentence Completion"
                            },
                            {
                                "_id": "55c2def42a3965432eaac6f8",
                                "depth": 3,
                                "name": "Para Jumbles",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Para Jumbles"
                            },
                            {
                                "_id": "55c2def42a3965432eaac6f9",
                                "depth": 3,
                                "name": "Sentence Jumbles",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Sentence Jumbles"
                            }
                        ],
                        "type": "chapter",
                        "par": "Verbal Ability"
                    },
                    {
                        "_id": "55c2def42a3965432eaac6fa",
                        "depth": 2,
                        "name": "Reading Comprehension",
                        "properties" : { "exam": "SBI Clerk" },
                        "type": "chapter",
                        "par": "Reading Comprehension"
                    }
                ],
                "type": "subject",
                "par": "English"
            },
            {
                "_id": "55c2def52a3965432eaac6fb",
                "depth": 1,
                "name": "Logical Reasoning",
                "properties" : { "exam": "SBI Clerk" },
                "children": [
                    {
                        "_id": "55c2def52a3965432eaac6fc",
                        "depth": 2,
                        "name": "Arrangement and pattern",
                        "properties" : { "exam": "SBI Clerk" },
                        "children": [
                            {
                                "_id": "55c2def52a3965432eaac6fd",
                                "depth": 3,
                                "name": "General series of alphabets",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "General series of alphabets"
                            },
                            {
                                "_id": "55c2def52a3965432eaac6fe",
                                "depth": 3,
                                "name": "Random sequence of alphabets",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Random sequence of alphabets"
                            },
                            {
                                "_id": "55c2def52a3965432eaac6ff",
                                "depth": 3,
                                "name": "Mixed series",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Mixed series"
                            },
                            {
                                "_id": "55c2def52a3965432eaac700",
                                "depth": 3,
                                "name": "Number Arrangement",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Number Arrangement"
                            },
                            {
                                "_id": "55c2def52a3965432eaac701",
                                "depth": 3,
                                "name": "Dictionary or Alphabet based",
                                "properties" : { "exam": "SBI Clerk" },
                                "children": [
                                    {
                                        "_id": "55c2def52a3965432eaac702",
                                        "depth": 4,
                                        "name": "Position of letters in a word",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Position of letters in a word"
                                    },
                                    {
                                        "_id": "55c2def62a3965432eaac703",
                                        "depth": 4,
                                        "name": "Creating english words",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Creating english words"
                                    }
                                ],
                                "type": "topic",
                                "par": "Dictionary or Alphabet based"
                            }
                        ],
                        "type": "chapter",
                        "par": "Arrangement and pattern"
                    },
                    {
                        "_id": "55c2def62a3965432eaac704",
                        "depth": 2,
                        "name": "Classification",
                        "properties" : { "exam": "SBI Clerk" },
                        "children": [
                            {
                                "_id": "55c2def62a3965432eaac705",
                                "depth": 3,
                                "name": "Letter or meaningless words based",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Letter or meaningless words based"
                            },
                            {
                                "_id": "55c2def62a3965432eaac706",
                                "depth": 3,
                                "name": "meaningful words based",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "meaningful words based"
                            },
                            {
                                "_id": "55c2def62a3965432eaac707",
                                "depth": 3,
                                "name": "Number based",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Number based"
                            }
                        ],
                        "type": "chapter",
                        "par": "Classification"
                    },
                    {
                        "_id": "55c2def72a3965432eaac708",
                        "depth": 2,
                        "name": "Analogy",
                        "properties" : { "exam": "SBI Clerk" },
                        "children": [
                            {
                                "_id": "55c2def72a3965432eaac709",
                                "depth": 3,
                                "name": "Meaning based",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Meaning based"
                            }
                        ],
                        "type": "chapter",
                        "par": "Analogy"
                    },
                    {
                        "_id": "55c2def72a3965432eaac70a",
                        "depth": 2,
                        "name": "Series",
                        "properties" : { "exam": "SBI Clerk" },
                        "children": [
                            {
                                "_id": "55c2def72a3965432eaac70b",
                                "depth": 3,
                                "name": "Number series",
                                "properties" : { "exam": "SBI Clerk" },
                                "children": [
                                    {
                                        "_id": "55c2def72a3965432eaac70c",
                                        "depth": 4,
                                        "name": "Complete the series",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Complete the series"
                                    },
                                    {
                                        "_id": "55c2def72a3965432eaac70d",
                                        "depth": 4,
                                        "name": "Missing term",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Missing term"
                                    },
                                    {
                                        "_id": "55c2def72a3965432eaac70e",
                                        "depth": 4,
                                        "name": "Wrong Term",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Wrong Term"
                                    }
                                ],
                                "type": "topic",
                                "par": "Number series"
                            },
                            {
                                "_id": "55c2def82a3965432eaac70f",
                                "depth": 3,
                                "name": "Alphabet Series",
                                "properties" : { "exam": "SBI Clerk" },
                                "children": [
                                    {
                                        "_id": "55c2def82a3965432eaac710",
                                        "depth": 4,
                                        "name": "Complete the series",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Complete the series"
                                    },
                                    {
                                        "_id": "55c2def82a3965432eaac711",
                                        "depth": 4,
                                        "name": "Missing term",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Missing term"
                                    },
                                    {
                                        "_id": "55c2def82a3965432eaac712",
                                        "depth": 4,
                                        "name": "Wrong Term",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Wrong Term"
                                    }
                                ],
                                "type": "topic",
                                "par": "Alphabet Series"
                            }
                        ],
                        "type": "chapter",
                        "par": "Series"
                    },
                    {
                        "_id": "55c2def92a3965432eaac713",
                        "depth": 2,
                        "name": "Coding  Decoding",
                        "properties" : { "exam": "SBI Clerk" },
                        "children": [
                            {
                                "_id": "55c2def92a3965432eaac714",
                                "depth": 3,
                                "name": "Coding and decoding by letter shifting",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Coding and decoding by letter shifting"
                            },
                            {
                                "_id": "55c2def92a3965432eaac715",
                                "depth": 3,
                                "name": "Coding and decoding in fictitious language",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Coding and decoding in fictitious language"
                            },
                            {
                                "_id": "55c2def92a3965432eaac716",
                                "depth": 3,
                                "name": "Coding by analogy",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Coding by analogy"
                            },
                            {
                                "_id": "55c2def92a3965432eaac717",
                                "depth": 3,
                                "name": "Coding letters of a word",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Coding letters of a word"
                            }
                        ],
                        "type": "chapter",
                        "par": "Coding  Decoding"
                    },
                    {
                        "_id": "55c2def92a3965432eaac718",
                        "depth": 2,
                        "name": "Blood relations",
                        "properties" : { "exam": "SBI Clerk" },
                        "children": [
                            {
                                "_id": "55c2def92a3965432eaac719",
                                "depth": 3,
                                "name": "General blood relation problems",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "General blood relation problems"
                            },
                            {
                                "_id": "55c2def92a3965432eaac71a",
                                "depth": 3,
                                "name": "Family tree problems",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Family tree problems"
                            },
                            {
                                "_id": "55c2defa2a3965432eaac71b",
                                "depth": 3,
                                "name": "Coded blood relation problems",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Coded blood relation problems"
                            }
                        ],
                        "type": "chapter",
                        "par": "Blood relations"
                    },
                    {
                        "_id": "55c2defa2a3965432eaac71c",
                        "depth": 2,
                        "name": "Ordering and ranking",
                        "properties" : { "exam": "SBI Clerk" },
                        "type": "chapter",
                        "par": "Ordering and ranking"
                    },
                    {
                        "_id": "55c2defa2a3965432eaac71d",
                        "depth": 2,
                        "name": "Problem solving",
                        "properties" : { "exam": "SBI Clerk" },
                        "type": "chapter",
                        "par": "Problem solving"
                    },
                    {
                        "_id": "55c2defa2a3965432eaac71e",
                        "depth": 2,
                        "name": "Coded inequalities",
                        "properties" : { "exam": "SBI Clerk" },
                        "type": "chapter",
                        "par": "Coded inequalities"
                    },
                    {
                        "_id": "55c2defa2a3965432eaac71f",
                        "depth": 2,
                        "name": "Syllogism",
                        "properties" : { "exam": "SBI Clerk" },
                        "type": "chapter",
                        "par": "Syllogism"
                    },
                    {
                        "_id": "55c2defb2a3965432eaac720",
                        "depth": 2,
                        "name": "Seating arrangement",
                        "properties" : { "exam": "SBI Clerk" },
                        "children": [
                            {
                                "_id": "55c2defb2a3965432eaac721",
                                "depth": 3,
                                "name": "Circular Arrangement",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Circular Arrangement"
                            },
                            {
                                "_id": "55c2defb2a3965432eaac722",
                                "depth": 3,
                                "name": "Linear Arrangement",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Linear Arrangement"
                            }
                        ],
                        "type": "chapter",
                        "par": "Seating arrangement"
                    },
                    {
                        "_id": "55c2defb2a3965432eaac723",
                        "depth": 2,
                        "name": "Non verbal reasoning",
                        "properties" : { "exam": "SBI Clerk" },
                        "children": [
                            {
                                "_id": "55c2defb2a3965432eaac724",
                                "depth": 3,
                                "name": "Figure based",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Figure based"
                            }
                        ],
                        "type": "chapter",
                        "par": "Non verbal reasoning"
                    },
                    {
                        "_id": "55c2defb2a3965432eaac725",
                        "depth": 2,
                        "name": "Data Sufficiency",
                        "properties" : { "exam": "SBI Clerk" },
                        "type": "chapter",
                        "par": "Data Sufficiency"
                    }
                ],
                "type": "subject",
                "par": "Logical Reasoning"
            },
            {
                "_id": "55c2defc2a3965432eaac726",
                "depth": 1,
                "name": "Verbal Reasoning",
                "properties" : { "exam": "SBI Clerk" },
                "children": [
                    {
                        "_id": "55c2defc2a3965432eaac727",
                        "depth": 2,
                        "name": "Statements and Arguments",
                        "properties" : { "exam": "SBI Clerk" },
                        "type": "chapter",
                        "par": "Statements and Arguments"
                    },
                    {
                        "_id": "55c2defc2a3965432eaac728",
                        "depth": 2,
                        "name": "Critical Reasoning",
                        "properties" : { "exam": "SBI Clerk" },
                        "type": "chapter",
                        "par": "Critical Reasoning"
                    }
                ],
                "type": "subject",
                "par": "Verbal Reasoning"
            },
            {
                "_id": "55c2defc2a3965432eaac729",
                "depth": 1,
                "name": "Computer",
                "properties" : { "exam": "SBI Clerk" },
                "children": [
                    {
                        "_id": "55c2defc2a3965432eaac72a",
                        "depth": 2,
                        "name": "Computer Fundamentals or Terminologies",
                        "properties" : { "exam": "SBI Clerk" },
                        "type": "chapter",
                        "par": "Computer Fundamentals or Terminologies"
                    },
                    {
                        "_id": "55c2defc2a3965432eaac72b",
                        "depth": 2,
                        "name": "Microsoft Office",
                        "properties" : { "exam": "SBI Clerk" },
                        "type": "chapter",
                        "par": "Microsoft Office"
                    },
                    {
                        "_id": "55c2defd2a3965432eaac72c",
                        "depth": 2,
                        "name": "Hardware",
                        "properties" : { "exam": "SBI Clerk" },
                        "type": "chapter",
                        "par": "Hardware"
                    },
                    {
                        "_id": "55c2defd2a3965432eaac72d",
                        "depth": 2,
                        "name": "Software",
                        "properties" : { "exam": "SBI Clerk" },
                        "type": "chapter",
                        "par": "Software"
                    },
                    {
                        "_id": "55c2defd2a3965432eaac72e",
                        "depth": 2,
                        "name": "Operating Systems",
                        "properties" : { "exam": "SBI Clerk" },
                        "type": "chapter",
                        "par": "Operating Systems"
                    },
                    {
                        "_id": "55c2defd2a3965432eaac72f",
                        "depth": 2,
                        "name": "Networking",
                        "properties" : { "exam": "SBI Clerk" },
                        "type": "chapter",
                        "par": "Networking"
                    },
                    {
                        "_id": "55c2defd2a3965432eaac730",
                        "depth": 2,
                        "name": "Internet",
                        "properties" : { "exam": "SBI Clerk" },
                        "type": "chapter",
                        "par": "Internet"
                    },
                    {
                        "_id": "55c2defd2a3965432eaac731",
                        "depth": 2,
                        "name": "Memory",
                        "properties" : { "exam": "SBI Clerk" },
                        "type": "chapter",
                        "par": "Memory"
                    },
                    {
                        "_id": "55c2defe2a3965432eaac732",
                        "depth": 2,
                        "name": "Keyboard shortcuts",
                        "properties" : { "exam": "SBI Clerk" },
                        "type": "chapter",
                        "par": "Keyboard shortcuts"
                    },
                    {
                        "_id": "55c2defe2a3965432eaac733",
                        "depth": 2,
                        "name": "Computer Abbreviations",
                        "properties" : { "exam": "SBI Clerk" },
                        "type": "chapter",
                        "par": "Computer Abbreviations"
                    }
                ],
                "type": "subject",
                "par": "Computer"
            },
            {
                "_id": "55c2defe2a3965432eaac734",
                "depth": 1,
                "name": "Marketing",
                "properties" : { "exam": "SBI Clerk" },
                "children": [
                    {
                        "_id": "55c2defe2a3965432eaac735",
                        "depth": 2,
                        "name": "Introduction to Marketing",
                        "properties" : { "exam": "SBI Clerk" },
                        "type": "chapter",
                        "par": "Introduction to Marketing"
                    },
                    {
                        "_id": "55c2defe2a3965432eaac736",
                        "depth": 2,
                        "name": "Functions of Marketing",
                        "properties" : { "exam": "SBI Clerk" },
                        "type": "chapter",
                        "par": "Functions of Marketing"
                    },
                    {
                        "_id": "55c2defe2a3965432eaac737",
                        "depth": 2,
                        "name": "Marketing Management",
                        "properties" : { "exam": "SBI Clerk" },
                        "type": "chapter",
                        "par": "Marketing Management"
                    },
                    {
                        "_id": "55c2defe2a3965432eaac738",
                        "depth": 2,
                        "name": "Product Marketing",
                        "properties" : { "exam": "SBI Clerk" },
                        "type": "chapter",
                        "par": "Product Marketing"
                    },
                    {
                        "_id": "55c2deff2a3965432eaac739",
                        "depth": 2,
                        "name": "Advertising",
                        "properties" : { "exam": "SBI Clerk" },
                        "type": "chapter",
                        "par": "Advertising"
                    },
                    {
                        "_id": "55c2deff2a3965432eaac73a",
                        "depth": 2,
                        "name": "Sales Management",
                        "properties" : { "exam": "SBI Clerk" },
                        "type": "chapter",
                        "par": "Sales Management"
                    },
                    {
                        "_id": "55c2deff2a3965432eaac73b",
                        "depth": 2,
                        "name": "Consumer or Customer",
                        "properties" : { "exam": "SBI Clerk" },
                        "type": "chapter",
                        "par": "Consumer or Customer"
                    },
                    {
                        "_id": "55c2deff2a3965432eaac73c",
                        "depth": 2,
                        "name": "Marketing Abbreviations",
                        "properties" : { "exam": "SBI Clerk" },
                        "type": "chapter",
                        "par": "Marketing Abbreviations"
                    }
                ],
                "type": "subject",
                "par": "Marketing"
            },
            {
                "_id": "55c2deff2a3965432eaac73d",
                "depth": 1,
                "name": "General Awareness",
                "properties" : { "exam": "SBI Clerk" },
                "children": [
                    {
                        "_id": "55c2deff2a3965432eaac73e",
                        "depth": 2,
                        "name": "Banking Awareness",
                        "properties" : { "exam": "SBI Clerk" },
                        "children": [
                            {
                                "_id": "55c2deff2a3965432eaac73f",
                                "depth": 3,
                                "name": "Banking Abbreviations",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Banking Abbreviations"
                            },
                            {
                                "_id": "55c2df002a3965432eaac740",
                                "depth": 3,
                                "name": "Banking Terminology and Concepts",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Banking Terminology and Concepts"
                            },
                            {
                                "_id": "55c2df002a3965432eaac741",
                                "depth": 3,
                                "name": "Commercial Banks",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Commercial Banks"
                            },
                            {
                                "_id": "55c2df002a3965432eaac742",
                                "depth": 3,
                                "name": "eBanking",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "eBanking"
                            },
                            {
                                "_id": "55c2df002a3965432eaac743",
                                "depth": 3,
                                "name": "Financial Markets",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Financial Markets"
                            },
                            {
                                "_id": "55c2df002a3965432eaac744",
                                "depth": 3,
                                "name": "Banking Organization or Committies",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Banking Organization or Committies"
                            },
                            {
                                "_id": "55c2df002a3965432eaac745",
                                "depth": 3,
                                "name": "Functionality of Banks",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Functionality of Banks"
                            },
                            {
                                "_id": "55c2df012a3965432eaac746",
                                "depth": 3,
                                "name": "Banking History or Facts",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Banking History or Facts"
                            },
                            {
                                "_id": "55c2df012a3965432eaac747",
                                "depth": 3,
                                "name": "Banking Acts or Policies",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Banking Acts or Policies"
                            },
                            {
                                "_id": "55c2df012a3965432eaac748",
                                "depth": 3,
                                "name": "Institutional Financing",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Institutional Financing"
                            },
                            {
                                "_id": "55c2df012a3965432eaac749",
                                "depth": 3,
                                "name": "International Financial Organizations",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "International Financial Organizations"
                            },
                            {
                                "_id": "55c2df012a3965432eaac74a",
                                "depth": 3,
                                "name": "Mutual Funds",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Mutual Funds"
                            },
                            {
                                "_id": "55c2df012a3965432eaac74b",
                                "depth": 3,
                                "name": "Non banking Financial Companies NBFCs",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Non banking Financial Companies NBFCs"
                            },
                            {
                                "_id": "55c2df022a3965432eaac74c",
                                "depth": 3,
                                "name": "Reserve bank of India",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Reserve bank of India"
                            },
                            {
                                "_id": "55c2df022a3965432eaac74d",
                                "depth": 3,
                                "name": "Stock Exchange",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Stock Exchange"
                            }
                        ],
                        "type": "chapter",
                        "par": "Banking Awareness"
                    },
                    {
                        "_id": "55c2df022a3965432eaac74e",
                        "depth": 2,
                        "name": "Current Affairs",
                        "properties" : { "exam": "SBI Clerk" },
                        "children": [
                            {
                                "_id": "55c2df022a3965432eaac74f",
                                "depth": 3,
                                "name": "National Awards and Honours",
                                "properties" : { "exam": "SBI Clerk" },
                                "children": [
                                    {
                                        "_id": "55c2df022a3965432eaac750",
                                        "depth": 4,
                                        "name": "Sports Awards",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Sports Awards"
                                    },
                                    {
                                        "_id": "55c2df022a3965432eaac751",
                                        "depth": 4,
                                        "name": "Cinema or Television and Theatre Awards",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Cinema or Television and Theatre Awards"
                                    },
                                    {
                                        "_id": "55c2df022a3965432eaac752",
                                        "depth": 4,
                                        "name": "Arts or Music and Dance Awards",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Arts or Music and Dance Awards"
                                    },
                                    {
                                        "_id": "55c2df032a3965432eaac753",
                                        "depth": 4,
                                        "name": "Awards for Bravery or Philanthropy or Social Service",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Awards for Bravery or Philanthropy or Social Service"
                                    },
                                    {
                                        "_id": "55c2df032a3965432eaac754",
                                        "depth": 4,
                                        "name": "Business and Management Awards",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Business and Management Awards"
                                    },
                                    {
                                        "_id": "55c2df032a3965432eaac755",
                                        "depth": 4,
                                        "name": "Political Awards",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Political Awards"
                                    },
                                    {
                                        "_id": "55c2df032a3965432eaac756",
                                        "depth": 4,
                                        "name": "Awards for Scientific Research",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Awards for Scientific Research"
                                    },
                                    {
                                        "_id": "55c2df032a3965432eaac757",
                                        "depth": 4,
                                        "name": "Market Awards for Consumer goods or services",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Market Awards for Consumer goods or services"
                                    },
                                    {
                                        "_id": "55c2df032a3965432eaac758",
                                        "depth": 4,
                                        "name": "Fashion and Beauty",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Fashion and Beauty"
                                    }
                                ],
                                "type": "topic",
                                "par": "National Awards and Honours"
                            },
                            {
                                "_id": "55c2df042a3965432eaac759",
                                "depth": 3,
                                "name": "International Awards and Honours",
                                "properties" : { "exam": "SBI Clerk" },
                                "children": [
                                    {
                                        "_id": "55c2df042a3965432eaac75a",
                                        "depth": 4,
                                        "name": "Sports Awards",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Sports Awards"
                                    },
                                    {
                                        "_id": "55c2df042a3965432eaac75b",
                                        "depth": 4,
                                        "name": "Cinema or Television and Theatre Awards",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Cinema or Television and Theatre Awards"
                                    },
                                    {
                                        "_id": "55c2df042a3965432eaac75c",
                                        "depth": 4,
                                        "name": "Arts or Music and Dance Awards",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Arts or Music and Dance Awards"
                                    },
                                    {
                                        "_id": "55c2df042a3965432eaac75d",
                                        "depth": 4,
                                        "name": "Awards for Bravery or Philanthropy or Social Service",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Awards for Bravery or Philanthropy or Social Service"
                                    },
                                    {
                                        "_id": "55c2df042a3965432eaac75e",
                                        "depth": 4,
                                        "name": "Business and Management Awards",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Business and Management Awards"
                                    },
                                    {
                                        "_id": "55c2df042a3965432eaac75f",
                                        "depth": 4,
                                        "name": "Political Awards",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Political Awards"
                                    },
                                    {
                                        "_id": "55c2df052a3965432eaac760",
                                        "depth": 4,
                                        "name": "Awards for Scientific Research",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Awards for Scientific Research"
                                    },
                                    {
                                        "_id": "55c2df052a3965432eaac761",
                                        "depth": 4,
                                        "name": "Market Awards Consumer goods or services",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Market Awards Consumer goods or services"
                                    },
                                    {
                                        "_id": "55c2df052a3965432eaac762",
                                        "depth": 4,
                                        "name": "Fashion and Beauty",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Fashion and Beauty"
                                    }
                                ],
                                "type": "topic",
                                "par": "International Awards and Honours"
                            },
                            {
                                "_id": "55c2df052a3965432eaac763",
                                "depth": 3,
                                "name": "Books and Authors",
                                "properties" : { "exam": "SBI Clerk" },
                                "children": [
                                    {
                                        "_id": "55c2df052a3965432eaac764",
                                        "depth": 4,
                                        "name": "Biographies and Autobiographies",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Biographies and Autobiographies"
                                    },
                                    {
                                        "_id": "55c2df052a3965432eaac765",
                                        "depth": 4,
                                        "name": "Fiction",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Fiction"
                                    },
                                    {
                                        "_id": "55c2df062a3965432eaac766",
                                        "depth": 4,
                                        "name": "Non fiction",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Non fiction"
                                    }
                                ],
                                "type": "topic",
                                "par": "Books and Authors"
                            },
                            {
                                "_id": "55c2df062a3965432eaac767",
                                "depth": 3,
                                "name": "Business and Economy",
                                "properties" : { "exam": "SBI Clerk" },
                                "children": [
                                    {
                                        "_id": "55c2df062a3965432eaac768",
                                        "depth": 4,
                                        "name": "At risk Companies and Sectors",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "At risk Companies and Sectors"
                                    },
                                    {
                                        "_id": "55c2df062a3965432eaac769",
                                        "depth": 4,
                                        "name": "GDP or NDP or PP Ranking",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "GDP or NDP or PP Ranking"
                                    }
                                ],
                                "type": "topic",
                                "par": "Business and Economy"
                            },
                            {
                                "_id": "55c2df062a3965432eaac76a",
                                "depth": 3,
                                "name": "Entertainment and Films",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Entertainment and Films"
                            },
                            {
                                "_id": "55c2df072a3965432eaac76b",
                                "depth": 3,
                                "name": "Governance Schemes and Policies",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Governance Schemes and Policies"
                            },
                            {
                                "_id": "55c2df072a3965432eaac76c",
                                "depth": 3,
                                "name": "Important People",
                                "properties" : { "exam": "SBI Clerk" },
                                "children": [
                                    {
                                        "_id": "55c2df072a3965432eaac76d",
                                        "depth": 4,
                                        "name": "Reformers and Activists",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Reformers and Activists"
                                    },
                                    {
                                        "_id": "55c2df072a3965432eaac76e",
                                        "depth": 4,
                                        "name": "Scientists",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Scientists"
                                    },
                                    {
                                        "_id": "55c2df072a3965432eaac76f",
                                        "depth": 4,
                                        "name": "Politicians",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Politicians"
                                    },
                                    {
                                        "_id": "55c2df072a3965432eaac770",
                                        "depth": 4,
                                        "name": "Artists and Authors",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Artists and Authors"
                                    },
                                    {
                                        "_id": "55c2df072a3965432eaac771",
                                        "depth": 4,
                                        "name": "Bureaucrats",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Bureaucrats"
                                    }
                                ],
                                "type": "topic",
                                "par": "Important People"
                            },
                            {
                                "_id": "55c2df082a3965432eaac772",
                                "depth": 3,
                                "name": "International Affairs",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "International Affairs"
                            },
                            {
                                "_id": "55c2df082a3965432eaac773",
                                "depth": 3,
                                "name": "Organizations or Committee",
                                "properties" : { "exam": "SBI Clerk" },
                                "children": [
                                    {
                                        "_id": "55c2df082a3965432eaac774",
                                        "depth": 4,
                                        "name": "Judiciary",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Judiciary"
                                    },
                                    {
                                        "_id": "55c2df082a3965432eaac775",
                                        "depth": 4,
                                        "name": "Banking",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Banking"
                                    },
                                    {
                                        "_id": "55c2df082a3965432eaac776",
                                        "depth": 4,
                                        "name": "Scams",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Scams"
                                    }
                                ],
                                "type": "topic",
                                "par": "Organizations or Committee"
                            },
                            {
                                "_id": "55c2df082a3965432eaac777",
                                "depth": 3,
                                "name": "Famous Places",
                                "properties" : { "exam": "SBI Clerk" },
                                "children": [
                                    {
                                        "_id": "55c2df082a3965432eaac778",
                                        "depth": 4,
                                        "name": "Wars and Incursions",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Wars and Incursions"
                                    },
                                    {
                                        "_id": "55c2df092a3965432eaac779",
                                        "depth": 4,
                                        "name": "Sporting and Summit Venues",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Sporting and Summit Venues"
                                    },
                                    {
                                        "_id": "55c2df092a3965432eaac77a",
                                        "depth": 4,
                                        "name": "Festivals",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Festivals"
                                    },
                                    {
                                        "_id": "55c2df092a3965432eaac77b",
                                        "depth": 4,
                                        "name": "Population",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Population"
                                    },
                                    {
                                        "_id": "55c2df092a3965432eaac77c",
                                        "depth": 4,
                                        "name": "Literacy",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Literacy"
                                    },
                                    {
                                        "_id": "55c2df092a3965432eaac77d",
                                        "depth": 4,
                                        "name": "Living Quality Index",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Living Quality Index"
                                    }
                                ],
                                "type": "topic",
                                "par": "Famous Places"
                            },
                            {
                                "_id": "55c2df0a2a3965432eaac77e",
                                "depth": 3,
                                "name": "Science and Technology",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Science and Technology"
                            },
                            {
                                "_id": "55c2df0a2a3965432eaac77f",
                                "depth": 3,
                                "name": "Summits and Treaties",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Summits and Treaties"
                            },
                            {
                                "_id": "55c2df0a2a3965432eaac780",
                                "depth": 3,
                                "name": "Sports",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Sports"
                            },
                            {
                                "_id": "55c2df0a2a3965432eaac781",
                                "depth": 3,
                                "name": "History",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "History"
                            },
                            {
                                "_id": "55c2df0a2a3965432eaac782",
                                "depth": 3,
                                "name": "Geography",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Geography"
                            },
                            {
                                "_id": "55c2df0a2a3965432eaac783",
                                "depth": 3,
                                "name": "Capitals and Currency",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Capitals and Currency"
                            },
                            {
                                "_id": "55c2df0b2a3965432eaac784",
                                "depth": 3,
                                "name": "Days and Dates",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Days and Dates"
                            }
                        ],
                        "type": "chapter",
                        "par": "Current Affairs"
                    },
                    {
                        "_id": "55c2df0b2a3965432eaac785",
                        "depth": 2,
                        "name": "General Knowledge",
                        "properties" : { "exam": "SBI Clerk" },
                        "children": [
                            {
                                "_id": "55c2df0b2a3965432eaac786",
                                "depth": 3,
                                "name": "National Awards and Honours",
                                "properties" : { "exam": "SBI Clerk" },
                                "children": [
                                    {
                                        "_id": "55c2df0b2a3965432eaac787",
                                        "depth": 4,
                                        "name": "Sports Awards",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Sports Awards"
                                    },
                                    {
                                        "_id": "55c2df0b2a3965432eaac788",
                                        "depth": 4,
                                        "name": "Cinema or Television and Theatre Awards",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Cinema or Television and Theatre Awards"
                                    },
                                    {
                                        "_id": "55c2df0b2a3965432eaac789",
                                        "depth": 4,
                                        "name": "Arts or Music and Dance Awards",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Arts or Music and Dance Awards"
                                    },
                                    {
                                        "_id": "55c2df0b2a3965432eaac78a",
                                        "depth": 4,
                                        "name": "Awards for Bravery or Philanthropy or Social Service",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Awards for Bravery or Philanthropy or Social Service"
                                    },
                                    {
                                        "_id": "55c2df0c2a3965432eaac78b",
                                        "depth": 4,
                                        "name": "Awards in Literature and Journalism",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Awards in Literature and Journalism"
                                    },
                                    {
                                        "_id": "55c2df0c2a3965432eaac78c",
                                        "depth": 4,
                                        "name": "Business and Management Awards",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Business and Management Awards"
                                    },
                                    {
                                        "_id": "55c2df0c2a3965432eaac78d",
                                        "depth": 4,
                                        "name": "Political Awards",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Political Awards"
                                    },
                                    {
                                        "_id": "55c2df0c2a3965432eaac78e",
                                        "depth": 4,
                                        "name": "Awards for Scientific Research",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Awards for Scientific Research"
                                    },
                                    {
                                        "_id": "55c2df0c2a3965432eaac78f",
                                        "depth": 4,
                                        "name": "Market Awards Consumer goods or services",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Market Awards Consumer goods or services"
                                    },
                                    {
                                        "_id": "55c2df0c2a3965432eaac790",
                                        "depth": 4,
                                        "name": "Fashion and Beauty",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Fashion and Beauty"
                                    }
                                ],
                                "type": "topic",
                                "par": "National Awards and Honours"
                            },
                            {
                                "_id": "55c2df0d2a3965432eaac791",
                                "depth": 3,
                                "name": "International Awards and Honours",
                                "properties" : { "exam": "SBI Clerk" },
                                "children": [
                                    {
                                        "_id": "55c2df0d2a3965432eaac792",
                                        "depth": 4,
                                        "name": "Sports Awards",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Sports Awards"
                                    },
                                    {
                                        "_id": "55c2df0d2a3965432eaac793",
                                        "depth": 4,
                                        "name": "Cinema Television and Theatre Awards",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Cinema Television and Theatre Awards"
                                    },
                                    {
                                        "_id": "55c2df0d2a3965432eaac794",
                                        "depth": 4,
                                        "name": "Arts or Music and Dance Awards",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Arts or Music and Dance Awards"
                                    },
                                    {
                                        "_id": "55c2df0d2a3965432eaac795",
                                        "depth": 4,
                                        "name": "Awards for Bravery or Philanthropy or Social Service",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Awards for Bravery or Philanthropy or Social Service"
                                    },
                                    {
                                        "_id": "55c2df0d2a3965432eaac796",
                                        "depth": 4,
                                        "name": "Awards in Literature and Journalism",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Awards in Literature and Journalism"
                                    },
                                    {
                                        "_id": "55c2df0d2a3965432eaac797",
                                        "depth": 4,
                                        "name": "Business and Management Awards",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Business and Management Awards"
                                    },
                                    {
                                        "_id": "55c2df0e2a3965432eaac798",
                                        "depth": 4,
                                        "name": "Political Awards",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Political Awards"
                                    },
                                    {
                                        "_id": "55c2df0e2a3965432eaac799",
                                        "depth": 4,
                                        "name": "Awards for Scientific Research",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Awards for Scientific Research"
                                    },
                                    {
                                        "_id": "55c2df0e2a3965432eaac79a",
                                        "depth": 4,
                                        "name": "Market Awards Consumer goods or services",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Market Awards Consumer goods or services"
                                    },
                                    {
                                        "_id": "55c2df0e2a3965432eaac79b",
                                        "depth": 4,
                                        "name": "Fashion and Beauty",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Fashion and Beauty"
                                    }
                                ],
                                "type": "topic",
                                "par": "International Awards and Honours"
                            },
                            {
                                "_id": "55c2df0e2a3965432eaac79c",
                                "depth": 3,
                                "name": "Books and Authors",
                                "properties" : { "exam": "SBI Clerk" },
                                "children": [
                                    {
                                        "_id": "55c2df0e2a3965432eaac79d",
                                        "depth": 4,
                                        "name": "Biographies and Autobiographies",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Biographies and Autobiographies"
                                    },
                                    {
                                        "_id": "55c2df0f2a3965432eaac79e",
                                        "depth": 4,
                                        "name": "Fiction",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Fiction"
                                    },
                                    {
                                        "_id": "55c2df0f2a3965432eaac79f",
                                        "depth": 4,
                                        "name": "Non fiction",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Non fiction"
                                    }
                                ],
                                "type": "topic",
                                "par": "Books and Authors"
                            },
                            {
                                "_id": "55c2df0f2a3965432eaac7a0",
                                "depth": 3,
                                "name": "Business and Economy",
                                "properties" : { "exam": "SBI Clerk" },
                                "children": [
                                    {
                                        "_id": "55c2df0f2a3965432eaac7a1",
                                        "depth": 4,
                                        "name": "At risk Companies and Sectors",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "At risk Companies and Sectors"
                                    },
                                    {
                                        "_id": "55c2df0f2a3965432eaac7a2",
                                        "depth": 4,
                                        "name": "GDP or NDP or PP Ranking",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "GDP or NDP or PP Ranking"
                                    }
                                ],
                                "type": "topic",
                                "par": "Business and Economy"
                            },
                            {
                                "_id": "55c2df102a3965432eaac7a3",
                                "depth": 3,
                                "name": "Entertainment and Films",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Entertainment and Films"
                            },
                            {
                                "_id": "55c2df102a3965432eaac7a4",
                                "depth": 3,
                                "name": "Governance Schemes and Policies",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Governance Schemes and Policies"
                            },
                            {
                                "_id": "55c2df102a3965432eaac7a5",
                                "depth": 3,
                                "name": "Important People",
                                "properties" : { "exam": "SBI Clerk" },
                                "children": [
                                    {
                                        "_id": "55c2df102a3965432eaac7a6",
                                        "depth": 4,
                                        "name": "Reformers or Activists",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Reformers or Activists"
                                    },
                                    {
                                        "_id": "55c2df102a3965432eaac7a7",
                                        "depth": 4,
                                        "name": "Scientists",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Scientists"
                                    },
                                    {
                                        "_id": "55c2df102a3965432eaac7a8",
                                        "depth": 4,
                                        "name": "Politicians",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Politicians"
                                    },
                                    {
                                        "_id": "55c2df102a3965432eaac7a9",
                                        "depth": 4,
                                        "name": "Artists and Authors",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Artists and Authors"
                                    },
                                    {
                                        "_id": "55c2df112a3965432eaac7aa",
                                        "depth": 4,
                                        "name": "Bureaucrats",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Bureaucrats"
                                    }
                                ],
                                "type": "topic",
                                "par": "Important People"
                            },
                            {
                                "_id": "55c2df112a3965432eaac7ab",
                                "depth": 3,
                                "name": "International Affairs",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "International Affairs"
                            },
                            {
                                "_id": "55c2df112a3965432eaac7ac",
                                "depth": 3,
                                "name": "Organizations or Committee",
                                "properties" : { "exam": "SBI Clerk" },
                                "children": [
                                    {
                                        "_id": "55c2df112a3965432eaac7ad",
                                        "depth": 4,
                                        "name": "Judiciary",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Judiciary"
                                    },
                                    {
                                        "_id": "55c2df112a3965432eaac7ae",
                                        "depth": 4,
                                        "name": "Banking",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Banking"
                                    },
                                    {
                                        "_id": "55c2df112a3965432eaac7af",
                                        "depth": 4,
                                        "name": "Scams",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Scams"
                                    }
                                ],
                                "type": "topic",
                                "par": "Organizations or Committee"
                            },
                            {
                                "_id": "55c2df122a3965432eaac7b0",
                                "depth": 3,
                                "name": "Famous Places",
                                "properties" : { "exam": "SBI Clerk" },
                                "children": [
                                    {
                                        "_id": "55c2df122a3965432eaac7b1",
                                        "depth": 4,
                                        "name": "Wars and Incursions",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Wars and Incursions"
                                    },
                                    {
                                        "_id": "55c2df122a3965432eaac7b2",
                                        "depth": 4,
                                        "name": "Sporting and Summit Venues",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Sporting and Summit Venues"
                                    },
                                    {
                                        "_id": "55c2df122a3965432eaac7b3",
                                        "depth": 4,
                                        "name": "Festivals",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Festivals"
                                    },
                                    {
                                        "_id": "55c2df122a3965432eaac7b4",
                                        "depth": 4,
                                        "name": "Population",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Population"
                                    },
                                    {
                                        "_id": "55c2df122a3965432eaac7b5",
                                        "depth": 4,
                                        "name": "Literacy",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Literacy"
                                    },
                                    {
                                        "_id": "55c2df122a3965432eaac7b6",
                                        "depth": 4,
                                        "name": "Living Quality Index",
                                        "properties" : { "exam": "SBI Clerk" },
                                        "type": "subtopic",
                                        "par": "Living Quality Index"
                                    }
                                ],
                                "type": "topic",
                                "par": "Famous Places"
                            },
                            {
                                "_id": "55c2df132a3965432eaac7b7",
                                "depth": 3,
                                "name": "Science and Technology",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Science and Technology"
                            },
                            {
                                "_id": "55c2df132a3965432eaac7b8",
                                "depth": 3,
                                "name": "Summits and Treaties",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Summits and Treaties"
                            },
                            {
                                "_id": "55c2df132a3965432eaac7b9",
                                "depth": 3,
                                "name": "Sports",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Sports"
                            },
                            {
                                "_id": "55c2df132a3965432eaac7ba",
                                "depth": 3,
                                "name": "History",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "History"
                            },
                            {
                                "_id": "55c2df132a3965432eaac7bb",
                                "depth": 3,
                                "name": "Geography",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Geography"
                            },
                            {
                                "_id": "55c2df142a3965432eaac7bc",
                                "depth": 3,
                                "name": "Capitals and Currency",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Capitals and Currency"
                            },
                            {
                                "_id": "55c2df142a3965432eaac7bd",
                                "depth": 3,
                                "name": "Days and Dates",
                                "properties" : { "exam": "SBI Clerk" },
                                "type": "topic",
                                "par": "Days and Dates"
                            }
                        ],
                        "type": "chapter",
                        "par": "General Knowledge"
                    }
                ],
                "type": "subject",
                "par": "General Awareness"
            }
        ],
        "type": "exam",
        "par": ""
    }
];
