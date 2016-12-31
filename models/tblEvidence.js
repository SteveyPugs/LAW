module.exports = function(sequelize, DataTypes){
	var tblEvidence = sequelize.define("tblEvidence", {
		EvidenceID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		EvidenceGUID: {
			allowNull: false,
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4
		},
		EvidenceName: {
			allowNull: false,
			type: DataTypes.STRING(255)
		},
		EvidenceFileName: {
			allowNull: false,
			type: DataTypes.STRING(255)
		},
		EvidenceFileType: {
			allowNull: false,
			type: DataTypes.STRING(255)
		}
	},{
		freezeTableName: true,
		paranoid: true
	});
	return tblEvidence;
};