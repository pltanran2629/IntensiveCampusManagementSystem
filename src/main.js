import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import router from '../router/index'
import '../src/assets/css/global.css'
import '../plugins/element'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Video from 'video.js'
import 'video.js/dist/video-js.css'
Vue.prototype.$video = Video


Vue.use(ElementUI);

Vue.config.productionTip = false
    // axios.defaults.baseURL = "http://localhost:8080"
axios.defaults.baseURL = "http://59.110.24.11:8084"
    // axios.interceptors.request.use(config => {
    //     config.headers.Authorization = window.sessionStorage.getItem("token")
    //     return config
    // })
Vue.prototype.$http = axios


new Vue({
    router,
    render: h => h(App),
    data() {
        return {
            user: {}
        }
    }
}).$mount('#app')