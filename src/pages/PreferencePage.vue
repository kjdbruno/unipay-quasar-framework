<template>
    <div>
        <div class="q-mt-md">
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
    WindowComponent
};

onMounted(() => {
    if (PreferenceStore.component == null || PreferenceStore.component == '') {
        PreferenceStore.component = 'PreferenceComponent';
    }
});
</script>

<style scoped>

</style>