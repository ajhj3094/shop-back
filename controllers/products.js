import products from '../models/products.js'

export const create = async (req, res) => {
  try {
    const result = await products.create({ ...req.body, image: req.files.map(item => { return item.path }) })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      res.status(400).send({ success: false, message: error.errors[key].message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const getProducts = async (req, res) => {
  try {
    const result = await products.find({ sell: true })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getAllProducts = async (req, res) => {
  try {
    const result = await products.find()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getProductById = async (req, res) => {
  try {
    const result = await products.findById(req.params.id)
    if (result) {
      res.status(200).send({ success: true, message: '', result })
    } else {
      res.status(404).send({ success: false, message: '找不到' })
    }
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '找不到' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const updateProductById = async (req, res) => {
  const data = {
    name: req.body.name,
    price: req.body.price,
    description: req.body.description,
    sell: req.body.sell,
    category: req.body.category,
    gender: req.body.gender,
    color: req.body.color,
    size: req.body.size
  }

  if (req.files.length > 0) {
    data.image = req.files.map(item => { return item.path })
  }
  try {
    const result = await products.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '找不到' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      res.status(400).send({ success: false, message: error.errors[key].message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤123123' })
    }
  }
}

export const searchProducts = async (req, res) => {
  try {
    const query = {
      $or: [
        { name: { $in: [] } },
        { description: { $in: [] } },
        { category: { $in: [] } },
        { gender: { $in: [] } }
      ]
    }

    if (req.query.keywords) {
      // 組成查詢語法
      // {
      //   $or: [
      //     {
      //       name: {
      //         $in: [/韭菜/i,/水餃/i]
      //       }
      //     },
      //     {
      //       description: {
      //         $in: [/韭菜/i,/水餃/i]
      //       }
      //     }
      //   ]
      // }
      const keywords = req.query.keywords.split('/').map(keyword => {
        return new RegExp(keyword, 'i')
      })
      query.$or[0].name.$in = keywords
      query.$or[1].description.$in = keywords
      query.$or[2].category.$in = keywords
      query.$or[3].gender.$in = keywords
    } else {
      // 如果沒有關鍵字，把 $or 清空，否則會找不到東西
      delete query.$or
    }
    const allresult = await products.find(query)
    const result = allresult.filter(item => {
      return item.sell === true
    })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const addreviewById = async (req, res) => {
  const data = {
    user: req.user.account,
    _id: req.user._id,
    rating: req.body.rating,
    text: req.body.text
  }

  try {
    const result = await products.findByIdAndUpdate(req.params.id, { new: true, runValidators: true })
    result.review.push(data)
    result.save()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    if (error.name === 'CastError') {
      res.status(404).send({ success: false, message: '找不到' })
    } else if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      res.status(400).send({ success: false, message: error.errors[key].message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

// export const getIdforAvatar = async (req, res) => {
//   console.log(req)
//   const data = {
//     _id: req.user._id
//   }

//   try {
//     const result = await products.findByIdAndUpdate(req.params.id, { new: true, runValidators: true })
//     console.log(data)
//     console.log(result)
//     result.review.push(data)
//     result.save()
//     // console.log(result)
//     res.status(200).send({ success: true, message: '', result })
//   } catch (error) {
//     if (error.name === 'CastError') {
//       res.status(404).send({ success: false, message: '找不到' })
//     } else if (error.name === 'ValidationError') {
//       const key = Object.keys(error.errors)[0]
//       res.status(400).send({ success: false, message: error.errors[key].message })
//     } else {
//       res.status(500).send({ success: false, message: '伺服器錯誤' })
//     }
//   }
// }
