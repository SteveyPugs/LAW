module.exports = function(sequelize, DataTypes){
	var tblNotes = sequelize.define("tblNotes", {
		NoteID: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		NoteText: {
			type: DataTypes.STRING(4000),
			allowNull: false
		}
	},{
		freezeTableName: true,
		paranoid: true
	});
	return tblNotes;
};