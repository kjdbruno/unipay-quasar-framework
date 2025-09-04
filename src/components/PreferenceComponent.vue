<template>
    <div>
        <div class="q-gutter-md row q-col-gutter-md">
            <q-card v-for="(value, index) in navigations" :key="index" @click="PreferenceStore.component = value.component" class="card card-hover-animate custom-border col-xs-12 col-sm-4 col-md-3 col-lg-3 flex flex-center q-pa-md no-shadow cursor-pointer radius-xs">
                <q-card-section class="text-center">
                    <div class="text-h5 text-uppercase">{{ value.label }}</div>
                    <div class="text-caption text-capitalize">preference</div>
                </q-card-section>
            </q-card>
        </div> 
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { usePreferenceStore } from '../stores/preference-store';
const PreferenceStore = usePreferenceStore();

const navigations = ref([
    {
        label: 'System',
        component: 'SystemComponent'
    },
    {
        label: 'User',
        component: 'UserComponent'
    },
    {
        label: 'Office',
        component: 'OfficeComponent'
    },
    {
        label: 'Account',
        component: 'AccountComponent'
    },
    {
        label: 'Fund',
        component: 'FundComponent'
    },
    {
        label: 'Payment Type',
        component: 'PaymentTypeComponent'
    },
    {
        label: 'Payment Receipt',
        component: 'PaymentReceiptComponent'
    },
    {
        label: 'Payment Partner',
        component: 'PaymentPartnerComponent'
    },
    {
        label: 'Payment Channel',
        component: 'PaymentChannelComponent'
    },
    {
        label: 'Service',
        component: 'ServiceComponent'
    },
    {
        label: 'Item',
        component: 'ItemComponent'
    },
    {
        label: 'Type Form Setting',
        component: 'TypeFormSettingComponent'
    },
    {
        label: 'Service Item Setting',
        component: 'ServiceItemSettingComponent'
    },
    {
        label: 'Window',
        component: 'WindowComponent'
    },
    {
        label: 'User Window Setting',
        component: 'UserWindowSettingComponent'
    },
]);
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