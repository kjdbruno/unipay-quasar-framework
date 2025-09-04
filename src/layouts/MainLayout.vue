<template>
    <q-layout view="lHh Lpr lFf">
        
        <q-header class="bg-white q-mx-lg q-mt-md q-py-sm" v-if="authStore.isAuthenticated && router.currentRoute.value.name != 'login'">
            <q-toolbar class="header">
                <q-toolbar-title>
                    <div class="text-body1 text-capitalize text-grey">
                        {{ greetings }}
                    </div>
                    <div class="text-capitalize text-dark">
                        {{ authStore.user.firstname }}
                    </div>
                </q-toolbar-title>
                <div class="q-gutter-xs">
                    <q-btn round flat>
                        <q-avatar>
                            <img :src="message" />
                        </q-avatar>
                        <q-badge floating color="red" rounded>2</q-badge>
                    </q-btn>
                    <q-btn round flat>
                        <q-avatar>
                            <img :src="notification" />
                        </q-avatar>
                        <q-badge floating color="red" rounded>2</q-badge>
                    </q-btn>
                </div>
            </q-toolbar>
        </q-header>

        <q-drawer show-if-above v-model="leftDrawerOpen" side="left" :width="width" v-if="authStore.isAuthenticated && router.currentRoute.value.name != 'login'">
            <div class="full-height bg-accent q-pa-xl">
                <q-list>
                    <q-item clickable v-ripple class="q-pa-lg radius-xs" v-for="item in menuItems" :key="item.label" :to="item.to" >
                        <q-item-section avatar>
                            <img :src="isActive(item.label) ? item.iconPrimary : item.iconSecondary"  width="25" />
                        </q-item-section>
                        <q-item-section class="text-uppercase" :class="isActive(item.label) ? 'text-primary' : 'text-grey'"> {{ item.label }}</q-item-section>
                    </q-item>
                </q-list>
            </div>
            <div class="absolute-bottom">
                <div class="text-center q-pa-lg">
                    <q-avatar class="q-mb-sm">
                        <img :src="authStore.user.avatar">
                    </q-avatar>
                    <div class="text-weight-bold text-uppercase text-body1">{{ authStore.user.firstname }}&nbsp;{{ authStore.user.lastname }}</div>
                    <div class="text-caption text-grey">{{ authStore.user.username }}</div>
                </div>
            </div>
        </q-drawer>
        
        <q-page-container>
            <q-page class="q-pa-lg">
                <router-view />
            </q-page>
        </q-page-container>

    </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useIndexStore } from 'src/stores/index-store';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from 'src/stores/auth-store';
import { useSocketStore } from 'src/stores/socket-store';
import { usePreferenceStore } from 'src/stores/preference-store';
import moment from 'moment';
import { socket } from 'src/boot/socket';

import logo from 'src/assets/logo.png';
import message from 'src/assets/message.png';
import notification from 'src/assets/notification.png';
import homeP from 'src/assets/homeP.png';
import homeS from 'src/assets/homeS.png';
import paymentP from 'src/assets/paymentP.png';
import paymentS from 'src/assets/paymentS.png';
import receiptP from 'src/assets/receiptP.png';
import receiptS from 'src/assets/receiptS.png';
import remittanceP from 'src/assets/remittanceP.png';
import remittanceS from 'src/assets/remittanceS.png';
import preferenceP from 'src/assets/preferenceP.png';
import preferenceS from 'src/assets/preferenceS.png';
import analyticP from 'src/assets/analyticP.png';
import analyticS from 'src/assets/analyticS.png';
import reportP from 'src/assets/reportP.png';
import reportS from 'src/assets/reportS.png';

const indexStore = useIndexStore();
const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const socketStore = useSocketStore();
const PreferenceStore = usePreferenceStore();

const now = ref(new Date());
const greetings = computed(() => {
    const hour = now.value.getHours()
    if (hour < 12) {
        return 'Good Morning!'
    } else if (hour < 18) {
        return 'Good Afternoon!'
    } else {
        return 'Good Evening!'
    }
})

const baseURL = process.env.VUE_APP_BACKEND_URL;

const leftDrawerOpen = ref(false);
const width = ref(350);

function toggleLeftDrawer () {
    leftDrawerOpen.value = !leftDrawerOpen.value
}

const formatDate = (timestamp) => {
    return moment(timestamp).fromNow();
};

const readNotification = () => {
    authStore.readNotification();
}

onMounted(() => {
    console.log(process.env.VUE_APP_BACKEND_URL);
});

// example menuItems format update
const menuItems = [
    { iconPrimary: homeP, iconSecondary: homeS, label: 'home', to: '/home' },
    { iconPrimary: paymentP, iconSecondary: paymentS, label: 'payment', to: '/payment' },
    { iconPrimary: receiptP, iconSecondary: receiptS, label: 'receipt', to: '/receipt' },
    { iconPrimary: remittanceP, iconSecondary: remittanceS, label: 'remittance', to: '/remittance' },
    { iconPrimary: preferenceP, iconSecondary: preferenceS, label: 'preference', to: '/preference' },
    { iconPrimary: analyticP, iconSecondary: analyticS, label: 'analytic', to: '/analytic' },
    { iconPrimary: reportP, iconSecondary: reportS, label: 'report', to: '/report' },
]

// helper function to check if current route matches item label
const isActive = (label) => route.name?.toLowerCase() === label.toLowerCase()

</script>
