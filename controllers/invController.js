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

/* ***************************
 *  Build inventory management view
 * ************************** */
invCont.buildInventoryManagement = async function (req, res, next) {
  let nav = await Util.getNav();

  const classificationList = await Util.buildClassificationList();

  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    message: req.flash("message"),
    classificationList,
  });
};

/* ***************************
 *  Build add classfication view
 * ************************** */
invCont.addClassificationView = async (req, res) => {
  let nav = await Util.getNav();
  res.render("inventory/add-classification", {
    title: "Add New Classification",
    nav,
    message: req.flash("info") || [],
  });
};

/* ***************************
 *  Add Classification
 * ************************** */
invCont.addClassification = async (req, res) => {
  const { classification_name } = req.body;

  // 서버 측 유효성 검사
  if (!classification_name || /[^a-zA-Z0-9]/.test(classification_name)) {
    req.flash("message", "Classification name is invalid.");
    return res.redirect("/inv/add-classification");
  }

  // 분류 추가 함수 호출
  const result = await invModel.addClassification(classification_name);

  if (result) {
    req.flash("message", "New classification added successfully.");
    res.redirect("/inv");
  } else {
    req.flash("message", "Failed to add classification.");
    res.redirect("/inv/add-classification");
  }
};

/* ***************************
 *  Add Inventory View
 * ************************** */
invCont.addInventoryView = async (req, res) => {
  let nav = await Util.getNav();
  try {
    const classificationList = await Util.buildClassificationList();
    console.log("📍classificationList :", classificationList);
    res.render("inventory/add-inventory", {
      title: "Add New Inventory Item",
      nav,
      classificationList,
      message: req.flash("info") || [],
    });
  } catch (error) {
    console.error(error);
    req.flash("info", "Error loading classifications.");
    res.redirect("/inv/");
  }
};
/* ***************************
 *  Add Inventory
 * ************************** */
invCont.addInventory = async (req, res) => {
  const {
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  // 서버 측 유효성 검사
  if (
    !inv_make ||
    !inv_model ||
    !inv_year ||
    !inv_description ||
    !inv_price ||
    !inv_miles ||
    !inv_color ||
    !classification_id
  ) {
    req.flash("message", "All fields are required.");
    return res.redirect("/inv/add-inventory");
  }

  const result = await invModel.addInventoryItem({
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id,
  });

  if (result) {
    req.flash("message", "New inventory item added successfully.");
    res.redirect("/inv");
  } else {
    req.flash("message", "Failed to add inventory item.");
    res.redirect("/inv/add-inventory");
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  let nav = await Util.getNav();
  const itemData = await invModel.getVehicleById(inv_id);
  const classificationSelect = await Util.buildClassificationList(
    itemData.classification_id
  );

  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    message: req.flash("message"),
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id,
  });
};

/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await Util.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const updateResult = await invModel.updateInventoryItem(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    req.flash(
      "notice",
      `The ${inv_make} ${inv_model} was successfully updated.`
    );
    res.redirect("/inv/");
  } else {
    req.flash("notice", "Sorry, the update failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + inv_make + " " + inv_model,
      nav,
      errors: req.flash("notice"),
      inv_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.getDeleteConfirmView = async function (req, res, next) {
  let nav = await Util.getNav();
  try {
    const inv_id = parseInt(req.params.inv_id);
    const inventory = await invModel.getVehicleById(inv_id);

    res.render("inventory/delete-confirm", {
      title: "Delete Inventory Item",
      nav,
      inventory,
    });
  } catch (error) {
    console.error("Error loading delete confirmation view:", error);
    res.status(500).send("Server Error");
  }
};

/* ***************************
 *  Delete Inventory Data
 * ************************** */
invCont.deleteInventoryItem = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id);
    const result = await invModel.deleteInventoryItem(inv_id);

    if (result.rowCount > 0) {
      req.flash("success", "Inventory item deleted successfully.");
      res.redirect("/inv");
    } else {
      req.flash("error", "Failed to delete inventory item.");
      res.redirect(`/inv/delete/${inv_id}`);
    }
  } catch (error) {
    console.error("Error deleting inventory item:", error);
    res.status(500).send("Server Error");
  }
};
module.exports = invCont;
