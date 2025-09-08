<template>
    <div>
        <div class="q-gutter-md row q-col-gutter-md">
            <q-card v-for="(value, index) in navigations" :key="index" @click="PreferenceStore.component = value.component" class="card card-hover-animate custom-border col-xs-12 col-sm-4 col-md-3 col-lg-3 flex flex-center q-pa-md no-shadow cursor-pointer radius-xs">
                <q-card-section class="text-center">
                    <div class="text-subtitle1 text-uppercase">{{ value.label }}</div>
                </q-card-section>
                <q-card-section class="text-center">
                        <div class="text-caption text-grey text-uppercase">
                            {{ value.description }}
                        </div>
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
        label: 'User management',
        description: 'preference',
        component: 'UserComponent'
    },
    {
        label: 'System management',
        description: 'preference',
        component: 'SystemComponent'
    },
    {
        label: 'Office management',
        description: 'preference',
        component: 'OfficeComponent'
    },
    {
        label: 'Account management',
        description: 'preference',
        component: 'AccountComponent'
    },
    {
        label: 'Fund management',
        description: 'preference',
        component: 'FundComponent'
    },
    {
        label: 'Payment Type management',
        description: 'preference',
        component: 'PaymentTypeComponent'
    },
    {
        label: 'Payment Receipt management',
        description: 'preference',
        component: 'PaymentReceiptComponent'
    },
    {
        label: 'Payment Partner management',
        description: 'preference',
        component: 'PaymentPartnerComponent'
    },
    {
        label: 'Payment Channel management',
        description: 'preference',
        component: 'PaymentChannelComponent'
    },
    {
        label: 'Service management',
        description: 'preference',
        component: 'ServiceComponent'
    },
    {
        label: 'Item management',
        description: 'preference',
        component: 'ItemComponent'
    },
    {
        label: 'Window management',
        description: 'preference',
        component: 'WindowComponent'
    },
    {
        label: 'Type & Form',
        description: 'setting',
        component: 'TypeFormSettingComponent'
    },
    {
        label: 'Service & Item',
        description: 'setting',
        component: 'ServiceItemSettingComponent'
    },
    {
        label: 'User & Window',
        description: 'setting',
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