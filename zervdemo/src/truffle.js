// Allows us to use ES6 in our migrations and tests.
require('babel-register')

module.exports = {
  networks: {
    development: {
      host: '54.186.254.137',
      port:23000,
      network_id: '*' // Match any network id
    },

    nodetwo: {
      host: '54.186.254.137',
      port:22002,
      network_id: '*' // Match any network id
    },
  
   nodethree: {
      host: '54.186.254.137',
      port:22004,
      network_id: '*' // Match any network id
    }


  }
}
