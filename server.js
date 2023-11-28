const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const upload = multer({ dest: __dirname + "/public/images"});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

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

app.get("/api/sodas", (req, res) => {
    res.send(sodas);
});

app.post("/api/sodas", upload.single("img"), (req, res) => {
    console.log("Body: " + req.body.sugar);
    const result = validateSoda(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }
    console.log(req.body.subTypes);
    const soda = {
        _id: sodas.length + 1,
        name: req.body.name,
        sugar: req.body.sugar,
        calories: req.body.calories,
        oz: req.body.oz,
        subTypes: req.body.subTypes.split(",")
    }

    sodas.push(soda);
    res.send(sodas);
});

app.put("/api/sodas/:id", upload.single("img"), (req, res) => {
    const id = parseInt(req.params.id);

    const soda = sodas.find((r) => r._id === id);

    const result = validateSoda(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    soda.name = req.body.name;
    soda.sugar = req.body.sugar;
    soda.calories = req.body.calories;
    soda.oz = req.body.oz;
    soda.subTypes = req.body.subTypes.split(",");

    res.send(soda);
});

app.delete("/api/sodas/:id", upload.single("img"), (req, res) => {
    const id = parseInt(req.params.id);

    const soda = sodas.find((r) => r._id === id);

    if (!soda) {
        res.status(404).send("The soda was not found");
        return;
    }

    const index = sodas.indexOf(soda);
    sodas.splice(index, 1);
    res.send(soda);
});

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