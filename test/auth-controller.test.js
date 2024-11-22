const expect = require("chai").expect;
const sinon = require("sinon");

const User = require("../models/user.model");
const AuthController = require("../controllers/auth.controller");

describe("Auth-Controller - Login", () => {
  it("should throw an error with code 500 if accessing the database fails", (done) => {
    sinon.stub(User, "findOne");
    User.findOne.throws();

    const req = {
      body: {
        email: "test@gmail.com",
        password: "12345678",
      },
    };

    AuthController.login(req, {}, () => {}).then((result) => {
      expect(result).to.be.an("error");
      expect(result).to.have.property("status", 500);
      done();
    });

    User.findOne.restore();
  });
});
