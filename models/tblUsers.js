module.exports = function(sequelize, DataTypes){
	var tblUsers = sequelize.define("tblUsers", {
		UserID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		UserEmail: {
			type: DataTypes.STRING,
			allowNull: false
		},
		UserPassword: {
			type: DataTypes.STRING,
			allowNull: false
		},
		UserFirstName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		UserLastName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		UserConfirmed:{
			type: DataTypes.BOOLEAN,
			allowNull: false
		},
		UserConfirmHash:{
			type: DataTypes.STRING,
			allowNull: false
		}
	},{
		freezeTableName: true,
		paranoid: true
	});
	return tblUsers;
};