const fs = require("fs");

module.exports = deleteFile = (file) => {
  const basePath = __dirname + "/../public/" + file;
  console.log(fs.existsSync(basePath));
  try {
    if (fs.existsSync(basePath)) {
      fs.unlinkSync(basePath);
      console.log(`${basePath} deleted successfully.`);
    } else {
      console.log(`${basePath} does not exist.`);
    }
  } catch (error) {
    console.log(`Error deleting ${basePath}:`, error);
  }
};
