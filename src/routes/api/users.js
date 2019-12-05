const express = require('express');
const UsersController = require('../../controllers/users');
const User = require('../../models/user');
const message = require('../../utils/message.json');

const router = express.Router();

const usersController = new UsersController(User);

const permit = require('../../middlewares/permission');

router.get('/', async (req, res) => {
  try {
    const users = await usersController.get();
    res.send(users);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/:id', async (req, res) => {
  const {
    params: { id },
  } = req;
  try {
    const user = await usersController.getById(id);
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/authenticate', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await usersController.authenticate(email, password);

    if (user) {
      res.send(user);
    } else {
      res
        .status(401)
        .json({
          message: 'O e-mail ou senha estão incorretos.',
        });
    }
  } catch (err) {
    throw new Error(err);
  }
});

router.post('/', async (req, res) => {
  try {
    await usersController.create(req.body);
    res.status(201).send(message.success.createUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    await usersController.update(req.params.id, req.body);
    res.send(message.success.editUser);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await usersController.remove(req.params.id);
    res.send(message.success.removeUser).status(204);
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;