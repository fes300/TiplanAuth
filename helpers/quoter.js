var quotes = require('../constants/quotes.json')

module.exports.getRandomOne = () => {
  const totalAmount = quotes.length
  const rand = Math.ceil(Math.random() * totalAmount)
  return quotes[rand]
}
