import React, { Component } from 'react';

class App extends Component {
  
  
  
  
  
  render() {
  
    const roads = [
     " P1 - P2", "P1 - P3", "P1 - P4", "P2 - P5", "P6 - P7", "P6 - P5", "P7 - P8",
      "P8 - P9", "P8 - P10", "P11 - P9", "P11 - P4", "P11 - P10", "P11 - P5", "P10 - P5"
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
    console.log(buildGraph(roads));
    return (
      <div className="App">
        <h1>Robot-project from Eloquent JavaScript</h1>
      </div>
    );
  }
}

export default App;
