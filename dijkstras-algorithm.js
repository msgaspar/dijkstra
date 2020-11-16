const fs = require('fs');
const readline = require('readline');

// Read graph from file
async function loadGraph(filename) {
  const graph = [null];

  const readStream = fs.createReadStream(filename);
  const rl = readline.createInterface({
    input: readStream,
    crlfDelay: Infinity,
  });

  for await (const line of rl) {
    const splitLine = line.replace(/ /g, '').split('\t');
    const vertex = splitLine[0];
    if (splitLine.length < 1) {
      graph[vertex] = [null];
    } else {
      const edges = splitLine
        .slice(1, -1)
        .map(edge => edge.split(',').map(n => Number(n)));
      graph[vertex] = edges;
    }
  }
  return graph;
}

//Dijkstra's algorithm
function dijkstra(graph, s) {
  const nVertices = graph.length - 1;
  let crossingEdges = Array();
  const lengths = Array(nVertices + 1).fill(null);

  const processedVertices = [s];

  lengths[s] = 0;

  graph[s].forEach(e => {
    const formattedEdge = [s, e[0], e[1], e[1]]; // [start, end, length, score]
    crossingEdges.push(formattedEdge);
  });

  while (crossingEdges.length >= 1) {
    // Select edge with minimum score
    crossingEdges.sort((a, b) => a[3] - b[3]);
    const nextEdge = crossingEdges.shift();

    const vertexW = nextEdge[1];
    const score = nextEdge[3];
    lengths[vertexW] = score;

    processedVertices.push(vertexW);

    // Add new crossing edges
    graph[vertexW].forEach(e => {
      const formattedEdge = [vertexW, e[0], e[1], score + e[1]];
      crossingEdges.push(formattedEdge);
    });

    // Update crossing edges
    const updatedCrossingEdges = crossingEdges.filter(e => {
      return (
        processedVertices.includes(e[0]) && !processedVertices.includes(e[1])
      );
    });
    crossingEdges = [...updatedCrossingEdges];
  }

  return lengths;
}

// Run algorithm
async function run() {
  const graph = await loadGraph(__dirname + '/input.txt');
  const result = dijkstra(graph, 1);
  console.log(
    result[7],
    result[37],
    result[59],
    result[82],
    result[99],
    result[115],
    result[133],
    result[165],
    result[188],
    result[197]
  );
}

run();
