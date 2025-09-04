<template>
    <div>
        <div class="q-gutter-md row q-col-gutter-md">
            <q-card v-for="(tile, index) in tiles" :key="index" class="card card-hover-animate col-xs-12 col-sm-4 col-md-3 col-lg-3 flex flex-center q-pa-md no-shadow cursor-pointer" square :class="tile.class" @click="handleClick(tile)">
                <q-card-section class="text-center" v-if="!tile.isIcon">
                    <div class="text-h5 text-uppercase">{{ tile.title }}</div>
                    <div class="text-caption">{{ tile.description }}</div>
                </q-card-section>
                <q-card-section class="text-center" v-if="tile.isIcon">
                    <q-icon :name="tile.icon" size="8em">
                    </q-icon>
                </q-card-section>
            </q-card>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useNavigationStore } from 'src/stores/nav-store';
import { useRouter } from 'vue-router';
import { useFeedbackStore } from 'src/stores/feedback-store';
import { usePreferenceStore } from 'src/stores/preference-store';
import { useAuthStore } from 'src/stores/auth-store';

const navigationStore = useNavigationStore();
const router = useRouter();
const FeedbackStore = useFeedbackStore();
const PreferenceStore = usePreferenceStore();
const AuthStore = useAuthStore();

const tiles = ref([
    { title: 'Analytics', description: 'Gain insights with data-driven analytics.', icon: null, isRoute: true, isIcon: false, class: 'bg-white text-dark', route: 'analytics' },
    { title: 'Complaint', description: 'Receive and address public complaints to improve city services.', icon: null, isRoute: true, isIcon: false, class: 'bg-white text-dark', route: 'complaint' },
    { title: 'Feedback', description: 'Collect and review feedback to enhance city programs and services.', icon: null, isRoute: true, isIcon: false, class: 'bg-white text-dark', route: 'feedback' },
    { title: 'Discussion', description: 'Engage citizens through discussions and polls to guide city decisions and improvements.', icon: null, isRoute: true, isIcon: false, class: 'bg-white text-dark', route: 'discussion' },
    { title: 'Preferences', description: 'Customize your settings and preferences.', icon: null, isRoute: true, isIcon: false, class: 'bg-white text-dark', route: 'preference' },
    { title: 'Reports', description: 'Generate financial and transaction reports.', icon: null, isRoute: true, isIcon: false, class: 'bg-white text-dark', route: 'report' },
    { title: 'My Account', description: 'Manage your account details and security.', icon: null, isRoute: true, isIcon: false, class: 'bg-white text-dark', route: 'me' },
    { title: 'Logs', description: 'View system activity and logs.', icon: 'list_alt', isRoute: true, isIcon: false, class: 'bg-white text-dark', route: 'log' },
]);
const handleClick = (dt) => {
    const routesMap = {
        analytics: 'analyticsRoute',
        complaint: 'complaintRoute',
        feedback: 'feedbackRoute',
        discussion: 'discussionRoute',
        preference: 'preferenceRoute',
        report: 'reportRoute',
        me: 'accountRoute',
        log: 'logRoute'
    };

    const key = routesMap[dt.route];
    if (!key) return;

    if (!navigationStore[key]) {
        navigationStore[key] = `/${dt.route}`;
    }

    router.push(navigationStore[key]);

    if (dt.route == 'feedback') {
        FeedbackStore.component = 'FeedbackComponent';
    }
    if (dt.route == 'preference') {
        PreferenceStore.component = 'UserPreferenceComponent';
    }
}
</script>

<style scoped>
.card {
    height: 250px;
    width: 225px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}
.card-hover-animate {
    transition: border-color 0.3s ease, transform 0.2s ease;
}

.card-hover-animate:hover {
  transform: scale(1.02); /* optional zoom effect */
}
</style>