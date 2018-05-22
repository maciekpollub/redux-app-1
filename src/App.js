import React, { Component } from 'react';

class App extends Component {
  
  
  
  
  
  render() {
  
    const roads = [
     "P1-P2", "P1-P3", "P2-P5", "P5-P6", "P6-P7", "P7-P8",
      "P8-P9", "P8-P10", "P11-P9", "P11-P4"
    ]  
  
    function buildGraph(edges){
      let graph = Object.create(null);
      function addEdge( from, to) {
        if (graph[from] == null) {
          graph[from] = [to]
        } else {
          graph[from].push(to);
        }
      }
      for (let [from, to] of edges.map(r => r.split("-"))) {
        addEdge(from, to);
        addEdge(to, from);
      }
      return graph;
    }
    const roadGraph = buildGraph(roads);

    
    class VillageState {
      constructor(place, parcels){
        this.place = place;
        this.parcels = parcels;
      }
      move(destination) {
        if (!roadGraph(this.place).includes(destination)) {
          return this;//if there is no connecion from P3 to P5, say, we stay at P3, nothing changes...
        } else {
          let parcels = this.parcels.map(p => {
            if (p.place != this.place) return p;// if the place of a certain parcel isn't the same as the place of the robot, nothing changes..
            return {place: destination, address: p.address}//the place of a spotted parcel is destination and the parcel's address has not changed
          }).filter(p => p.place != p.address);
          return new VillageState(destination, parcels);
        }
      }
    }

    function runRobot(state, robot, memory) {
      for(let turn = 0; ; turn++){
        if(state.parcels.length === 0){
          console.log(`Cong, done in ${turn} turns`);
          break;
        }
        let action = robot(state, memory);
        state = state.move(action.direction);
        memory = action.memory;//looks like robot is a function returning an object with properties: direction, memory..
      }
    }

   /* function randomPick(array){
      let choice = Math.floor(Math.random() * array.length);
      return array[choice];
    }

    function randomRobot(state){
      return{
        direction: randomPick(roadGraph[state.place])
      }
    }





    VillageState.random = function (parcelCount = 5) {
      let parcels = [];
      for (let i = 0; i < parcelCount; i++) {
        let address = randomPick(Object.keys(roadGraph));
        let place;
        do {
          place = randomPick(Object.keys(roadGraph));
        } while (place == address);
        parcels.push({place: place,
        address: address})
            }
    }
*/

    const mailRoute = ["P1","P3","P1", "P2", "P5", "P6", "P7", "P8","P10", "P8","P9", "P11", "P4" ];

    function routeRobot(state, memory) {
      if (memory.length === 0) {
        memory = mailRoute;
      }
      return {direction: memory[0], memory: memory.slice(1)};
    }


    function findRoute(graph, from, to){
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

  let way = findRoute(roadGraph, "P5", "P9");
  console.log(way);




    
    return (
      <div className="App">
        <h1>Robot-project from Eloquent JavaScript</h1>
      </div>
    );
  }
}

export default App;
