'use-strict'

const express = require("express");
const app = express();
const cors = require('cors');

const config = require("./src/config/config");
const apiRoutes = require("./src/api");
const morgan = require("./src/middleware/morgan");
const requestId = require("./src/middleware/requestId");
const { errorHandler } = require('./src/middleware/errorHandler');
const { sequelize: swiftSequelize } = require('./src/models/swift');
const { sequelize: podSequelize } = require('./src/models/pod');
const jobs = require("./src/utils/jobs");

const PORT = config.PORT;

app.use(requestId());
app.use(morgan);
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));
app.use(cors({ credentials: true, origin: true }))

app.use(apiRoutes);
app.use(errorHandler);

jobs();

/**Load DB here */
// let models = require('./src/models/swift')
// models.sequelize.sync()

app.listen(PORT, async() => {
	await swiftSequelize.authenticate().then(() => console.log('QMS:swift_db database connection has been established successfully.'));
	await podSequelize.authenticate().then(() => console.log('POD:heliosDB database connection has been established successfully.'));
	console.log(`Mesi app is listening on port ${PORT}..`);
});
