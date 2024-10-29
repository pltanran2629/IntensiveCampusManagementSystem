import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../src/components/login'
import map from '../src/components/map.vue'
import video from '../src/components/video.vue'
import map1 from '../src/components/map1.vue'
import admin from "../src/components/admin.vue"
import personal from '../src/components/personal/personal.vue'
import position from '../src/components/position/position.vue'
import positionAdd from '../src/components/position/addposition.vue'
import mine from '../src/components/mine.vue'

Vue.use(VueRouter)

const router = new VueRouter({
    mode: 'hash',
    // base: process.env.BASE_URL,
    routes: [
        { path: '/', redirect: '/login' },
        {
            path: '/login',
            component: login,
        },
        {
            path: '/map1',
            component: map1,
        },
        {
            path: '/map',
            component: map,
        },
        {
            path: '/video',
            component: video,
        },
        {
            path: "/admin",
            component: admin,
            redirect: "/personal",
            children: [{
                    path: '/personal',
                    component: personal
                },
                {
                    path: '/position',
                    component: position
                },
                {
                    path: '/add-position',
                    component: positionAdd
                },
                {
                    path: '/mine',
                    component: mine
                },
            ]
        }
    ]
})


export default router