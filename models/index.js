var Sequelize = require("sequelize");
var config = require("../config").db;
var sequelize = new Sequelize(config.dbname, config.username, config.password, {
	host: config.host,
	dialect: "mysql",
	logging: false
});

var models = [{
	name: "tblUsers",
	file: "tblUsers"
},{
	name: "tblClients",
	file: "tblClients"
},{
	name: "tblCases",
	file: "tblCases"
},{
	name: "tblNotes",
	file: "tblNotes"
},{
	name: "tblCalls",
	file: "tblCalls"
},{
	name: "tblEvidence",
	file: "tblEvidence"
}];

models.forEach(function(model) {
	module.exports[model.name] = sequelize.import(__dirname + '/' + model.file);
});

sequelize.authenticate().then(function(err){
	if(err) console.log(err);
	(function(model){
		model.tblCases.belongsTo(model.tblUsers, {
			foreignKey: "UserID"
		});
		model.tblCases.belongsTo(model.tblClients, {
			foreignKey: "ClientID"
		});
		model.tblNotes.belongsTo(model.tblCases, {
			foreignKey: "CaseID"
		});
		model.tblNotes.belongsTo(model.tblUsers, {
			foreignKey: "UserID"
		});
		model.tblCalls.belongsTo(model.tblCases, {
			foreignKey: "CaseID"
		});
		model.tblCalls.belongsTo(model.tblUsers, {
			foreignKey: "UserID"
		});
		model.tblEvidence.belongsTo(model.tblCases, {
			foreignKey: "CaseID"
		});
		sequelize.sync({
			force: false
		}).then(function(){
			console.log("sync complete");
		}).catch(function(err){
			console.log(err);
		});
	})(module.exports);
}).catch(function(err){
	console.log(err);
});
