const express = require('express')
const router = new express.Router()

const testData = [{
  key: 'test'
}]

router.get('/', async (req,res,next) =>{
  try {
    return res.json(testData[0])
  } catch (err) {
    
  }
})

module.exports = router