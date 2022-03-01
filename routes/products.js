import express from 'express'
import content from '../middleware/content.js'
import auth from '../middleware/auth.js'
import admin from '../middleware/admin.js'
import upload from '../middleware/upload.js'
import {
  create,
  getProducts,
  getAllProducts,
  getProductById,
  updateProductById,
  searchProducts,
  addreviewById,
  getCategoryProducts,
  getMale,
  getFemale
} from '../controllers/products.js'

const router = express.Router()

router.post('/', auth, admin, content('multipart/form-data'), upload, create)
router.post('/search', searchProducts)
router.post('/:id', auth, addreviewById)
router.get('/', getProducts)
router.get('/all', auth, admin, getAllProducts)
router.get('/cate/:id', getCategoryProducts)
router.get('/male', getMale)
router.get('/female', getFemale)
router.get('/:id', getProductById)
router.patch('/:id', auth, admin, content('multipart/form-data'), upload, updateProductById)

export default router
