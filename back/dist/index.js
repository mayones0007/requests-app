"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const field_1 = require("./schemas/field");
const request_1 = require("./schemas/request");
const express_1 = __importDefault(require("express"));
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = (0, express_1.default)();
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors());
app.use(express_1.default.json());
app.use(bodyParser.json());
mongoose_1.default.connect('mongodb://localhost/testdb', function (err) {
    if (err)
        throw err;
    console.log('Database successfully connected ...');
});
app.route('/fields')
    .get((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield field_1.Field.find();
        res.send(response);
    }
    catch (e) {
        res.send(e);
    }
}))
    .post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _id = new mongoose_1.default.Types.ObjectId();
        const field = new field_1.Field({
            _id,
            code: `field${_id}`,
            name: req.body.name,
            description: req.body.description,
            type: req.body.type,
            required: req.body.required,
            options: req.body.options,
            defaultValue: req.body.defaultValue,
        });
        field.save(function (err) {
            if (err)
                throw err;
        });
        res.send('Поле добавлено');
    }
    catch (e) {
        res.send(e);
    }
}))
    .patch((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.body._id;
        const field = req.body;
        yield field_1.Field.replaceOne({ _id: id }, field);
        res.send('Поле обновлено');
    }
    catch (e) {
        res.send(e);
    }
}))
    .delete((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.body.id;
        yield field_1.Field.deleteOne({ _id: id });
        res.send('Поле удалено');
    }
    catch (e) {
        res.send(e);
    }
}));
app.route('/requests')
    .get((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield request_1.UserRequest.find();
        res.send(response);
    }
    catch (e) {
        res.send(e);
    }
}))
    .post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = new request_1.UserRequest(Object.assign({ _id: new mongoose_1.default.Types.ObjectId() }, req.body));
        request.save(function (err) {
            if (err)
                throw err;
        });
        res.send('Заявка добавлена');
    }
    catch (e) {
        res.send(e);
    }
}))
    .patch((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.body._id;
        const field = req.body;
        yield request_1.UserRequest.replaceOne({ _id: id }, field);
        res.send('Поле обновлено');
    }
    catch (e) {
        res.send(e);
    }
}))
    .delete((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.body.id;
        yield request_1.UserRequest.deleteOne({ _id: id });
        res.send('Заявка удалена');
    }
    catch (e) {
        res.send(e);
    }
}));
module.exports = app;
app.listen(3000, () => console.log('Server running ...'));
