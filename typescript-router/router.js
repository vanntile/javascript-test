(function () {
    var Router = {
        routes: [],
        add: function (new_route) {
            this.routes.push(new_route);
        },
        init: function (routes) {
            var navigate = function (route) {
                var current_route = routes.find(function (r) { return r.route === route; }) || routes[0];
                fetch(current_route.path)
                    .then(function (res) { return res.text(); })
                    .then(function (text) {
                    document.getElementById("router").innerHTML = text;
                    window.history.pushState(current_route.name, '', current_route.route);
                })["catch"](function (err) { return console.error(err); });
            };
            window.onload = function () {
                navigate('/');
                document.querySelectorAll('a[href]').forEach(function (el) {
                    return el.addEventListener('click', function (e) {
                        e.preventDefault();
                        navigate(el.getAttribute('href'));
                    });
                });
            };
        }
    };
    Router.add({ route: '/', path: "templates/homepage.html", name: "Homepage" });
    Router.add({ route: '/feature', path: "templates/feature.html", name: "Feature" });
    Router.init(Router.routes);
})();
