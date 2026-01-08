<template>
    <div>
        <div class="q-mt-md">
            <div class="card-grid">
                <div
                    class="card-anim-wrapper"
                    :style="{ animationDelay: `120ms` }"
                >
                    <q-card
                        class="card card-hover-animate flex flex-center q-pa-md radius-sm cursor-pointer"
                        @click="() => { modal = true; isEdit = false; ResetForm() }"
                    >
                        <q-card-section class="text-center">
                            <q-icon name="add_circle" size="7em" class="text-grey-5" />
                        </q-card-section>
                    </q-card>
                </div>
                <div
                    v-if="loading"
                    class="card-anim-wrapper"
                    :style="{ animationDelay: `120ms` }"
                >
                    <q-card
                        class="card card-hover-animate flex flex-center q-pa-md radius-sm"
                    >
                        <q-card-section class="text-center">
                            <div>
                                <q-spinner-puff size="md" />
                            </div>
                            <div class="text-caption text-grey text-capitalize">we're working on it</div>
                        </q-card-section>
                    </q-card>
                </div>
                <div
                    v-if="!loading && !services.length"
                    class="card-anim-wrapper"
                    :style="{ animationDelay: `120ms` }"
                >
                    <q-card
                        class="card card-hover-animate flex flex-center q-pa-md radius-sm"
                    >
                        <q-card-section class="text-center">
                            <div class="text-caption text-grey text-capitalize">no data found</div>
                        </q-card-section>
                    </q-card>
                </div>
                <div
                    v-if="!loading && services.length"
                    v-for="(v, index) in services"
                    :key="`data-${v.id}`"
                    class="card-anim-wrapper"
                    :style="{ animationDelay: `${index * 120}ms` }"
                >
                    <q-card
                        class="card card-hover-animate flex flex-center q-pa-md radius-sm"
                        >
                        <q-card-section class="text-center full-width">
                            <div class="text-body1 text-uppercase">{{ v.name }}</div>
                            <div class="text-caption text-capitalize text-grey">{{ v.Office.alias }}</div>
                        </q-card-section>
                        <q-card-section class="text-center full-width">
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
                            class="absolute-top-left q-ma-sm"
                            style="width: 7px; height: 7px; border-radius: 50%;"
                            :class="v.isActive ? 'bg-positive' : 'bg-negative'"
                        ></div>
                    </q-card>
                </div>
            </div>
        </div>
        <q-footer class="bg-white no-shadow q-mx-lg q-mb-md q-py-sm radius-xs text-grey">
            <q-toolbar>
                <q-toolbar-title class="text-caption text-uppercase">
                    <div>© 2025 UNIPAY. All Rights Reserved.</div>
                </q-toolbar-title>
                <q-input outlined dense debounce="1000" v-model="filter" placeholder="Search..." @update:model-value="LoadAll">
                    <template v-slot:before>
                        <div class="text-caption text-uppercase">{{ `page ${meta.CurrentPage} of ${meta.TotalPages}` }}</div>
                    </template>
                    <template v-slot:after>
                        <q-btn unelevated size="xs" round color="primary" icon="first_page" :disable="page <= 1" @click="FirstPage">
                            <q-tooltip anchor="top middle" self="top middle" transition-show="scale" transition-hide="scale" class="text-capitalize">First Page</q-tooltip>
                        </q-btn>
                        <q-btn unelevated size="xs" round color="primary" icon="arrow_back" :disable="page <= 1" @click="PreviousPage">
                            <q-tooltip anchor="top middle" self="top middle" transition-show="scale" transition-hide="scale" class="text-capitalize">Previous</q-tooltip>
                        </q-btn>
                        <q-btn unelevated size="xs" round color="primary" icon="arrow_forward" :disable="page >= meta.TotalPages" @click="NextPage">
                            <q-tooltip anchor="top middle" self="top middle" transition-show="scale" transition-hide="scale" class="text-capitalize">Next</q-tooltip>
                        </q-btn>
                        <q-btn unelevated size="xs" round color="primary" icon="last_page" :disable="page >= meta.TotalPages" @click="LastPage">
                            <q-tooltip anchor="top middle" self="top middle" transition-show="scale" transition-hide="scale" class="text-capitalize">Last Page</q-tooltip>
                        </q-btn>
                    </template>
                    <template v-slot:prepend>
                        <q-icon name="search" style="font-size: 1rem;" />
                    </template>
                </q-input>
            </q-toolbar>
        </q-footer>
        <q-dialog persistent v-model="modal" full-height>
            <q-card class="column full-height" style="width: 75%; max-width: 100vw;">
                <q-card-section class="row items-center q-pa-lg">
                    <div class="text-h5 text-uppercase">{{ isEdit ? 'modify revenue service' : 'create new revenue service' }}</div>
                </q-card-section>
                <q-separator inset/>
                <q-card-section class="col">
                    <div class="row q-col-gutter-xs q-mb-md">
                        <div class="col-6">
                            <div class="text-caption text-uppercase" :class="formErrors.name.type ? 'text-negative' : 'text-grey'">{{ formErrors.name.type ? formErrors.name.msg : 'service name' }}</div>
                            <q-input 
                                v-model="name"
                                label="Enter Service Name"
                                outlined 
                                :error="formErrors.name.type"
                                type="textarea"
                                class="text-capitalize"
                                no-error-icon
                            />
                        </div>
                    </div>
                    <div class="row q-col-gutter-xs q-mb-md">
                        <div class="col-3">
                            <div class="text-caption text-uppercase" :class="formErrors.accountId.type ? 'text-negative' : 'text-grey'">{{ formErrors.accountId.type ? formErrors.accountId.msg : 'account' }}</div>
                            <q-select 
                                v-model="accountId" 
                                label="Choose Account"
                                emit-value 
                                map-options 
                                :options="filteredAccounts" 
                                outlined
                                use-input 
                                input-debounce="300" 
                                @filter="filterAccountFn" 
                                :error="formErrors.accountId.type"
                                no-error-icon
                                option-value="value"
                                option-label="label"
                                class="text-capitalize"
                            />
                        </div>
                        <div class="col-3">
                            <div class="text-caption text-uppercase" :class="formErrors.officeId.type ? 'text-negative' : 'text-grey'">{{ formErrors.officeId.type ? formErrors.officeId.msg : 'office' }}</div>
                            <q-select 
                                v-model="officeId" 
                                label="Choose Office"
                                emit-value 
                                map-options 
                                :options="filteredOffices"
                                outlined
                                use-input 
                                input-debounce="300" 
                                @filter="filterOfficeFn" 
                                :error="formErrors.officeId.type"
                                no-error-icon
                                option-value="value"
                                option-label="label"
                                class="text-capitalize"
                            />
                        </div>
                    </div>
                    <div class="row q-col-gutter-xs q-mb-md">
                        <div class="col-3">
                            <div class="text-caption text-uppercase" :class="formErrors.fundId.type ? 'text-negative' : 'text-grey'">{{ formErrors.fundId.type ? formErrors.fundId.msg : 'fund' }}</div>
                            <q-select 
                                v-model="fundId" 
                                label="Choose Fund"
                                emit-value 
                                map-options 
                                :options="filteredFunds" 
                                outlined
                                use-input 
                                input-debounce="300" 
                                @filter="filterFundFn" 
                                :error="formErrors.fundId.type"
                                no-error-icon
                                option-value="value"
                                option-label="label"
                                class="text-capitalize"
                            />
                        </div>
                        <div class="col-3">
                            <div class="text-caption text-uppercase" :class="formErrors.systemId.type ? 'text-negative' : 'text-grey'">{{ formErrors.systemId.type ? formErrors.systemId.msg : 'system' }}</div>
                            <q-select 
                                v-model="systemId" 
                                label="Choose System"
                                emit-value 
                                map-options 
                                :options="filteredSystems" 
                                outlined
                                use-input 
                                input-debounce="300" 
                                @filter="filterSystemFn" 
                                :error="formErrors.systemId.type"
                                no-error-icon
                                option-value="value"
                                option-label="label"
                                class="text-capitalize"
                            />
                        </div>
                    </div>
                </q-card-section>
                <q-card-actions class="q-pa-md">
                    <q-btn 
                        unelevated 
                        color="primary" 
                        label="save" 
                        class="btn"
                        @click="isEdit ? Update() : Create()"
                    />
                    <q-btn 
                        unelevated 
                        outline
                        color="primary" 
                        label="discard" 
                        class="btn"
                        @click="() => { modal = false; }"
                    />
                </q-card-actions>
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
        type: null, msg: '' 
    },
    accountId: {
        type: null, msg: ''
    },
    fundId: {
        type: null, msg: ''
    },
    officeId: {
        type: null, msg: ''
    },
    systemId: {
        type: null, msg: ''
    }
});

const formValidations = () => {

    let isError = false;

    if (!name.value) {
        formErrors.name.type = true;
        formErrors.name.msg = 'service name is required';
        isError = true;
    } else {
        formErrors.name.type = null;
        formErrors.name.msg = '';
    }

    if (!accountId.value) {
        formErrors.accountId.type = true;
        formErrors.accountId.msg = 'account is required';
        isError = true;
    } else {
        formErrors.accountId.type = null;
        formErrors.accountId.msg = '';
    }

    if (!officeId.value) {
        formErrors.officeId.type = true;
        formErrors.officeId.msg = 'office is required';
        isError = true;
    } else {
        formErrors.officeId.type = null;
        formErrors.officeId.msg = '';
    }

    if (!fundId.value) {
        formErrors.fundId.type = true;
        formErrors.fundId.msg = 'fund is required';
        isError = true;
    } else {
        formErrors.fundId.type = null;
        formErrors.fundId.msg = '';
    }

    if (!systemId.value) {
        formErrors.systemId.type = true;
        formErrors.systemId.msg = 'system is required';
        isError = true;
    } else {
        formErrors.systemId.type = null;
        formErrors.systemId.msg = '';
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
                Limit: limit.value,
                Filter: filter.value
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
    accountId.value = Number(data.accountId);
    officeId.value = Number(data.officeId);
    fundId.value = Number(data.fundId);
    systemId.value = Number(data.systemId);
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

// --- State ---
const accounts = ref([]);
const offices = ref([]);
const funds = ref([]);
const systems = ref([]);

const filteredAccounts = ref([]);
const filteredOffices = ref([]);
const filteredFunds = ref([]);
const filteredSystems = ref([]);

// --- Generic Loader ---
const LoadOptions = async (endpoint, target, filteredTarget) => {
    try {
        const response = await api.get(`/option/${endpoint}`);

        // normalize: ensure label/value exist + value is numeric
        const normalized = response.data.map(item => ({
            label: item.label,
            value: Number(item.value)
        }));

        target.value = normalized;
        filteredTarget.value = normalized;   // <-- IMPORTANT

    } catch (error) {
        console.error(`Error loading ${endpoint}:`, error);
    }
};


// Usage
const LoadAccounts = () => LoadOptions('account', accounts, filteredAccounts);
const LoadOffices  = () => LoadOptions('office', offices, filteredOffices);
const LoadFunds    = () => LoadOptions('fund', funds, filteredFunds);
const LoadSystems  = () => LoadOptions('system', systems, filteredSystems);

// --- Generic Filter Function ---
const createFilterFn = (source, filtered) => {
    return (val, update) => {
        update(() => {
            if (!val) {
                filtered.value = source.value;
            } else {
                const needle = val.toLowerCase();
                filtered.value = source.value.filter(v =>
                    v.label.toLowerCase().includes(needle)
                );
            }
        });
    };
};

// Usage
const filterAccountFn = createFilterFn(accounts, filteredAccounts);
const filterOfficeFn  = createFilterFn(offices, filteredOffices);
const filterFundFn    = createFilterFn(funds, filteredFunds);
const filterSystemFn  = createFilterFn(systems, filteredSystems);

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