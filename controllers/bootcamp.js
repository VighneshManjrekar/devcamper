// @desc    Get all bootcamps
// @route   GET api/v1/bootcamps
// @access  Public
exports.getBootcamps = (req, res, next) => {
    res.status(200).json({ success: true, data: "Get all bootcamps" })
}


// @desc    Create bootcamp
// @route   POST api/v1/bootcamps
// @access  Private
exports.createBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, data: "Create bootcamp" })
}


// @desc    Get bootcamp with id
// @route   GET api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, data: `Get bootcamp with ${req.params.id}` })
}


// @desc    Update bootcamp
// @route   PUT api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, data: `Update bootcamp with id ${req.params.id}` })
}


// @desc    Delete bootcamp
// @route   DELETE api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = (req, res, next) => {
    res.status(200).json({ success: true, data: `Delete bootcamp with id ${req.params.id}` })
}
