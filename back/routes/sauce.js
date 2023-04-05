const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const saucesRoutes = require('../controllers/sauce');

router.get('/', saucesRoutes.getAll);
router.post('/', auth, multer, saucesRoutes.make);
router.get('/:id', auth, saucesRoutes.getOne);
router.put('/:id', auth, multer, saucesRoutes.edit);
router.delete('/:id', auth, saucesRoutes.delete);
router.post('/:id/like', auth, saucesRoutes.like);
module.exports = router;