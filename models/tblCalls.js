module.exports = function(sequelize, DataTypes){
	var tblCalls = sequelize.define("tblCalls", {
		CallID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		CallDirection:{
			type: DataTypes.BOOLEAN,
			allowNull: false
		},
		CallNote:{
			type: DataTypes.STRING(4000),
			allowNull: false
		}
	},{
		freezeTableName: true,
		paranoid: true
	});
	return tblCalls;
};