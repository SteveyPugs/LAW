module.exports = function(sequelize, DataTypes){
	var tblClients = sequelize.define("tblClients", {
		ClientID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		ClientFirstName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		ClientLastName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		ClientPhone: {
			type: DataTypes.STRING,
			allowNull: false
		},
		ClientEmergencyName: {
			type: DataTypes.STRING,
			allowNull: false
		},
		ClientEmergencyPhone: {
			type: DataTypes.STRING,
			allowNull: false
		},
		ClientEmergencyAddress: {
			type: DataTypes.STRING,
			allowNull: false
		},
		ClientPrimaryAddress: {
			type: DataTypes.STRING,
			allowNull: false
		},
		ClientPrimaryCity: {
			type: DataTypes.STRING,
			allowNull: false
		},
		ClientPrimaryState: {
			type: DataTypes.STRING,
			allowNull: false
		},
		ClientPrimaryZip: {
			type: DataTypes.STRING,
			allowNull: false
		},
		ClientSecondaryAddress: {
			type: DataTypes.STRING
		},
		ClientSecondaryCity: {
			type: DataTypes.STRING
		},
		ClientSecondaryState: {
			type: DataTypes.STRING
		},
		ClientSecondaryZip: {
			type: DataTypes.STRING
		}
	},{
		freezeTableName: true,
		paranoid: true
	});
	return tblClients;
};