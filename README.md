This is self-educational repo on react with redux.
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
  
    const mailRoute = [ "P1" , "P2" , "P4" , "P3" , "P5", "P3", "P4", "P2", "P1" ];
    function fixedRouteRobot(state, memory) {
      /*if (memory.length === 0) {
        memory = mailRoute;
      }*/
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

   function smartRobot(state, route) {
    if(route.length === 0) {
      let parcel = state.udelParcels[0];
      if (parcel.place !== state.rPlace) {
        route = findOptRoute(roadGraph, state.rPlace, parcel.place);
      }
    }
   }