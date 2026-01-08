<template>
    <div class="wrapper q-mt-md">
        <div class="q-gutter-xs">
            <q-btn
                v-for="(btn, index) in navs"
                unelevated
                :class="PreferenceStore.component === `${btn.component}` ? 'bg-primary text-white' : 'bg-accent'"
                @click="PreferenceStore.component = `${btn.component}`"
                size="sm"
                :label="btn.label"
            />
        </div>
        <div class="q-my-xl">
            <component :is="components[PreferenceStore.component]" :key="PreferenceStore.component" />
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { usePreferenceStore } from '../stores/preference-store';
import PreferenceComponent from 'src/components/PreferenceComponent.vue';
import AccountComponent from 'src/components/Preference/AccountComponent.vue';
import FundComponent from 'src/components/Preference/FundComponent.vue';
import ItemComponent from 'src/components/Preference/ItemComponent.vue';
import OfficeComponent from 'src/components/Preference/OfficeComponent.vue';
import PaymentChannelComponent from 'src/components/Preference/PaymentChannelComponent.vue';
import PaymentReceiptComponent from 'src/components/Preference/PaymentReceiptComponent.vue';
import PaymentPartnerComponent from 'src/components/Preference/PaymentPartnerComponent.vue';
import PaymentTypeComponent from 'src/components/Preference/PaymentTypeComponent.vue';
import PositionComponent from 'src/components/Preference/PositionComponent.vue';
import ServiceComponent from 'src/components/Preference/ServiceComponent.vue';
import ServiceItemSettingComponent from 'src/components/Preference/ServiceItemSettingComponent.vue';
import SystemComponent from 'src/components/Preference/SystemComponent.vue';
import TypeFormSettingComponent from 'src/components/Preference/TypeFormSettingComponent.vue';
import UserComponent from 'src/components/Preference/UserComponent.vue';
import UserWindowSettingComponent from 'src/components/Preference/UserWindowSettingComponent.vue';
import WindowComponent from 'src/components/Preference/WindowComponent.vue';
import PaymentSettingComponent from 'src/components/Preference/PaymentSettingComponent.vue';

const PreferenceStore = usePreferenceStore();

const components = {
    PreferenceComponent,
    AccountComponent,
    FundComponent,
    ItemComponent,
    OfficeComponent,
    PaymentChannelComponent,
    PaymentReceiptComponent,
    PaymentPartnerComponent,
    PaymentTypeComponent,
    PositionComponent,
    ServiceComponent,
    ServiceItemSettingComponent,
    SystemComponent,
    TypeFormSettingComponent,
    UserComponent,
    UserWindowSettingComponent,
    WindowComponent,
    PaymentSettingComponent
};

const navs = [
    { component: 'UserComponent', label: 'User' },
    { component: 'OfficeComponent', label: 'Office' },
    { component: 'PositionComponent', label: 'Position' },
    { component: 'SystemComponent', label: 'System' },
    { component: 'AccountComponent', label: 'Account' },
    { component: 'FundComponent', label: 'Fund' },
    { component: 'PaymentChannelComponent', label: 'Payment Channel' },
    { component: 'PaymentReceiptComponent', label: 'Payment Receipt' },
    { component: 'PaymentPartnerComponent', label: 'Payment Partner' },
    { component: 'PaymentTypeComponent', label: 'Payment Type' },
    // { component: 'PaymentSettingComponent', label: 'Payment Setting' },
    { component: 'ServiceComponent', label: 'Revenue Service' },
    { component: 'ItemComponent', label: 'Revenue Item' },

    { component: 'TypeFormSettingComponent', label: 'Type | Form Setting' },
    { component: 'ServiceItemSettingComponent', label: 'Service | Item Setting' },
    { component: 'WindowComponent', label: 'Window' },
    { component: 'UserWindowSettingComponent', label: 'User | Window Setting' },
]

onMounted(() => {
    // if (PreferenceStore.component == null || PreferenceStore.component == '') {
    //     PreferenceStore.component = 'PreferenceComponent';
    // }
});
</script>

<style scoped>

</style>