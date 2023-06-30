const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    // Basic Data
    full_name: { type: String, required: true },
    gender: { type: String, enum: ["male", "female"], required: true },
    dob: { type: Date, required: true },
    mother_tongue: { type: String, required: true },
    religion: { type: String, required: true },

    // Location Data - GeoJSON
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },

    // More Info
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    marital_status: {
      type: String,
      enum: ["single", "married", "widowed", "divorced", "separated"],
      required: true,
    },
    height: {
      feet: { type: Number, required: true },
      inches: { type: Number, required: true },
    },
    caste: { type: String, required: true },
    birth_star: { type: String, required: true },
    is_physically_challenged: { type: Boolean, required: true, default: false },
    education: {
      degree: { type: String, required: true },
      field: { type: String, required: true },
    },
    job: { type: String, required: true },
    profile_bio: { type: String, required: true },
    eating_habits: { type: String, enum: ["veg", "nonveg"], required: true },
    drinking_habits: {
      type: String,
      enum: ["none", "former", "occasional", "moderate", "heavy", "abstinent"],
      required: true,
    },
    smoking_habits: {
      type: String,
      enum: ["none", "former", "occasional", "moderate", "heavy", "chain"],
      required: true,
    },
    ideology: {
      type: String,
      enum: ["spiritual", "conservative", "liberal", "agnostic", "atheist"],
      required: true,
    },
    interest_hobbies: [{ type: String }],

    // Preferences
    preferences: {
      show_full_name: { type: Boolean, required: true },
      show_dob: { type: Boolean, required: true },
      show_location: { type: Boolean, required: true },
    },

    // Extras
    profile_picture: { type: String, required: false },
    references: { type: String },
    is_deleted: { type: Boolean, required: true, default: false },
    is_active: { type: Boolean, required: true, default: false },
    is_email_verified: { type: Boolean, required: true, default: false },
    is_id_proof_verified: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// GeoJSON index on the location field
profileSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("profiles", profileSchema);
