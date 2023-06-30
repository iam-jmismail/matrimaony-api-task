const mongoose = require("mongoose");

// Models
const ConnectionModel = require("../models/connection");

const getConnections = async (req, res, next) => {
  const {
    user: { id: user_id },
  } = req;

  try {
    const conns = await ConnectionModel.aggregate([
      {
        $match: {
          user_id: new mongoose.mongo.ObjectId(user_id),
        },
      },
      {
        $lookup: {
          from: "profiles",
          localField: "conn_user_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          status: 1,
          conn_date: 1,
          name: { $arrayElemAt: ["$user.full_name", 0] },
          profile_id: { $arrayElemAt: ["$user._id", 0] },
        },
      },
    ]);

    return res.status(200).json(conns);
  } catch (error) {
    return next(error);
  }
};
const createConnection = async (req, res, next) => {
  const {
    body: {
      user_id: { conn_user_id },
    },
    user: { id: user_id },
  } = req;
  try {
    const connection = await ConnectionModel.create({
      user_id: new mongoose.mongo.ObjectId(user_id),
      conn_user_id: new mongoose.mongo.ObjectId(conn_user_id),
    });

    await connection.save();

    return res.status(200).json({
      status: "success",
      message: "Connection request send",
    });
  } catch (error) {
    return next(error);
  }
};

const approveConnection = async (req, res, next) => {
  const {
    user: { id: user_id },
    body: { conn_id, status },
  } = req;

  try {
    await ConnectionModel.updateOne(
      {
        _id: new mongoose.mongo.ObjectId(conn_id),
      },
      {
        $set: {
          status,
        },
      }
    );

    return res.status(200).json({
      status: "success",
      message: "Connection updated",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getConnections,
  createConnection,
  approveConnection,
};
