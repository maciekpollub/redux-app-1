import React, { Component } from 'react';

class App extends Component {

    
  render() {
    "use strict"
    const roads = [
      "P1-P2",
      "P2-P3",
      "P3-P5",
      "P2-P4",
      "P4-P3"
    ]
    
    function buildGraph(edges){
      let graph = {};
      function addEdge(from, to){
        if (graph[from] == null) {
          graph[from] = [to]
        } else {
          graph[from].push(to)
        }
      }
      for (let [from, to] of edges.map(e => e.split("-"))){
        addEdge(from, to);
        addEdge(to, from);
      }
      return graph;
    }

    const roadGraph = buildGraph(roads);
    
    class VillageState{
      constructor(rPlace, undelParcels){
        this.rPlace = rPlace;
        this.undelParcels = undelParcels;
      }
      move(destination) {
        if (!roadGraph[this.rPlace].includes(destination)){
          return this;
        } else {
          let undelParcels = this.undelParcels.map(p => {
            if (p.place !== this.rPlace) {
              return p;
            } else {
              return {place: destination, address: p.address};
              }
            }  
          ).filter(p => (
            p.address !== p.place
          ));
         return new VillageState(destination, undelParcels); 
        }
      };
    }

    VillageState.random = function (parcelCount) {
      let undelParcels = [];
        let rPlace = randomPick(Object.keys(roadGraph));
        for (let i = 0; i < parcelCount; i++) {
          let address = randomPick(Object.keys(roadGraph));
          let place;
          do {
            place = randomPick(Object.keys(roadGraph))
          } while (
            address === place
          );
          undelParcels.push({
            place: place,
            address: address
          })
        }
        return new VillageState(rPlace, undelParcels);
    }
//----------------------------------------------------------------------------
    function randomPick(array) {
      let choice = Math.floor(Math.random() * array.length);
      return array[choice];
    }

    function randomRobot(state) {
      return {direction: randomPick(roadGraph[state.rPlace])};
    }

    function runRobot(state, robotType) {
      for (let turn = 0; ; turn++) {
        if (state.undelParcels.length === 0) {
          console.log(`Congratulations, you have finished in ${turn} steps`);
          break;
        }
        let action = robotType(state);
        state = state.move(action.direction);
      }
    }

    /*runRobot(VillageState.random(), randomRobot);---------------------------*/
  
    const mailRoute = [ "P1", "P2" , "P4" , "P3" , "P5", "P3", "P4", "P2", "P1" ];
    function fixedRouteRobot(state, memory) {
      if (memory.length === 0) {
        memory = mailRoute;
      }
      return {
        direction: memory[0],
        memory: memory.slice(1)
      };
    }
    function runFRobot(state, robotType, memory) {
      for (let turn = 0; turn < 1000; turn++) {
        if (state.undelParcels.length < 2) {
          console.log(`Congratulations, you have finished in ${turn} steps`);
          break;
        }
        let action = robotType(state, memory);
        state = state.move(action.direction);
        memory = action.memory;
      }
    }
    
    
   /* runFRobot(VillageState.random(10), fixedRouteRobot, mailRoute);--------------*/

    function findOptRoute(graph, from, to){
      let work = [{at: from, route: []}];
      for (let i = 0; i < work.length; i++){
        let {at, route} = work[i];
        for (let place of graph[at]) {
          if (place === to ) {
            return route.concat(place);
          }
          if (!work.some(e => e.at === place)){
            work.push({at: place, route: route.concat(place)})
          }
        }
      }
    }

    function goalOrientedRobot(state, route) {
      if (route.length === 0) {
        let parcel = state.undelParcels[0];
      if (parcel.place !== state.rPlace) {
        route = findOptRoute(roadGraph, state.rPlace, parcel.place)
      } else {
        route = findOptRoute(roadGraph, state.rPlace, parcel.address)
      }
    }
      return{
        direction: route[0],
        memory: route.slice(1)
      }
    }

    
  function runGoalOrientedRobot(state, robotType, route) {
    for (let turn = 0; turn < 1000; turn++) {
      if (state.undelParcels.length === 0) {
        console.log(`Congratulatins, you have finished the task in ${turn} turns...`);
        break;
      }
      let action = goalOrientedRobot(state, route);
      state = state.move(action.direction);
      route = action.memory;
    }
  }
  let initialState = VillageState.random(10);  
  /*runGoalOrientedRobot(initialState, goalOrientedRobot, findOptRoute(roadGraph, "P1", initialState.undelParcels[0].place));*/
/*----------------------------------------------------Exercise 1 -----------------------------------*/
  function doTask(state, robot, memory) {
    for (let turn = 0; turn < 1000; turn++) {
      if (state.undelParcels.length === 0) {
        let score = turn;
        return score;
      }
      let action = robot(state, memory)
      state = state.move(action.direction);
      memory = action.memory;
    }
  }

  function compareRobots(robot1, robot2, startingMemory) {
    let array1=[];
    let array2=[];
    for (let i = 0; i < 100; i++) {
      let entryState = VillageState.random(10);
      let score1 = doTask(entryState, robot1, startingMemory);
      let score2 = doTask(entryState, robot2, startingMemory);
      array1.push(score1);
      array2.push(score2);         
    }
    let sum1 =0;
    let sum2 = 0;
    for (let j = 0; j < 100; j++) {
      sum1 += array1[j];
      sum2 += array2[j];
    }
    console.log(`The first robots avarage result is ${sum1 / 100} whereas the second: ${sum2 / 100}.`) 
  }
  

   /* compareRobots(goalOrientedRobot, fixedRouteRobot, mailRoute);*/
    
    /*---------------------------------------------Exercise 2--------------------------------------*/

    function routesAssessingRobot(state, route) {
      if (route.length === 0) {
        let routes = state.undelParcels.map(p => {
          if (p.place !== state.rPlace) {
            return {
              route: findOptRoute(roadGraph, state.rPlace, p.place),
              pickUp: true
            }
          } else {
              return {
                route: findOptRoute(roadGraph, state.rPlace, p.address),
                pickUp: false
              }
            }
          }
        );
        function score({route, pickUp}) {
          return (pickUp ? 0.5 : 0) - route.length;
        }
        route = routes.reduce((a,b) => score(a) > score(b) ? a : b).route;  
      }
      return {
        direction: route[0],
        memory: route.slice(1)
      };
    }
    /*runGoalOrientedRobot(VillageState.random(10), routesAssessingRobot, []);

    compareRobots(goalOrientedRobot, routesAssessingRobot, mailRoute);

    function promptDirection(question) {
      let result = prompt(question);
      if (result.toLowerCase() === "left") return "L";
      if (result.toLowerCase() === "right") return "R";
      throw new Error ("You introduce invalid direction: " + result);
    }
    function look() {
      if (promptDirection("Which way?") === "L") {
        return "a house";
      } else {
        return "two angry bears...";
      }
    }
    try {
      console.log("You see", look());
    } catch (error) {
      console.log("Something went wrong: " + error)
    }*/
   /*  
   const accounts = {
     a: 1000,
     b: 200,
     c: 500
   };
    
   function getAmount(){
     let amount = prompt("Enter the quantity you want to transfer:");
     if(amount <= 0) {
       throw new Error(`The quantity has to be positive.`);
     }
     return Number(amount);
   }

   function getWithdrawalAccount() {
     let wAccountName = prompt("Enter an account name you want to withdraw money from:");
     if (!accounts.hasOwnProperty(wAccountName)) {
       throw new Error(`No such account: ${wAccountName}`);
     }
     return wAccountName;
   }

   function getAssignmentAccount() {
     let aAccountName = prompt("Enter the account name you want to transfer money to:")
     if (!accounts.hasOwnProperty(aAccountName)) {
       throw new Error(`No such account: ${aAccountName}`);
     }
     return aAccountName;
   }

  function transfer() {
    let amount = getAmount();
    let from = getWithdrawalAccount();
    let to = getAssignmentAccount();
      if (accounts[from] < amount) {
        console.log("Operation disallowed....");
        return;
      };
     let progress = 0;
     try {
       accounts[from] -= amount;
       progress = 1;
       accounts[to] += amount;
       progress = 2;
     } finally {
       if(progress === 1){
         accounts[to] += amount;
       }
     }
    }
    
    transfer();
    console.log(accounts);
    
    */

    function writeYourName(name) {
      let word = name.toUpperCase();
      switch(word) {
        case "JAN":
          return "J"
          break;
        case "MICHAŁ":
          return "M"
          break;
        default:
        throw new Error("Unfortunatelly, I can not recongnise name " + word +".");
      }
    }
    function sentence (name1) {
      if (writeYourName(name1)=== "J") {
        return "Hi Jan..."
      } else {
        return "Hi Michałj..."
      }
    }
    try {
      alert(sentence("Jan"))
    } catch (error) {
      alert ("sth went wrong...")
    }
    
    
    
    
    
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   



   /* function findRoute(graph, from, to){
      let work = [{at: from, route: []}];
      for (let i = 0; i < work.length; i++){
        let {at, route} = work[i];//in ES5: let at = from; let route = [];
        for (let place of graph[at]){//we run over all points reachable from P1(='from', say)
          if (place === to){
            return route.concat(place);  
          }
          if (!work.some(e => e.at === place)){
            work.push({at: place, route: route.concat(place)});
          }
        }
      }
    }

  

    function goalOrientedRobot({place, parcels}, route) {
      if (route.length == 0) {//in case the route was empty, we should have walked along the edges indicated in the route..
        let parcel = parcels[0];
        if (parcel.place !== place){
          route = findRoute(roadGraph, place, parcel.place);
        } else {
          route = findRoute(roadGraph, place, parcel.address);
        }//so, if the particular parcel is at another place than the robot, we move to that place to take it, otherwise we move to the place the parcel is addressed to.. 
      }
      return {direction: route[0], memory: route.slice(1)};
    }





    function startRobot(state, robot) {
      for (let turn = 0; ; turn++) {
        if(state.parcels.length === 0){
          console.log(`Congrats, done in ${turn} turns`);
          break;
        }
        let action = robot(state);
        state = state.move(action.direction);
    }
  }

    startRobot(VillageState.random(), goalOrientedRobot);

    */
    return (
      <div className="App">
        <h1>Robot-project from Eloquent JavaScript</h1>
      </div>
    );
  }
}

export default App;
