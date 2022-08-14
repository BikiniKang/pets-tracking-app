import {
	createWebHistory,
	createRouter,
	createWebHashHistory
} from 'vue-router';

import Home from '@/components/Home/index.vue';
import Login from '@/components/Login/index.vue';
import Register from '@/components/Register/index.vue';
import NotFound from '@/components/NotFound/index.vue';
import Dashboard from '@/components/Dashboard/index.vue';
import EditPet from '@/components/EditPet/index.vue';
import CreatePet from '@/components/CreatePet/index.vue';
import Invoice from '@/components/Invoice/index.vue';
import Calendar from '@/components/Calendar/index.vue';
import Settings from '@/components/Settings/index.vue';
import UserProfile from '@/components/UserProfile/index.vue';
import EditUserProfile from '@/components/EditUserProfile/index.vue';
import VaccinationHistory from '@/components/VaccinationHistory/index.vue';
import Medication from '@/components/Medication/index.vue';
import EventTable from '@/components/EventTable/index.vue';
import TaskTable from '@/components/TaskTable/index.vue';
import PetProfile from '@/components/PetProfile/index.vue';

const routes = [
	{
		path: '/',
		name: 'Home',
		component: Home,
		children: [
			{
				path: '',
				component: Dashboard
			},
			{
				path: 'calendar',
				component: Calendar
			},
			{
				path: 'event-table',
				component: EventTable
			},
			{
				path: 'task-table',
				component: TaskTable
			},
			{
				path: 'editpet',
				component: EditPet
			},
			{
				path: 'createpet',
				component: CreatePet
			},
			{
				path: 'invoice',
				component: Invoice
			},
			{
				path: 'userprofile',
				component: UserProfile
			},
			{
				path: 'editprofile',
				component: EditUserProfile
			},
			{
				path: 'settings',
				component: Settings
			},
			{
				path: 'Medication',
				component: Medication
			},
			{
				path: 'vaccinationhistory',
				component: VaccinationHistory
			},
			{
				path: 'pet-profile',
				component: PetProfile
			}
		]
	},
	{
		path: '/home',
		redirect: '/'
	},
	{
		path: '/dashboard',
		redirect: '/'
	},
	{
		path: '/:catchAll(.*)',
		name: 'Not Found',
		component: NotFound
	},
	{
		path: '/login',
		name: 'Login',
		component: Login
	},
	{
		path: '/register',
		name: 'Register',
		component: Register
	}
];

const router = createRouter({
	history: createWebHashHistory(),
	routes
});

const whiteList = ['/login', '/register']


router.beforeEach((to, from, next) => {
	if (!localStorage.getItem('token')) {
		if (whiteList.indexOf(to.path) !== -1) {
			next()
		} 
		else {
			next('/login')
		}
	}
	else {
		next()
	}
  })
  

export default router;
