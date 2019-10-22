(function () {
    const Router = {
        routes: [],
        add: function (new_route: { route: string, path: string, name: string }) {
            this.routes.push(new_route);
        },
        init: function (routes: any) {
            const navigate = (route: string) => {
                const current_route = routes.find(
                    (r: { route: string, path: string, name: string }) => r.route === route
                ) || routes[0];


                fetch(current_route.path)
                    .then(res => res.text())
                    .then(text => {
                        document.getElementById("router").innerHTML = text;
                        window.history.pushState(current_route.name, '', current_route.route);
                    })
                    .catch(err => console.error(err));
            }

            window.onload = function () {
                navigate('/');

                document.querySelectorAll('a[href]').forEach(el =>
                    el.addEventListener('click', e => {
                        e.preventDefault();
                        navigate(el.getAttribute('href'));
                    })
                );
            }
        }
    }

    // Add routes here
    Router.add({ route: '/', path: "templates/homepage.html", name: "Homepage" });
    Router.add({ route: '/feature', path: "templates/feature.html", name: "Feature" });
    Router.init(Router.routes);
})();