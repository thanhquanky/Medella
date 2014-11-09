/**
 * PrescriptionController
 *
 * @description :: Server-side logic for managing prescriptions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	findMyPrescription: function(req, res) {
		Prescription.find()
			//.where({ patient: { '=': req.id }})
			//.sort('date')
			.exec(function(err, prescriptions) {
			  return res.json(prescriptions);
			});
	}
};
