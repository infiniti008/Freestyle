var plan;
var arry;
function reload_plan() {
  plan = require('./raspisanie/plan.json');
  arry = [];
  for (var p in plan) {
    arry[p] = plan[p];
  }
  console.log(plan);
  // setTimeout(reload_plan, 10000);
}

reload_plan();

module.exports = {
  reload_plan : reload_plan
}
