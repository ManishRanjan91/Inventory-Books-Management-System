module.exports = (app) => {
    const stores = require('../controllers/store.controller.js');
    const auth = require("../middleware/auth.js");

    // Create a new store
    app.post('/api/stores', auth, stores.create);

    // Retrieve all stores
    app.get('/api/stores', auth, stores.findAll);

    // Retrieve a single store with storeId
    app.get('/api/stores/:storeId', auth, stores.findOne);

    // Update a store with storeId
    app.patch('/api/stores/:storeId', auth, stores.update);

    // Delete a store with storeId
    app.delete('/api/stores/:storeId', auth, stores.delete);
}
