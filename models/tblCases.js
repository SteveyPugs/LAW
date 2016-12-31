module.exports = function(sequelize, DataTypes){
	var tblCases = sequelize.define("tblCases", {
		CaseID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		CaseStartDate: {
			type: DataTypes.DATE,
			allowNull: false
		},
		CaseEndDate: {
			type: DataTypes.DATE
		}
	},{
		freezeTableName: true,
		paranoid: true
	});
	return tblCases;
};