/**
* Prescription.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/



module.exports = {
  tableName: 'prescription',

  attributes: {
    doctor: {
      type: 'string'
    },
    patient: {
      type: 'string'
    },
    date: {
      type: 'date'
    },
    drugs: {
      type: 'array'
    }
  },

  toJSON: function () {
    // this gives you an object with the current values
    var obj = this.toObject();
    // return the new object without password
    return obj;
  }
};
