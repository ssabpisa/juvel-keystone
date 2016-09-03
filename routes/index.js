/**
 * This file is where you define your application routes and controllers.
 *
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 *
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 *
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 *
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 *
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone');
var middleware = require('./middleware');
var importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views')
};
var restful = require('restful-keystone')(keystone);
// Setup Route Bindings
exports = module.exports = function (app) {
	// restful.expose({
	// 	Post : true,
	// 	Product: true,
	// 	User: true,
	// 	ProductCollection: true,
	// 	ProductReview: true
	// }).start();
	
	//Top
	app.get('/', routes.views.index);
	app.get('/about', routes.views.about);
	//Blog
	app.get('/blog/:category?', routes.views.blog);
	app.get('/blog/post/:post', routes.views.post);
	//Cart
	app.get('/cart', routes.views.cart.get);
	app.post('/cart', routes.views.cart.post);
	//Checkout
	app.all('/checkout/', routes.views.checkout);
	app.post('/checkout/next', routes.views.checkoutNext);
	app.get('/checkout/:name', routes.views.checkoutView);
	//User management
	app.get('/chlogin', routes.views.checkoutLogin);
	app.get('/login', routes.views.login.get);
	app.post('/login', keystone.security.csrf.middleware.validate, routes.views.login.post);
	app.get('/me', routes.views.accountMy);
	app.get('/me/orders', routes.views.accountMyOrders);
	app.get('/me/information', routes.views.accountMyInformation.get);
	app.post('/me/information', routes.views.accountMyInformation.post)
	//Product
	app.get('/products', routes.views.products);
	//Payment Notification
	app.get('/payment/notify/:order_id', routes.views.paymentNotify.get);
	app.post('/payment/notify', routes.views.paymentNotify.post);


	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);

};
