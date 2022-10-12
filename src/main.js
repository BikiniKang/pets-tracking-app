import { createApp } from 'vue';
import { createPinia } from 'pinia';
import './index.css'; // importing tailwind css must come before element plus
import ElementPlus from 'element-plus';
import * as ElIcons from '@element-plus/icons-vue';
import 'element-plus/dist/index.css';
import App from './App.vue';
import router from '@/router';
import axios from 'axios';
import VueSidebarMenu from 'vue-sidebar-menu';
import '@styles/side-menu/custom-var.scss';

// axios
axios.defaults.baseURL = 'https://pets-backend.azurewebsites.net';
// For local mock
// axios.defaults.baseURL = 'http://127.0.0.1:4523/m1/819321-0-default/';

//通过axios拦截器添加token验证
axios.interceptors.request.use(config=>{
	if(config.method === 'post'){
		console.log('config:', config)
		// config.headers['Content-Type'] = "application/json"

		if (config.hasOwnProperty("data")) {
			let data = config.data;
			if(data.hasOwnProperty("uid")) {
				data.uid = window.localStorage.getItem('uid')
			}
		}
		if (config.hasOwnProperty("params")) {
			let params = config.params;
			if(params.hasOwnProperty("uid")) {
				params.uid = window.localStorage.getItem('uid')
			}
		}
	    


		
		
	    // config.data = JSON.stringify({
	    //   uid: window.localStorage.getItem('uid'), //追加的参数
	    //   ...data //拼接参数
	    // })
	}
	return config

})


// v-calendar
import VCalendar from 'v-calendar';
import 'v-calendar/dist/style.css';
// vue-datepicker
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const app = createApp(App);
Object.keys(ElIcons).forEach(key => {
	app.component(key, ElIcons[key]);
});
app.use(VueSidebarMenu);
// app.component('VueClock', VueClock);
app.use(VCalendar, {});
app.use(ElementPlus);
app.use(createPinia());
app.use(router);
app.component('Datepicker', Datepicker);

app.mount('#app');
