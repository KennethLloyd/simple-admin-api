const mongoose = require('mongoose');
const config = require('config');

(async () => {
  try {
    await mongoose.connect(config.get('mongoURI'), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
  } catch (e) {
    console.log(e);
  }
})();
