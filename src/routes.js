import Home from './containers/User/Home';
import DetailMovie from './containers/User/detail-movie/DetailMovie';

const routerHome = [
    {
        path: '/',
        exact: true,
        component: Home,
    },
    {
        path: '/home-list-movie',
        exact: true,
        component: Home,
        scroll: 'listMovie',
    },
    {
        path: '/home-group-cinema',
        exact: true,
        component: Home,
        scroll: 'groupCinema',
    },
    {
        path: '/home-app',
        exact: true,
        component: Home,
        scroll: 'app',
    },
    {
        path: '/detail-movie/:id',
        exact: false,
        component: DetailMovie,
    },
];

export { routerHome };
