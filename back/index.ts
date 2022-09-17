import mongoose from 'mongoose'
import  { Field } from './schemas/field'
import { UserRequest } from './schemas/request'
import express, { Request, Response } from 'express';
const helmet = require('helmet')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express();
app.use(helmet({ crossOriginResourcePolicy: false }))
app.use(cors())
app.use(express.json())
app.use(bodyParser.json())

mongoose.connect('mongodb://localhost/testdb', function (err: any) {
  if (err) throw err;
  console.log('Database successfully connected ...')
})

app.route('/fields')
  .get(async (_req: Request, res: Response) => {
    try {
      const response = await Field.find()
      res.send(response)
    }
    catch (e) {
      res.send(e);
    }
  })

  .post(async (req: Request, res: Response) => {
    try {
      const _id = new mongoose.Types.ObjectId()
      const field = new Field({
        _id,
        code: `field${_id}`,
        name: req.body.name,
        description: req.body.description,
        type: req.body.type,
        required: req.body.required,
        options: req.body.options,
        defaultValue: req.body.defaultValue,
      })

      field.save(function (err: any) {
        if (err) throw err;
      })

      res.send('Поле добавлено')
    }
    catch (e) {
      res.send(e);
    }
  })

  .patch(async (req: Request, res: Response) => {
  try {
    const id = req.body._id
    const field = req.body
    await Field.replaceOne({ _id: id }, field )
    res.send('Поле обновлено')
  }
  catch (e) {
    res.send(e);
  }
  })
  
  .delete(async (req: Request, res: Response) => {
    try {
      const id = req.body.id
      await Field.deleteOne({ _id: id })
      res.send('Поле удалено')
    }
    catch (e) {
      res.send(e);
    }
  })
    

app.route('/requests')
  .get(async (_req: Request, res: Response) => {
    try {
      const response = await UserRequest.find()
      res.send(response)
    }
    catch (e) {
      res.send(e);
    }
  })

  .post(async (req: Request, res: Response) => {
    try {
      const request = new UserRequest({
        _id: new mongoose.Types.ObjectId(),
        ...req.body
      })

      request.save(function (err: any) {
        if (err) throw err;
      })
      res.send('Заявка добавлена')
    }
    catch (e) {
      res.send(e);
    }
  })

  .patch(async (req: Request, res: Response) => {
    try {
      const id = req.body._id
      const field = req.body
      await UserRequest.replaceOne({ _id: id }, field)
      res.send('Поле обновлено')
    }
    catch (e) {
      res.send(e);
    }
  })

  .delete(async (req: Request, res: Response) => {
    try {
      const id = req.body.id
      await UserRequest.deleteOne({ _id: id })
      res.send('Заявка удалена')
    }
    catch (e) {
      res.send(e);
    }
  })

module.exports = app

app.listen(3000, () => console.log('Server running ...'))