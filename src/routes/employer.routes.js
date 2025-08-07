const express = require('express');
const router = express.Router();
const emp = require('../controllers/employerProfile.controller');

// (Optional) auth middleware use karna ho to:
// const auth = require('../middleware/auth');

// CRUD
router.post('/employer/profile', /*auth,*/ emp.saveEmployerProfile);  // upsert
router.get('/employer/profile',  /*auth,*/ emp.getEmployerProfile);   // by auth or ?userId=
router.delete('/employer/profile', /*auth,*/ emp.deleteEmployerProfile);

router.get('/employer/profiles', /*auth, adminOnly?,*/ emp.listEmployerProfiles); // list (admin)

module.exports = router;
