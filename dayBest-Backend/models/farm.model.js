const mongoose = require('mongoose');

const farmSchema = new mongoose.Schema(
  {

    isActive: {type: Boolean, default: true},
    isDeleted: {type: Boolean, default: false},
    image: {data: Buffer, required: true}
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);


const farm = mongoose.model("farm", farmSchema);

module.exports = farm;
