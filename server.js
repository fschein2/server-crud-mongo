const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
const mongoose = require("mongoose");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const upload = multer({ dest: __dirname + "/public/images"});

mongoose
    .connect("mongodb+srv://fschein21:forMongoOnly@cluster0.n7nc3vs.mongodb.net/?retryWrites=true&w=majority")
    .then(() => console.log("Connected to mongodb"))
    .catch((err) => console.log("Couldn't connect to mongodb", err));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

/*
let sodas = [{
        _id: 1,
        name: "Pepsi",
        sugar: "41",
        calories: "150",
        oz: "12",
        subTypes: [
            "Diet Pepsi",
            "Pepsi Zero",
            "Pepsi Cherry"
        ],
    },
    {
        _id: 2,
        name: "Mountain Dew",
        sugar: "46",
        calories: "170",
        oz: "12",
        subTypes: [
            "Diet Mtn Dew",
            "Mtn Dew Baja Blast",
            "Mtn Dew Code Red",
            "Mtn Dew Pitch Black"
        ],
    },
    {
        _id: 3,
        name: "Coca-Cola",
        sugar: "39",
        calories: "140",
        oz: "12",
        subTypes: [
            "Diet Coke",
            "Coke Zero",
            "Vanilla Coke"
        ],
    },
    {   
        _id: 4,
        name: "Dr Pepper",
        sugar: "39",
        calories: "150",
        oz: "12",
        subTypes: [
            "Diet Dr Pepper",
            "Dr Pepper & Cream Soda",
            "Dr Pepper Strawberries and Cream",
            "Dr Pepper Cherry"
        ],
    },
    {
        _id: 5,
        name: "A&W Root Beer",
        sugar: "45",
        calories: "170",
        oz: "12",
        subTypes: [
            "Diet A&W Root Beer",
            "A&W Cream Soda",
            "Diet A&W Cream Soda"
        ],
    },
    {
        _id: 6,
        name: "Sprite",
        sugar: "51",
        calories: "190",
        oz: "12",
        subTypes: [
            "Sprite Zero",
            "Sprite Cranberry"
        ],
    }
];
*/

const sodaSchema = new mongoose.Schema({
    name: String,
    sugar: String,
    calories: String,
    oz: String,
    subTypes: [String]
});

const Soda = mongoose.model("Soda", sodaSchema);

app.get("/api/sodas", (req, res) => {
    getSodas(res);
});

const getSodas = async (res) => {
    const sodas = await Soda.find();
    res.send(sodas);
};

app.post("/api/sodas", upload.single("img"), (req, res) => {
    const result = validateSoda(req.body);

    if (result.error) {
        res.status(400).send(result.error.deatils[0].message);
        return;
    }

    const soda = new Soda({
        name: req.body.name,
        sugar: req.body.sugar,
        calories: req.body.calories,
        oz: req.body.oz,
        subTypes: req.body.subTypes.split(","),
    });

    createSoda(soda, res);
});

const createSoda = async (soda, res) => {
    const result = await soda.save();
    res.send(soda);
};

app.put("/api/sodas/:id", upload.single("img"), (req, res) => {
    const result = validateSoda(req.body);

    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    updateSoda(req, res);
});

const updateSoda = async (req, res) => {
    let fieldsToUpdate = {
        name: req.body.name,
        sugar: req.body.sugar,
        calories: req.body.calories,
        oz: req.body.oz,
        subTypes: req.body.subTypes.split(","),
    }

    const result = await Soda.updateOne({_id: req.params.id}, fieldsToUpdate);
    const soda = await Soda.findById(req.params.id);
    res.send(soda);
}

app.delete("/api/sodas/:id", upload.single("img"), (req, res) => {
    removeSoda(res, req.params.id);
});

const removeSoda = async (res, id) => {
    const soda = await Soda.findByIdAndDelete(id);
    res.send(soda);
}

const validateSoda = (soda) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        subTypes: Joi.allow(""),
        name: Joi.string().min(3).required(),
        sugar: Joi.string().min(1).required(),
        calories: Joi.string().min(1).required(),
        oz: Joi.string().min(1).required()
    });

    return schema.validate(soda);
};

app.listen(3000, () => {
    console.log("listening");
});