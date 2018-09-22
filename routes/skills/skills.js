const PriorityQueue = require("js-priority-queue");
let parents = {};
let children = {};
let nodes = {};
let availables;
let target;
let bestPath
let bestScoreAttempt = {}

const allOpenNodes = trace =>
  trace.filter((node,k)=>trace.indexOf(node)===k).reduce((prev, currv) => [...prev, ...children[currv]], []);

const semiBestBfs = () => {
  const paths = new PriorityQueue({comparator:(a,b)=>a.points-b.points})
  paths.queue({trace:['__beep'],offense:0,points:0})
  while(paths.length){
    const path = paths.dequeue()
    // console.log(path)
    if(bestPath && path.points > bestPath.points){
      continue
    }else if(path.offense >= target){
      bestPath = path
      continue
    } else {
      const opens = allOpenNodes(path.trace)
      opens.forEach(newNode=>{
        if(bestPath && newNode.points+path.points > bestPath.points){
          return
        }else{
          const skill = nodes[newNode]
          if(skill.offense<1)return
          const newOffense = skill.offense+path.offense
          const newPoints = skill.points+path.points
          if(!bestScoreAttempt[newOffense] || bestScoreAttempt[newOffense]>newPoints){
            bestScoreAttempt[newOffense] = newPoints
            paths.queue({trace:[...path.trace,newNode],points:path.points+skill.points,offense:path.offense+skill.offense})
          }
        }
      })
    }
  }
}

const dfs = (trace, offense, points) => {
  if (offense >= target) {
    // console.log({trace,offense,points});
    if(bestPath){
      if(bestPath.points > points){
        bestPath = {path:trace,offense,points}
        return
      } else {
        return
      }
    } else {
      bestPath = {path:trace,offense,points}
      return
    }
    // paths.queue({path:trace,offense,points});
    return;
  } else {
    const opens = allOpenNodes(trace);
    // console.log({opens})
    if (opens.length === 0) {
      return;
    }
    opens.forEach(c =>{
      const newTrace = [...trace]
      if(true||newTrace.indexOf(c)===-1){
        newTrace.push(c)
        // console.log({newTrace})
        dfs([...trace, c], offense + nodes[c].offense, points + nodes[c].points)
      }
    }
    );
  }
  return;
};

const solve = data => {
  parents = { __beep: [] };
  children = { __beep: [] };
  bestPath = null
  bestScoreAttempt = {}
  nodes = {
    __beep: {
      name: "__beep",
      offense: 0,
      points: 0,
      require: null
    }
  };
  target = data.boss.offense;
  initNodes(data.skills);
  // dfs(["__beep"], 0, 0);
  semiBestBfs()
  return bestPath.trace.splice(1)
  // return paths.peek().path.splice(1);
};

const initNodes = skills => {
  skills.forEach(registerNode);
  // console.log(children)
  skills.forEach(skill => {
    const { name } = skill;
    nodes[name] = skill;
    if (skill.require) {
      parents[name].push(skill.require);
      // console.log(children[skill.require],skill.require)
      children[skill.require].push(name);
    } else {
      parents[name].push('__beep')
      children.__beep.push(name)
    }
  });
};

const registerNode = skill => {
  const { name } = skill;
  if (!(name in nodes)) {
    nodes[name] = skill;
    children[name] = [];
    parents[name] = [];
  }
};

module.exports = solve