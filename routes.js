// Home Page
FlowRouter.route('/', {
    name: 'home',
    action() {
        BlazeLayout.render("HomeLayout", {main: "Home"});
    }
});

// Home Page
FlowRouter.route('/dashboard', {
    name: 'dashboard',
    action() {
        BlazeLayout.render("AppLayout", {main: "Dashboard"});
    }
});

var adminRoutes = FlowRouter.group({
	prefix: '/admin',
	name: 'admin'
});



adminRoutes.route('/users',{
    name: 'users',
    action() {
        BlazeLayout.render("AppLayout", {main: "Users"});
    }
});

adminRoutes.route('/addtasks',{
    name: 'addtasks',
    action() {
        BlazeLayout.render("AppLayout", {main: "AddTasks"});
    }
});

adminRoutes.route('/managetasks',{
    name: 'managetasks',
    action() {
        BlazeLayout.render("AppLayout", {main: "ManageTasks"});
    }
});

adminRoutes.route('/partmaintenance',{
    name: 'partmaintenance',
    action() {
        BlazeLayout.render("AppLayout", {main: "PartMaintenance"});
    }
});

// var operatorRoutes = FlowRouter.group({
//     prefix: '/operator',
//     name: 'operator'
// });

// operatorRoutes.route('/addtasks',{
//     name: 'addtasks',
//     action() {
//         BlazeLayout.render("AppLayout", {main: "AddTasks"});
//     }
// });
