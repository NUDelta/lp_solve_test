var solver = require("../../node_modules/javascript-lp-solver/src/solver"),

prefs = [[0, 0, 1], [1, 1, 0], [0, 0, 1], [0, 1, 1]];

// prefs[i][j] = true if person i meets conditions j
// computes a matching of peoples to meet as many conditions j as possible

function generateConstraints(prefs) {
    var constraints = [];
    
    // generate one person per position constraints
    //    "x03 x13 x23 x33 <= 1",
    for (var j = 0; j < prefs[0].length; j++){
	var constraint = "";
	for (var i = 0; i < prefs.length; i++){
	    constraint += "x" + i + j + " ";	    
	}
	constraint += "<= 1"
	constraints.push(constraint)
    }
    
    // generate one position per person
    //"x11 x12 x13 <= 1",
    for (var i = 0; i < prefs.length; i++){
	var constraint = "";
	for(var j = 0; j < prefs[i].length; j++){
	    constraint += "x" + i + j + " ";
	}
	constraint += "<= 1"
	constraints.push(constraint)
    }
    
    // generate integer constraints
    for (var i = 0; i < prefs.length; i++){
	for(var j = 0; j < prefs[i].length; j++){
	    var name = "x" + i + j;
	    constraints.push("int " + name);
	}
    }
    return constraints;
}

function generateObjective(prefs) {
    //  [[0, 0, 1], [1, 1, 0], [0, 0, 1], [0, 1, 1]],
    //  => "max: 1 x02 1 x10 1 x11 1 x22 1 x31 1 x32"
    var obj = "";
    for (var i = 0; i < prefs.length; i++){
	for(var j = 0; j < prefs[i].length; j++){
	    var name = "x" + i + j;
	    var weight = prefs[i][j];
	    if (weight == 0) continue;
	    obj += " ";
	    obj += weight;
	    obj += " ";
	    obj += name;
	}
    }
    return "max:" + obj; 
}

var model = [];
model.push(generateObjective(prefs));
model = model.concat(generateConstraints(prefs));

console.log(model)

model = solver.ReformatLP(model);
results = solver.Solve(model);
console.log(results)
delete results['result'];
delete results['feasible'];
console.log(results)


