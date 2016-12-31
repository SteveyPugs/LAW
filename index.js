var express = require("express");
var exphbs = require("express-handlebars");
var models = require("./models");
var path = require("path");
var crypto = require("crypto");
var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
var Chance = require("chance");
var bcrypt = require("bcrypt");
var lodash = require("lodash");
var moment = require("moment");
var fs = require("fs");
var crypto = require("crypto");
var multer  = require("multer");
var storage_config = require("./config").storage;
var storage = multer.memoryStorage();
var upload = multer({
	storage: storage
});
var internals = {};
internals.encrypt = function(buffer){
	var cipher = crypto.createCipher("aes-256-ctr", storage_config.encryption_password)
	return Buffer.concat([cipher.update(buffer),cipher.final()]);
};
internals.decrypt = function(buffer){
	var decipher = crypto.createDecipher("aes-256-ctr", storage_config.encryption_password)
	return Buffer.concat([decipher.update(buffer) , decipher.final()]);
};
if(!fs.existsSync("storage/" + storage_config.evidence_folder)){
	fs.mkdirSync("storage/" + storage_config.evidence_folder)
}
var us = require("us");
var chance = new Chance();
var app = express();
app.use(bodyParser.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(bodyParser.json());
app.engine(".html", exphbs({
	helpers: {
		paddingNumber: function(number){
			var padLen = 4 - number.toString().length;
			var i;
			var padValue = "";
			for (i = 1; i <= padLen; i++) {
				padValue = padValue + "0";
			};
			padValue = padValue + number;
			return padValue;
		},
		date: function(date, format){
			if(date){
				return moment(date).format(format);	
			}
			else{
				return "-";
			}
		}
	},
	extname: ".html",
	defaultLayout: "main"
}));
app.set("view engine", ".html");
app.use(express.static("bower_components"));
app.use(express.static("bower_components/foundation-sites/dist"));
app.use(express.static("app"));
function auth(req, res, next){
	if(lodash.isEmpty(req.cookies)){res.redirect("/")}
	else{next()}
};
app.get("/", function(req, res){
	res.render("login", {
		layout: "static"
	});
});
app.post("/login", function(req, res){
	models.tblUsers.find({
		where:{
			UserEmail: req.body.UserEmail,
			deletedAt: null,
			UserConfirmed: true
		},
		raw: true,
		attributes: ["UserID", "UserEmail", "UserPassword", "UserFirstName", "UserLastName"]
	}).then(function(user){
		if(user){
			bcrypt.compare(req.body.UserPassword, user.UserPassword, function(err, valid){
				if(err) return res.send(err);
				if(valid){
					res.cookie("User", {
						UserID: user.UserID,
						UserEmail: user.UserEmail,
						UserFirstName: user.UserFirstName,
						UserLastName: user.UserLastName
					}).redirect("/dashboard");
				}
				else{
					res.send("CRAP")
				}
			});
		}
		else{
			res.send("CRAP")
		}
	}).catch(function(err){
		return res.send(err);
	});
});
app.get("/register", function(req, res){
	res.render("register", {
		layout: "static"
	});
});
app.post("/register", function(req, res){
	var randomPassword = chance.word({
		length: 12
	});
	console.log(randomPassword);//for now leave until email is ready
	bcrypt.hash(randomPassword, 10, function(err, hash){
		if(err) return res.send(err);
		models.tblUsers.create({
			UserEmail: req.body.UserEmail,
			UserPassword: hash,
			UserFirstName: req.body.UserFirstName,
			UserLastName: req.body.UserLastName,
			UserConfirmed: true, //false - change to this later!
			UserConfirmHash: crypto.randomBytes(20).toString("hex"),
		}).then(function(user){
			res.redirect("/");
		}).catch(function(err){
			return res.send(err);
		});
	});
});
app.get("/dashboard", auth, function(req, res, next){
	res.render("home");
});
app.get("/case/new", auth, function(req, res, next){
	res.render("case-new");
});
app.post("/case/new", auth, function(req, res, next){
	models.tblCases.create({
		CaseStartDate: req.body.CaseStartDate,
		CaseEndDate: req.body.CaseEndDate.length > 1 ? req.body.CaseEndDate : null,
		UserID: req.cookies.User.UserID,
		ClientID: req.body.ClientID
	}).then(function(newcase){
		res.redirect("/case/view/" + newcase.CaseID);
	}).catch(function(){
		return res.send(err);
	});
});
app.get("/case/view/:id", auth, function(req, res, next){
	models.tblCases.find({
		where:{
			CaseID: req.params.id
		},
		include:[{
			model: models.tblClients
		}]
	}).then(function(case_file){
		var case_file = case_file.dataValues;
		case_file.tblClient = case_file.tblClient.dataValues;
		res.render("case-view", {
			case_file: case_file
		});
	}).catch(function(err){
		return res.send(err);
	});
});
app.get("/client/new", auth, function(req, res, next){
	res.render("client-new", {
		states: us.states
	});
});
app.post("/client/new", auth, function(req, res, next){
	models.tblClients.create({
		ClientFirstName: req.body.ClientFirstName,
		ClientLastName: req.body.ClientLastName,
		ClientPhone: req.body.ClientPhone,
		ClientEmergencyName: req.body.ClientEmergencyName,
		ClientEmergencyPhone: req.body.ClientEmergencyPhone,
		ClientEmergencyAddress: req.body.ClientEmergencyAddress,
		ClientPrimaryAddress: req.body.ClientPrimaryAddress,
		ClientPrimaryCity: req.body.ClientPrimaryCity,
		ClientPrimaryState: req.body.ClientPrimaryState,
		ClientPrimaryZip: req.body.ClientPrimaryZip,
		ClientSecondaryAddress: req.body.ClientSecondaryAddress.length > 0 ? req.body.ClientSecondaryAddress : null,
		ClientSecondaryCity: req.body.ClientSecondaryCity.length > 0 ? req.body.ClientSecondaryCity : null,
		ClientSecondaryState: req.body.ClientSecondaryState.length > 0 ? req.body.ClientSecondaryState : null,
		ClientSecondaryZip: req.body.ClientSecondaryZip.length > 0 ? req.body.ClientSecondaryZip : null 
	}).then(function(user){
		res.redirect("/client/search");		
	}).catch(function(err){
		return res.send(err);
	});
});
app.get("/client/view/:id", auth, function(req, res, next){
	res.render("client-view");
});
app.get("/client/list", auth, function(req, res, next){
	models.tblClients.findAll({
		where:{
			deletedAt:{
				$eq: null
			}
		},
		raw: true
	}).then(function(clients){
		res.send(clients);
	}).catch(function(err){
		res.send(err);	
	})
});
app.get("/client/search", auth, function(req, res, next){
	res.render("client-search");
});
app.get("/note/list/:id", auth, function(req, res, next){
	models.tblNotes.findAll({
		where:{
			CaseID: req.params.id,
			deletedAt: null
		},
		order: "createdAt DESC",
		include:[{
			model: models.tblUsers
		}]
	}).then(function(notes){
		var notes = lodash.map(notes, "dataValues");
		lodash.forEach(notes, function(n){
			n.createdAt = moment(n.createdAt).format("YYYY-MM-DD hh:mm A");
			n.tblUser = n.tblUser.dataValues;
		});
		res.send(notes);
	}).catch(function(err){
		res.send(err);	
	});
});
app.post("/note/new", auth, function(req, res, next){
	models.tblNotes.create({
		NoteText: req.body.NoteText,
		CaseID: req.body.CaseID,
		UserID: req.cookies.User.UserID
	}).then(function(note){
		res.send("success");
	}).catch(function(err){
		res.send(err);	
	});
});
app.get("/call/list/:id", auth, function(req, res, next){
	models.tblCalls.findAll({
		where:{
			CaseID: req.params.id,
			deletedAt: null
		},
		order: "createdAt DESC",
		include:[{
			model: models.tblUsers
		}]
	}).then(function(notes){
		var notes = lodash.map(notes, "dataValues");
		lodash.forEach(notes, function(n){
			n.createdAt = moment(n.createdAt).format("YYYY-MM-DD hh:mm A");
			n.tblUser = n.tblUser.dataValues;
		});
		res.send(notes);
	}).catch(function(err){
		res.send(err);	
	});
});
app.post("/call/new", auth, function(req, res, next){
	models.tblCalls.create({
		CallNote: req.body.CallNote,
		CallDirection: req.body.CallDirection,
		CaseID: req.body.CaseID,
		UserID: req.cookies.User.UserID
	}).then(function(note){
		res.send("success");
	}).catch(function(err){
		res.send(err);	
	});
});
app.post("/evidence/new", upload.single("EvidenceFile"), auth, function(req, res, next){
	models.tblEvidence.create({
		EvidenceName: req.body.EvidenceName,
		EvidenceFileName: req.file.originalname,
		EvidenceFileType: req.file.mimetype,
		CaseID: req.body.CaseID
	}).then(function(evidence){
		var buffer = req.file.buffer.length > 0 ? req.file.buffer : new Buffer("");
		fs.writeFile("storage/" + storage_config.evidence_folder + "/" + evidence.EvidenceGUID, internals.encrypt(buffer), function(err){
			if(err) console.log(err);
			else res.send("success");
		});
	}).catch(function(err){
		res.send(err);
	});
});
app.get("/evidence/list/:id", auth, function(req, res, next){
	models.tblEvidence.findAll({
		where:{
			CaseID: req.params.id,
			deletedAt: null
		},
		order: "createdAt DESC",
	}).then(function(evidences){
		var evidences = lodash.map(evidences, "dataValues");
		lodash.forEach(evidences, function(e){
			e.createdAt = moment(e.createdAt).format("YYYY-MM-DD hh:mm A");
		});
		res.send(evidences);
	}).catch(function(err){
		res.send(err);	
	});
});
app.get("/evidence/:EvidenceGUID", auth, function(req, res, next){
	models.tblEvidence.find({
		where:{
			EvidenceGUID: req.params.EvidenceGUID
		},
		raw: true
	}).then(function(evidence){
		fs.readFile("storage/" + storage_config.evidence_folder + "/" + req.params.EvidenceGUID, function(err, data){
			if(err) console.log(err);
			var decryptedFile = internals.decrypt(data);
			res.setHeader("Content-disposition", "attachment; filename=" + evidence.EvidenceFileName);
			res.setHeader("Content-type", evidence.EvidenceFileType);
			res.end(decryptedFile);
		});
	}).catch(function(err){
		res.send(err);	
	});
});
app.get("/logout", function(req, res){
	res.send("seeyA!");
});
app.listen(3000);