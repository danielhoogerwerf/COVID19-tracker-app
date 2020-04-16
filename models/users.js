const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Users Schema
const UsersSchema = new Schema(
  {
    username: String,
    password: String,
    passwordflag: {
      type: Boolean,
      default: false
    },
    role: {
      type: String,
      enum: ["GUEST", "HEALTHWORKER", "ADMIN"],
      default: "GUEST"
    },
    region: {
      type: String,
      enum: [
        "Dienst Gezondheid & Jeugd Zuid-Holland Zuid",
        "GGD Amsterdam",
        "GGD Brabant-Zuidoost",
        "GGD Drenthe",
        "GGD Fryslan",
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
        "GGD Zaanstreek-Waterland",
        "GGD Zeeland",
        "GGD Zuid-Limburg",
        "Veiligheids- en Gezondheidsregio Gelderland-Midden"
      ],
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Users = mongoose.model('User', UsersSchema);
module.exports = Users