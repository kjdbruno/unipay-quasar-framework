<template>
    <div class="wrapper q-mt-md">
        <div class="q-gutter-xs">
            <q-btn
                v-for="(btn, index) in navs"
                unelevated
                :class="BillingStore.component === `${btn.component}` ? 'bg-primary text-white' : 'bg-accent'"
                @click="BillingStore.component = `${btn.component}`"
                size="sm"
                :label="btn.label"
            />
        </div>
        <div class="q-my-xl">
            <component :is="components[BillingStore.component]" :key="BillingStore.component" />
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useBillingStore } from '../stores/billing-store';
import IssuanceComponent from 'src/components/Billing/IssuanceComponent.vue';
import IssuedComponent from 'src/components/Billing/IssuedComponent.vue';
import OnlineComponent from 'src/components/Billing/OnlineComponent.vue';

const BillingStore = useBillingStore();

const components = {
    IssuanceComponent,
    IssuedComponent,
    OnlineComponent
};

const navs = [
    { component: 'IssuanceComponent', label: 'Issuance' },
    { component: 'IssuedComponent', label: 'Issued' },
    { component: 'OnlineComponent', label: 'Online' },
]

onMounted(() => {
    if (BillingStore.component == null || BillingStore.component == '') {
        BillingStore.component = 'IssuanceComponent';
    }

});
</script>

<style scoped>

</style>