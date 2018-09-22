const Graph = require('./graph')

let children = {}
let parents = {}
let nodes = {}
let ancesters = {}

const minBroadcast = ({data}) => {
  initNodes(data)
  // console.log({children,parents,nodes})
  generateAncesterList()
  // console.log({ancesters})
  reduceAncesterList()
  // console.log({ancesters})
  let sendList = broadcastOut()
  // console.log(sendList)
  return sendList
}

const findMostConnected = ({data}) => {
  initNodes(data)
  // console.log({children,parents,nodes})
  generateAncesterList()
  console.log(ancesters)
  reduceAncesterList()
  // console.log(ancesters)
  let mostConnected = mostConnectedOut()
  console.log(mostConnected)
  return mostConnected
}

const findShortestPath = ({data,sender,recipient}) => {
  const relations = data.map(str=>({nodes:str.replace(/,.*/g,'').split('->'),weight:Number(str.match(/,\d*/)[0].match(/\d/)[0])}))
  const map = {}
  relations.forEach(relation=>{
    const {nodes:[p,c],weight} = relation
    if(! (p in map)){
      map[p] = {}
    }
    map[p][c] = weight
  })
  const graph = new Graph(map)
  const path = graph.findShortestPath([sender,recipient])
  console.log(path)
  return path
}

const registerNode = node => {
  if(!(node in nodes)){
    children[node] = []
    parents[node] = []
    // ancesters[node] = []
    nodes[node] = true
  }
}

const initNodes = data => {
  children = {}
  parents = {}
  nodes = {}
  ancesters = {}
  const relations = data.map(str=>str.replace(/,.*/g,'').split('->'))
  relations.forEach(([p,c])=>{
    registerNode(p)
    registerNode(c)
    parents[c].push(p)
    children[p].push(c)
  })
}

const generateAncesterList = () => {
  let nodeSum = Object.keys(nodes).length
  // console.log(nodeSum,Object.keys(ancesters).length)
  while(Object.keys(ancesters).length < nodeSum){
    const node = Object.keys(nodes).filter(node=>!(node in ancesters))[0]
    // console.log('find ancestor of which is not in list'+node)
    findAncester(node)
  }
}

const findAncester = (node) => {
  const unvisitedParents = parents[node].filter(p=>!(p in ancesters))
  const visitedParents = parents[node].filter(p=>(p in ancesters))
  // console.log({node,unvisitedParents,visitedParents})
  if(!(node in ancesters)){
    ancesters[node] = [node]
  }
  visitedParents.forEach(p=>{
    ancesters[node].push(...ancesters[p])
  })
  if(unvisitedParents.length === 0){
    return ancesters[node]
  }
  unvisitedParents.forEach((p)=>{
    ancesters[node].push(...findAncester(p))
  })
  return ancesters[node]
}

const reduceAncesterList = () => {
  for(let node in nodes){
    ancesters[node] = ancesters[node].reduce((prev, currv)=>(prev.indexOf(currv)===-1?[...prev,currv]:prev),[])
  }
}

const broadcastOut = () => {
  //mark the frequency of nodes
  const marks = gradeNodes()
  const sendList = []
  let notSentNodes
  console.log(marks)
  // console.log(Object.keys(nodes).filter(node=>(nodes[node])))
  // console.log(Object.keys(nodes).filter(node=>(nodes[node])).sort((a,b)=>{console.log(a,marks[a]); return marks[b] - marks[a]}))
  while(notSentNodes = Object.keys(nodes).filter(node=>(nodes[node])).sort((a,b)=>{return marks[b] - marks[a]})){
    if(notSentNodes.length === 0)break
    // console.log('push',notSentNodes[0])
    sendList.push(notSentNodes[0])
    sendNode(notSentNodes[0])
  }
  return sendList
}

const gradeNodes = () => {
  const marks = {}
  Object.keys(nodes).forEach(node=>{
    ancesters[node].forEach(ancester=>{
      marks[ancester] = marks[ancester] || 0
      marks[ancester]++
    })
  })
  return marks
}

const sendNode = (node)=> {
  // console.log('sendnode',node)
  nodes[node] = false
  // console.log('chilren',children[node],nodes[children[node][0]])
  children[node].forEach(c=>(nodes[c]&&sendNode(c)))
  return true
}

const mostConnectedOut = () => {
  const marks = gradeNodes()
  console.log(marks)
  return Object.keys(nodes).filter(node=>(nodes[node])).sort((a,b)=>{return marks[b] - marks[a]})[0]
}

module.exports = {
  minBroadcast,
  findMostConnected,
  findShortestPath
}
