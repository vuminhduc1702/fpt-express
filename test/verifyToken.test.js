const verifyToken = require("../middlewares/verifyToken.middleware");
const jwt = require("jsonwebtoken");
const expect = require("chai").expect;
const sinon = require("sinon");

// describe is to group multiple unit tests
describe("Auth middleware", () => {
  it("should call next() if path starts with '/auth'", () => {
    const req = {
      path: "/auth/login",
    };

    const next = () => {};

    verifyToken(req, {}, next);

    expect(next).to;
  });

  it("should throw an error if no authorization header is present", () => {
    const req = {
      get: () => {
        return null;
      },
      path: "/abc",
    };
    expect(verifyToken.bind(this, req, {}, () => {})).to.throw(
      "Not Authenticated"
    );
  });

  it("should throw an error if the authorization header is only one string", () => {
    const req = {
      get: (header) => {
        return "xyz";
      },
    };
    expect(verifyToken.bind(this, req, {}, () => {})).to.throw();
  });

  it("should throw an error if the token cannot be verified", () => {
    const req = {
      get: (header) => {
        return "Bearer afdhdhbd";
      },
      path: "/abc",
    };
    expect(verifyToken.bind(this, req, {}, () => {})).to.throw();
  });

  it("should yield an userId after decoding the token", () => {
    const req = {
      get: (header) => {
        return "Bearer afdhdhbd";
      },
      path: "/abc",
    };
    sinon.stub(jwt, "verify");
    jwt.verify.returns({ userId: "abc" });
    verifyToken(req, {}, () => {});
    expect(req).to.have.property("userId");
    expect(req).to.have.property("userId", "abc");
    jwt.verify.restore();
  });
});
