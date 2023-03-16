const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

const saucesRoutes = require('../controllers/sauce');

router.get('/', saucesRoutes.getAll);
router.post('/', saucesRoutes.make);
router.get('/:id', auth, saucesRoutes.getOne);
router.put('/:id',auth, saucesRoutes.edit);
router.delete('/:id',auth, saucesRoutes.delete);

module.exports = router;