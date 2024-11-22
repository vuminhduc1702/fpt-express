const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Event = require("../models/event.model");

exports.checkout = async (req, res, next) => {
  const eventId = req.body.eventId;
  const quantity = req.body.quantity;

  const event = await Event.findById(eventId);

  if (!event) {
    const error = new Error("Cannot find event");
    error.status = 404;
    throw error;
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "vnd",
            product_data: {
              name: event.name,
            },
            unit_amount: event.price,
          },
          quantity,
        },
      ],
      mode: "payment",
      success_url: "http://localhost:3000/complete",
      cancel_url: "http://localhost:3000/cancel",
    });
    res.json({ url: session.url });
  } catch (err) {
    if (!err.status) {
      err.status = 500;
    }
    next(err);
    return err;
  }
};
