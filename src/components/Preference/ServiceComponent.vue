<template>
    <div>
        <q-card class="no-shadow">
            <q-card-section>
                <div class="row items-center no-wrap justify-between">
                    <div class="row items-center">
                        <q-btn flat round dense icon="arrow_back" size="sm" class="text-dark" @click="PreferenceStore.component = 'PreferenceComponent'"/>
                        <span class="text-h5 text-dark text-uppercase q-ml-sm">service management</span>
                    </div>
                    <div class="col-auto">
                        <q-input outlined dense debounce="300" v-model="filter" placeholder="Search...">
                            <template v-slot:before>
                                <q-btn :disable="page <= 1" @click="PreviousPage" unelevated size="xs" round color="primary" icon="arrow_back"/>
                                <q-btn v-if="services.length" unelevated outline size="sm" round color="primary" :label="meta.CurrentPage"/>
                                <q-btn :disable="page >= meta.TotalPages" @click="NextPage" unelevated size="xs" round color="primary" icon="arrow_forward"/>
                            </template>
                            <template v-slot:prepend>
                                <q-icon name="search" style="font-size: 1rem;" />
                            </template>
                            <template v-slot:after>
                                <q-btn unelevated size="md" color="primary" label="new" @click="() => { modal = true; isEdit = false; ResetForm() }"/>
                            </template>
                        </q-input>
                    </div>
                </div>
            </q-card-section>
        </q-card>
        <div class="q-mt-md">
            <transition-group name="fade-slide" tag="div" class="q-gutter-md row q-col-gutter-md">
                <q-card v-for="(v, index) in filteredData" :key="index" class="card card-hover-animate custom-border col-xs-12 col-sm-4 col-md-3 col-lg-3 flex flex-center q-pa-md no-shadow cursor-pointer radius-xs">
                    <q-card-section class="text-center">
                        <div class="text-body1 text-uppercase">{{ v.name }}</div>
                        <div class="text-caption text-capitalize text-grey">{{ v.Office.alias }}</div>
                    </q-card-section>
                    <q-card-section class="text-center">
                        <div class="text-caption text-uppercase">{{ v.Fund.name }}</div>
                        <div class="text-caption text-grey">{{ v.System.name }}</div>
                    </q-card-section>
                    <div class="card-overlay absolute-full flex flex-center text-white">
                        <div class="q-gutter-xs">
                            <q-btn v-if="v.isActive" unelevated size="xs" color="primary" label="modify" @click="() => { modal = true; isEdit = true; ResetForm(); Modify(v) }"/>
                            <q-btn v-if="v.isActive" unelevated outline size="xs" color="primary" label="disable" @click="Disable(v)"/>
                            <q-btn v-if="!v.isActive" unelevated outline size="xs" color="primary" label="enable" @click="Enable(v)"/>
                        </div>
                    </div>
                    <div
                        class="absolute-top-right q-mt-sm q-mr-sm"
                        style="width: 6px; height: 6px; border-radius: 50%;"
                        :style="{ backgroundColor: v.isActive ? 'green' : 'red' }"
                        >
                    </div>
                    <q-inner-loading :showing="btnLoading">
                        <q-spinner-oval/>
                    </q-inner-loading>
                </q-card>
            </transition-group>
        </div>
        <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-spinner-oval
                v-if="loading"
                color="primary"
                size="3em"
            />
            <q-card class="no-shadow custom-border" v-if="!loading && !services.length">
                <q-card-section class="text-uppercase text-h6 text-grey">
                    no data found!
                </q-card-section>
            </q-card>
        </q-page-sticky>
        <q-dialog square persistent v-model="modal" position="right" full-height class="dialog-action">
            <q-card class="card-action column full-height">
                <q-card-section class="row items-center q-pa-lg">
                    <div class="text-h5 text-uppercase">{{ isEdit ? 'modify payment receipt' : 'create new payment receipt' }}</div>
                <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>
                <q-separator inset/>
                <q-card-section class="col">
                    <q-input 
                        v-model="name"
                        outlined 
                        label="Name" 
                        :error="formErrors.name.type"
                        class="q-mb-xs"
                    >
                    </q-input>
                    <q-select 
                        v-model="accountId" 
                        emit-value 
                        map-options 
                        :options="filteredAccounts" 
                        label="Choose Account" 
                        outlined
                        use-input 
                        input-debounce="300" 
                        @filter="filterAccountFn" 
                        :error="formErrors.accountId.type"
                        class="q-mb-sm"
                    />
                    <q-select 
                        v-model="officeId" 
                        emit-value 
                        map-options 
                        :options="filteredOffices" 
                        label="Choose Office" 
                        outlined
                        use-input 
                        input-debounce="300" 
                        @filter="filterOfficeFn" 
                        :error="formErrors.officeId.type"
                        class="q-mb-sm"
                    />
                    <q-select 
                        v-model="fundId" 
                        emit-value 
                        map-options 
                        :options="filteredFunds" 
                        label="Choose Fund" 
                        outlined
                        use-input 
                        input-debounce="300" 
                        @filter="filterFundFn" 
                        :error="formErrors.fundId.type"
                        class="q-mb-sm"
                    />
                    <q-select 
                        v-model="systemId" 
                        emit-value 
                        map-options 
                        :options="filteredSystems" 
                        label="Choose System" 
                        outlined
                        use-input 
                        input-debounce="300" 
                        @filter="filterSystemFn" 
                        :error="formErrors.systemId.type"
                        class="q-mb-sm"
                    />
                </q-card-section>
                <q-card-section v-if="errors.length">
                    <q-banner class="bg-red-1 text-negative rounded-lg shadow-md radius-xs q-pa-sm q-mt-md" dense inline-actions >
                        <q-list>
                            <q-item>
                                <q-item-section avatar>
                                    <q-icon name="error" color="negative"/>
                                </q-item-section>
                                <q-item-section>
                                    <div v-for="(dt, index) in errors" :key="index" class="text-caption">
                                        {{ dt.msg }}
                                    </div>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-banner>
                </q-card-section>
                <q-card-section>
                    <q-btn 
                        unelevated 
                        color="primary" 
                        label="submit" 
                        size="lg" 
                        class="full-width"
                        @click="isEdit ? Update() : Create()"
                    />
                </q-card-section>
                <q-inner-loading :showing="innerLoading">
                    <q-spinner-oval/>
                </q-inner-loading>
            </q-card>
        </q-dialog>
    </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { usePreferenceStore } from 'src/stores/preference-store';
import { api } from 'src/boot/axios';
import { Toast } from 'src/boot/sweetalert'; 
import { useQuasar } from 'quasar'

const $q = useQuasar()
const PreferenceStore = usePreferenceStore();

const id = ref('');
const name = ref('');
const accountId = ref('');
const officeId = ref('');
const fundId = ref('');
const systemId = ref('');

const innerLoading = ref(false);
const btnLoading = ref(false);

const errors = ref([]);

const formErrors = reactive({
    name: { 
        type: null 
    },
    accountId: {
        type: null
    },
    fundId: {
        type: null
    },
    officeId: {
        type: null
    },
    systemId: {
        type: null
    }
});

const formValidations = () => {

    errors.value = [];

    let isError = false;

    if (!name.value) {

        formErrors.name.type = true;

        errors.value.push({
            type: 'field',
            value: name.value,
            msg: 'Name is required',
            path: 'name',
            location: 'body'
        });

        isError = true

    } else {
        
        formErrors.name.type = null

    }

    if (!accountId.value) {

        formErrors.accountId.type = true;

        errors.value.push({
            type: 'field',
            value: accountId.value,
            msg: 'Account is required',
            path: 'accountId',
            location: 'body'
        });

        isError = true

    } else {
        
        formErrors.accountId.type = null

    }

    if (!officeId.value) {

        formErrors.officeId.type = true;

        errors.value.push({
            type: 'field',
            value: officeId.value,
            msg: 'Office is required',
            path: 'officeId',
            location: 'body'
        });

        isError = true

    } else {
        
        formErrors.officeId.type = null

    }

    if (!fundId.value) {

        formErrors.fundId.type = true;

        errors.value.push({
            type: 'field',
            value: fundId.value,
            msg: 'Fund is required',
            path: 'fundId',
            location: 'body'
        });

        isError = true

    } else {
        
        formErrors.fundId.type = null

    }

    if (!systemId.value) {

        formErrors.systemId.type = true;

        errors.value.push({
            type: 'field',
            value: systemId.value,
            msg: 'System is required',
            path: 'systemId',
            location: 'body'
        });

        isError = true

    } else {
        
        formErrors.systemId.type = null

    }

    return !isError

}

const modal = ref(false);
const isEdit = ref(false);

const filter = ref('');

const loading = ref(false);

const services = ref([]);
const meta = ref({});
const page = ref(1);
const limit = ref(10);

const LoadAll = async () => {
    loading.value = true;
    try {
        const { data } = await api.get('/revenueservice', {
            params: { 
                Page: page.value, 
                Limit: limit.value 
            }
        });
        services.value = data.Data
        meta.value = data.Meta
    } catch (error) {
        console.error("Error fetching all services:", error);
    } finally {
        loading.value = false
    }
}

const NextPage = () => {
     if (page.value < meta.value.TotalPages) {
        page.value++
        LoadAll()
    }
}

const PreviousPage = () => {
    if (page.value > 1) {
        page.value--
        LoadAll()
    }
}

const filteredData = computed(() => {

    let data = services.value.slice()

    // always sort by createdAt (latest first)
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    if (filter.value) {
        data = data.filter(v =>
            v.name.toLowerCase().includes(filter.value.toLowerCase())
        ).slice(0, 5)
    }

    return data;

})


const ResetForm = () => {
    errors.value = [];
    name.value = '';
    accountId.value = '';
    fundId.value = '';
    officeId.value = '';
    systemId.value = '';
    formErrors.name.type = null;
    formErrors.accountId.type = null;
    formErrors.fundId.type = null;
    formErrors.officeId.type = null;
    formErrors.systemId.type = null;
}

const Create = async () => {
    if (!formValidations()) return;
    innerLoading.value = true;
    try {
        const response = await api.post(`/revenueservice`, {
            name: name.value,
            accountId: accountId.value,
            officeId: officeId.value,
            fundId: fundId.value,
            systemId: systemId.value
        });
        ResetForm();
        modal.value = false;
        Toast.fire({
            icon: "success",
            html: `
                <div class="text-h6 text-bold text-uppercase">granted!</div>
                <div class="text-caption; text-capitalize;">${response.data.Message}<div>
            `
        });
        (services.value.length ? (services.value.push(response.data.Data)) : LoadAll());
    } catch (e) {
        errors.value = e.response.data.errors || [];
    } finally {
        innerLoading.value = false;
    }
}

const Modify = async (data) => {
    id.value = data.id;
    name.value = data.name;
    accountId.value = data.accountId;
    officeId.value = data.officeId;
    fundId.value = data.fundId;
    systemId.value = data.systemId;
}

const Update = async () => {
    if (!formValidations()) return;
    innerLoading.value = true;
    try {
        const response = await api.post(`/revenueservice/${id.value}/update`, {
            name: name.value,
            accountId: accountId.value,
            officeId: officeId.value,
            fundId: fundId.value,
            systemId: systemId.value
        });
        ResetForm();
        modal.value = false;
        Toast.fire({
            icon: "success",
            html: `
                <div class="text-h6 text-bold text-uppercase">granted!</div>
                <div class="text-caption; text-capitalize;">${response.data.Message}<div>
            `
        });
        UpdateList(response.data.Data);
    } catch (e) {
        errors.value = e.response.data.errors || [];
    } finally {
        innerLoading.value = false;
    }
}

const UpdateList = async (data) => {
    const index = services.value.findIndex(item => item.id === data.id)
    if (index !== -1) {
        services.value[index] = data
    }
}

const Disable = async (data) => {
    btnLoading.value = true;
    try {
        const response = await api.post(`/revenueservice/${data.id}/disable`);
        Toast.fire({
            icon: "success",
            html: `
                <div class="text-h6 text-bold text-uppercase">granted!</div>
                <div class="text-caption; text-capitalize;">${response.data.Message}<div>
            `
        });
        UpdateList(response.data.Data);
    } catch (e) {
        errors.value = e.response.data.errors || [];
    } finally {
        btnLoading.value = false;
    }
}

const Enable = async (data) => {
    btnLoading.value = true;
    try {
        const response = await api.post(`/revenueservice/${data.id}/enable`);
        Toast.fire({
            icon: "success",
            html: `
                <div class="text-h6 text-bold text-uppercase">granted!</div>
                <div class="text-caption; text-capitalize;">${response.data.Message}<div>
            `
        });
        UpdateList(response.data.Data);
    } catch (e) {
        errors.value = e.response.data.errors || [];
    } finally {
        btnLoading.value = false;
    }
}

const accounts = ref([]);
const offices = ref([]);
const funds = ref([]);
const systems = ref([]);

const filteredAccounts = ref(accounts.value);
const filteredOffices = ref(offices.value);
const filteredFunds = ref(funds.value);
const filteredSystems = ref(systems.value);

const LoadAccounts = async () => {
    try {
        const response = await api.get('/option/account');
        accounts.value = response.data;
    } catch (error) {
        console.error("Error fetching accounts:", error);
    } finally {

    }
}

const LoadOffices = async () => {
    try {
        const response = await api.get('/option/office');
        offices.value = response.data;
    } catch (error) {
        console.error("Error fetching offices:", error);
    } finally {

    }
}

const LoadFunds = async () => {
    try {
        const response = await api.get('/option/fund');
        funds.value = response.data;
    } catch (error) {
        console.error("Error fetching funds:", error);
    } finally {

    }
}

const LoadSystems = async () => {
    try {
        const response = await api.get('/option/system');
        systems.value = response.data;
    } catch (error) {
        console.error("Error fetching systems:", error);
    } finally {

    }
}

const filterAccountFn = (val, update) => {
    if (val === '') {
        update(() => {
            filteredAccounts.value = accounts.value
        })
        return
    }
    update(() => {
        const needle = val.toLowerCase()
        filteredAccounts.value = accounts.value.filter(v =>
            v.label.toLowerCase().includes(needle)
        )
    })
}

const filterOfficeFn = (val, update) => {
    if (val === '') {
        update(() => {
            filteredOffices.value = offices.value
        })
        return
    }
    update(() => {
        const needle = val.toLowerCase()
        filteredOffices.value = offices.value.filter(v =>
            v.label.toLowerCase().includes(needle)
        )
    })
}

const filterFundFn = (val, update) => {
    if (val === '') {
        update(() => {
            filteredFunds.value = funds.value
        })
        return
    }
    update(() => {
        const needle = val.toLowerCase()
        filteredFunds.value = funds.value.filter(v =>
            v.label.toLowerCase().includes(needle)
        )
    })
}

const filterSystemFn = (val, update) => {
    if (val === '') {
        update(() => {
            filteredSystems.value = systems.value
        })
        return
    }
    update(() => {
        const needle = val.toLowerCase()
        filteredSystems.value = systems.value.filter(v =>
            v.label.toLowerCase().includes(needle)
        )
    })
}

onMounted(() => {
    LoadAll();
    LoadAccounts();
    LoadOffices();
    LoadFunds();
    LoadSystems();
})

</script>

<style scoped>
.card {
    height: 250px;
    width: 225px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    position: relative;
    overflow: hidden;
}
.card-hover-animate {
    transition: border-color 0.3s ease, transform 0.2s ease;
}

.card-hover-animate:hover {
  transform: scale(1.02); /* optional zoom effect */
}
.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.4s ease;
}
.fade-slide-enter-from {
    opacity: 0;
    transform: translateY(15px) scale(0.98);
}
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-15px) scale(0.98);
}

.card-overlay {
    backdrop-filter: blur(6px);
    background: rgba(255, 255, 255, 0.6);
    opacity: 0;
    transition: opacity 0.5s ease;
}
.card:hover .card-overlay {
    opacity: 1;
}
</style>