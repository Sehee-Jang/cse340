function checkUpdateData(req, res, next) {
  const {
    inv_id,
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_image,
    inv_thumbnail,
    inv_miles,
    inv_color,
  } = req.body;

  if (
    !classification_id ||
    !inv_make ||
    !inv_model ||
    !inv_year ||
    !inv_description ||
    !inv_price ||
    !inv_miles ||
    !inv_color
  ) {
    req.flash("error", "All fields are required.");
    return res.redirect("/inv/edit/" + inv_id);
  }

  next();
}

module.exports = { checkUpdateData };
