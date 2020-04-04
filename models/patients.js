const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Patients Schema
const PatientsSchema = new Schema({
  bsn: [{ type: Schema.Types.ObjectId, ref: "BSN" }],
  name: String,
  birthdate: Date,
  healthcareworker: [{ type: Schema.Types.ObjectId, ref: "Users" }],
  status: {
    type: String,
    enum: ["Home", "Hospitalized", "Intensive Care", "Dead", "Recovered"],
    required: true
  },
  region: {
    type: String,
    enum: [
      "Dienst Gezondheid & Jeugd Zuid-Holland Zuid",
      "GGD Amsterdam",
      "GGD Brabant-Zuidoost",
      "GGD Drenthe",
      "GGD Fryslân",
      "GGD Gelderland-Zuid",
      "GGD Gooi en Vechtstreek",
      "GGD Groningen",
      "GGD Haaglanden",
      "GGD Hart voor Brabant",
      "GGD Hollands-Midden",
      "GGD Hollands-Noorden",
      "GGD IJsselland",
      "GGD Kennemerland",
      "GGD Limburg-Noord",
      "GGD Noord- en Oost-Gelderland",
      "GGD regio Utrecht",
      "GGD Rotterdam-Rijnmond",
      "GGD Twente",
      "GGD West-Brabant",
      "GGD Zaanstreek/Waterland",
      "GGD Zeeland",
      "GGD Zuid-Limburg",
      "Veiligheids- en Gezondheidsregio Gelderland-Midden"
    ],
    required: true
  }
});

const Patients = mongoose.model("Patients", PatientsSchema);
module.exports = Patients;