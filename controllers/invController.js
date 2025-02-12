const invModel = require("../models/inventory-model");
const Util = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(
      classification_id
    );

    if (!data || data.length === 0) {
      const error = new Error("No vehicles found for this classification.");
      error.status = 404;
      throw error;
    }

    const grid = await Util.buildClassificationGrid(data);
    let nav = await Util.getNav();
    const className = data[0].classification_name;

    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Get details of a specific vehicle
 * ************************** */
invCont.getItemDetail = async function (req, res, next) {
  try {
    const vehicleId = req.params.id;
    const vehicle = await invModel.getVehicleById(vehicleId);

    if (!vehicle) {
      const error = new Error("Vehicle not found.");
      error.status = 404;
      throw error;
    }

    const vehicleHTML = Util.buildItemDetailView(vehicle);
    let nav = await Util.getNav();

    res.render("./inventory/itemDetail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicle,
      vehicleHTML,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = invCont;
