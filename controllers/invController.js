const invModel = require("../models/inventory-model");
const Util = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await Util.buildClassificationGrid(data);
  let nav = await Util.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/* ***************************
 *  Get details of a specific vehicle
 * ************************** */
invCont.getItemDetail = async function (req, res, next) {
  try {
    const vehicleId = req.params.id;
    const vehicle = await invModel.getVehicleById(vehicleId);

    if (!vehicle) {
      return res.status(404).render("error", { message: "Vehicle not found." });
    }

    const vehicleHTML = Util.buildItemDetailView(vehicle);
    let nav = await Util.getNav();

    res.render("./inventory/itemDetail", {
      title: `${vehicle.make} ${vehicle.model}`,
      nav,
      vehicle,
      vehicleHTML,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = invCont;
