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
                    v-if="!loading && !items.length"
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
                    v-if="!loading && items.length"
                    v-for="(v, index) in items"
                    :key="`data-${v.id}`"
                    class="card-anim-wrapper"
                    :style="{ animationDelay: `${index * 120}ms` }"
                >
                    <q-card
                        class="card card-hover-animate flex flex-center q-pa-md radius-sm"
                        >
                        <q-card-section class="text-center full-width">
                            <div class="text-body1 text-uppercase">{{ v.name }}</div>
                            <div class="text-caption text-capitalize text-grey">{{ v.Receipt?.name }}</div>
                        </q-card-section>
                        <q-card-section class="text-center full-width">
                            <div class="text-caption text-grey">{{ v.isManual ? 'Manually' : formatPeso(v.cost) }}</div>
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
                    <div class="text-h5 text-uppercase">{{ isEdit ? 'modify revenue item' : 'create new revenue item' }}</div>
                </q-card-section>
                <q-separator inset/>
                <q-card-section class="col scroll">
                    <div class="row q-col-gutter-xs q-mb-md">
                        <div class="col-3">
                            <div class="text-caption text-uppercase text-grey">manually inputted cost</div>
                            <div>
                                <q-checkbox
                                    right-label
                                    v-model="isManual"
                                    label="Manual Cost"
                                    checked-icon="task_alt"
                                    unchecked-icon="panorama_fish_eye"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row q-col-gutter-xs q-mb-md">
                        <div class="col-3">
                            <div class="text-caption text-uppercase text-grey">can be accessed via online</div>
                            <div>
                                <q-checkbox
                                    right-label
                                    v-model="isOnline"
                                    label="Available Online"
                                    checked-icon="task_alt"
                                    unchecked-icon="panorama_fish_eye"
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row q-col-gutter-xs q-mb-md">
                        <div class="col-5">
                            <div class="text-caption text-uppercase" :class="formErrors.name.type ? 'text-negative' : 'text-grey'">{{ formErrors.name.type ? formErrors.name.msg : 'item name' }}</div>
                            <q-input 
                                v-model="name"
                                label="Enter Revenue Item Name"
                                outlined
                                :error="formErrors.name.type"
                                no-error-icon
                                class="text-capitalize"
                                type="textarea"
                            />
                        </div>
                    </div>
                    <div class="row q-col-gutter-xs q-mb-md">
                        <div class="col-3">
                            <div class="text-caption text-uppercase" :class="formErrors.typeId.type ? 'text-negative' : 'text-grey'">{{ formErrors.typeId.type ? formErrors.typeId.msg : 'payment type' }}</div>
                            <q-select 
                                v-model="typeId" 
                                label="Choose Payment Type" 
                                emit-value 
                                map-options 
                                :options="filteredPaymentTypes"
                                outlined
                                use-input 
                                input-debounce="300" 
                                @filter="filterPaymentTypeFn" 
                                :error="formErrors.typeId.type"
                                :hide-dropdown-icon="true"
                                no-error-icon
                                class="text-capitalize"
                            />
                        </div>
                        <div class="col-2" v-if="!isManual">
                            <div class="text-caption text-uppercase" :class="formErrors.cost.type ? 'text-negative' : 'text-grey'">{{ formErrors.cost.type ? formErrors.cost.msg : 'cost' }}</div>
                            <q-input 
                                v-model="cost"
                                label="Enter Cost" 
                                outlined 
                                no-error-icon
                                :error="formErrors.cost.type"
                            />
                        </div>
                    </div>
                    <div class="q-mt-lg">
                        <div class="text-h6 text-uppercase">revenue settings</div>
                        <div class="row q-col-gutter-xs">
                            <div class="col-3">
                                <div class="text-caption text-uppercase" :class="formErrors.settings.serviceId.msg ? 'text-negative' : 'text-grey'">{{ formErrors.settings.serviceId.msg ? formErrors.settings.serviceId.msg : 'revenue service' }}</div>
                            </div>
                            <div class="col-2">
                                <div class="text-caption text-uppercase" :class="formErrors.settings.percentage.msg ? 'text-negative' : 'text-grey'">{{ formErrors.settings.percentage.msg ? formErrors.settings.percentage.msg : 'percentage' }}</div>
                            </div>
                        </div>
                        <div class="row q-col-gutter-xs q-mb-xs" v-for="(v, index) in settings" :key="index">
                            <div class="col-3">
                                <q-select 
                                    v-model="v.serviceId" 
                                    label="Choose Service" 
                                    emit-value 
                                    map-options 
                                    :options="filteredServices" 
                                    outlined
                                    use-input 
                                    input-debounce="300" 
                                    @filter="filterServiceFn" 
                                    :error="formErrors.settings.serviceId.type[index]"
                                    :hide-dropdown-icon="true"
                                    no-error-icon
                                    class="text-capitalize"
                                />
                            </div>
                            <div class="col-2">
                                <q-input 
                                    v-model="v.percentage"
                                    label="Enter Percentage" 
                                    outlined 
                                    no-error-icon
                                    :error="formErrors.settings.percentage.type[index]"
                                />
                            </div>
                            <div class="col-1">
                                <q-btn v-if="settings.length > 1" flat icon="close" round size="sm" color="grey" class="q-mt-md" @click="Remove(index)"/>
                            </div>
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
                        label="add" 
                        class="btn"
                        @click="Add()"
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
const serviceId = ref('');
const typeId = ref('');
const cost = ref('');
const isManual = ref(false);
const isOnline = ref(false);
const settings = ref([
    { serviceId: "", percentage: "" }
]);

const innerLoading = ref(false);
const btnLoading = ref(false);

const formErrors = reactive({
    name: { type: null, msg: '' },
    typeId: { type: null, msg: '' },
    cost: { type: null, msg: '' },
    settings: {
        serviceId: {
            type: [],
            msg: ''
        },
        percentage: {
            type: [],
            msg: ''
        }
    }
})

const initSettingsErrors = () => {
    formErrors.settings.serviceId.type = settings.value.map(() => null)
    formErrors.settings.percentage.type = settings.value.map(() => null)
}
const formValidations = () => {
    let isError = false

    // reset base errors
    formErrors.name = { type: null, msg: '' }
    formErrors.typeId = { type: null, msg: '' }
    formErrors.cost = { type: null, msg: '' }

    // name
    if (!name.value) {
        formErrors.name.type = true
        formErrors.name.msg = 'item name is required'
        isError = true
    }

    // payment type
    if (!typeId.value) {
        formErrors.typeId.type = true
        formErrors.typeId.msg = 'payment type is required'
        isError = true
    }

    // cost
    if (!isManual.value) {
        if (!cost.value) {
            formErrors.cost.type = true
            formErrors.cost.msg = 'cost is required'
            isError = true
        } else if (!/^\d+(\.\d+)?$/.test(cost.value)) {
            formErrors.cost.type = true
            formErrors.cost.msg = 'cost must be a valid number'
            isError = true
        } else {
            formErrors.cost.type = null
            formErrors.cost.msg = ''
        }
    }


    // reset settings errors
    initSettingsErrors()
    formErrors.settings.serviceId.msg = ''
    formErrors.settings.percentage.msg = ''

    // settings validation
    settings.value.forEach((s, index) => {

        if (!s.serviceId) {
            formErrors.settings.serviceId.type[index] = true
            formErrors.settings.serviceId.msg = 'service is required'
            isError = true
        }

        if (!s.percentage) {
            formErrors.settings.percentage.type[index] = true
            formErrors.settings.percentage.msg = 'percentage is required'
            isError = true
        } else if (isNaN(s.percentage) || s.percentage < 0 || s.percentage > 100) {
            formErrors.settings.percentage.type[index] = true
            formErrors.settings.percentage.msg = 'percentage must be 0–100'
            isError = true
        }

    })

    return !isError
}



const modal = ref(false);
const isEdit = ref(false);

const filter = ref('');

const loading = ref(false);

const items = ref([]);
const meta = ref({});
const page = ref(1);
const limit = ref(10);

const LoadAll = async () => {
    loading.value = true;
    try {
        const { data } = await api.get('/revenueitem', {
            params: { 
                Page: page.value, 
                Limit: limit.value,
                Filter: filter.value
            }
        });
        items.value = data.Data
        meta.value = data.Meta
    } catch (error) {
        console.error("Error fetching all items:", error);
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

const FirstPage = () => {
    if (page.value > 1) {
        page.value = 1
        LoadAll()
    }
}

const LastPage = () => {
    if (page.value < meta.value.TotalPages) {
        page.value = meta.value.TotalPages
        LoadAll()
    }
}

const ResetForm = () => {
    name.value = '';
    typeId.value = '';
    cost.value = '';
    isManual.value = false;
    isOnline.value = false;
    settings.value = [
        { serviceId: '', percentage: '' }
    ]
    formErrors.name = { type: null, msg: '' }
    formErrors.typeId = { type: null, msg: '' }
    formErrors.cost = { type: null, msg: '' }
    formErrors.settings.serviceId.type = []
    formErrors.settings.serviceId.msg = ''
    formErrors.settings.percentage.type = []
    formErrors.settings.percentage.msg = ''
}

const applyBackendErrors = (backendErrors) => {
    const errorsArray = Array.isArray(backendErrors)
        ? backendErrors
        : backendErrors?.errors || []
    Object.keys(formErrors).forEach(key => {
        formErrors[key].type = null
        formErrors[key].messages = []
    })
    errorsArray.forEach(err => {
        if (formErrors[err.path] !== undefined) {
            formErrors[err.path].type = true
            formErrors[err.path].messages.push(err.msg)
        }
    })
}

const Create = async () => {
    if (!formValidations()) return;
    innerLoading.value = true;
    try {
        const response = await api.post(`/revenueitem`, {
            name: name.value,
            typeId: typeId.value,
            isManual: isManual.value,
            cost: cost.value,
            isOnline: isOnline.value,
            services: settings.value,
        });
        Toast.fire({
            icon: "success",
            html: `
                <div class="text-h6 text-bold text-uppercase">granted!</div>
                <div class="text-caption; text-capitalize;">${response.data.Message}<div>
            `
        });
        LoadAll();
        modal.value = false;
    } catch (e) {
        if (e.response && e.response.data) {
            applyBackendErrors(e.response.data);
            Toast.fire({
                icon: "error",
                html: `
                    <div class="text-h6 text-bold text-uppercase">Request Failed</div>
                    <div class="text-caption">Something went wrong.</div>
                `
            })
        }
    } finally {
        ResetForm();
        innerLoading.value = false;
    }
}

const Modify = async (data) => {
    id.value = data.id;
    name.value = data.name;
    typeId.value = Number(data.typeId);
    isManual.value = (data.isManual ? true : false);
    cost.value = data.cost;
    isOnline.value = (data.isOnline ? true : false);
}

const Update = async () => {
    if (!formValidations()) return;
    innerLoading.value = true;
    try {
        const response = await api.post(`/revenueitem/${id.value}/update`, {
            name: name.value,
            serviceId: serviceId.value,
            receiptId: receiptId.value,
            isManual: isManual.value,
            cost: cost.value,
            isOnline: isOnline.value
        });
        Toast.fire({
            icon: "success",
            html: `
                <div class="text-h6 text-bold text-uppercase">granted!</div>
                <div class="text-caption; text-capitalize;">${response.data.Message}<div>
            `
        });
        UpdateList(response.data.Data);
    } catch (e) {
        
    } finally {
        LoadAll();
        ResetForm();
        modal.value = false;
        innerLoading.value = false;
    }
}

const UpdateList = async (data) => {
    const index = items.value.findIndex(item => item.id === data.id)
    if (index !== -1) {
        items.value[index] = data
    }
}

const Disable = async (data) => {
    btnLoading.value = true;
    try {
        const response = await api.post(`/revenueitem/${data.id}/disable`);
        Toast.fire({
            icon: "success",
            html: `
                <div class="text-h6 text-bold text-uppercase">granted!</div>
                <div class="text-caption; text-capitalize;">${response.data.Message}<div>
            `
        });
    } catch (e) {
        
    } finally {
        LoadAll();
        btnLoading.value = false;
    }
}

const Enable = async (data) => {
    btnLoading.value = true;
    try {
        const response = await api.post(`/revenueitem/${data.id}/enable`);
        Toast.fire({
            icon: "success",
            html: `
                <div class="text-h6 text-bold text-uppercase">granted!</div>
                <div class="text-caption; text-capitalize;">${response.data.Message}<div>
            `
        });
    } catch (e) {
        
    } finally {
        btnLoading.value = false;
        LoadAll();
    }
}

// --- State ---
const paymenttypes = ref([]);
const services = ref([]);

const filteredPaymentTypes = ref([]);
const filteredServices = ref([]);

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
const LoadPaymentTypes = () => LoadOptions('paymenttype', paymenttypes, filteredPaymentTypes);
const LoadServices  = () => LoadOptions('service', services, filteredServices);

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
const filterPaymentTypeFn = createFilterFn(paymenttypes, filteredPaymentTypes);
const filterServiceFn  = createFilterFn(services, filteredServices);

onMounted(() => {
    LoadAll();
    LoadServices();
    LoadPaymentTypes();
})

const Add = async () => {
    settings.value.unshift({
        serviceId: "",
        percentage: ""
    });
}

const Remove = (index) => {
    settings.value.splice(index, 1);
}

const formatPeso = (value) => {
  if (value == null) return '';
  return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
        minimumFractionDigits: 2
  }).format(value);
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