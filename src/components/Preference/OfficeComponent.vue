<template>
    <div>
        <q-card class="no-shadow">
            <q-card-section>
                <div class="row items-center no-wrap justify-between">
                    <div class="row items-center">
                        <q-btn flat round dense icon="arrow_back" size="sm" class="text-dark" @click="PreferenceStore.component = 'PreferenceComponent'"/>
                        <span class="text-h5 text-dark text-uppercase q-ml-sm">office management</span>
                    </div>
                    <div class="col-auto">
                        <q-input outlined dense debounce="300" v-model="filter" placeholder="Search...">
                            <template v-slot:before>
                                <q-btn :disable="page <= 1" @click="PreviousPage" unelevated size="xs" round color="primary" icon="arrow_back"/>
                                <q-btn unelevated outline size="sm" round color="primary" :label="meta.CurrentPage"/>
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
                        <div class="text-body1 text-uppercase text-bold">{{ v.alias }}</div>
                        <div class="text-caption text-capitalize">{{ v.name }}</div>
                    </q-card-section>
                    <q-card-section class="text-center">
                        <div class="text-caption text-grey">
                            {{ v.email }}
                        </div>
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
        <q-dialog square persistent v-model="modal" position="right" full-height class="dialog-action">
            <q-card class="card-action column full-height">
                <q-card-section class="row items-center q-pa-lg">
                    <div class="text-h5 text-uppercase">{{ isEdit ? 'modify office' : 'create new office' }}</div>
                <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>
                <q-separator inset/>
                <q-card-section class="col">
                    <q-input 
                        v-model="name"
                        outlined 
                        label="Office Name" 
                        :error="formErrors.name.type"
                        class="q-mb-xs"
                    >
                    </q-input>
                    <q-input 
                        v-model="alias"
                        outlined 
                        label="Office Alias" 
                        :error="formErrors.alias.type"
                        class="q-mb-xs"
                    >
                    </q-input>
                    <q-input 
                        v-model="email"
                        outlined 
                        label="Office Email" 
                        :error="formErrors.email.type"
                        class="q-mb-xs"
                    >
                    </q-input>
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

const PreferenceStore = usePreferenceStore();

const id = ref('');
const name = ref('');
const alias = ref('');
const email = ref('');

const innerLoading = ref(false);
const btnLoading = ref(false);

const errors = ref([]);

const formErrors = reactive({
    name: { 
        type: null 
    },
    alias: { 
        type: null 
    },
    email: {
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
            msg: 'This field is required',
            path: 'name',
            location: 'body'
        });

        isError = true

    } else {
        
        formErrors.name.type = null

    }

    if (!alias.value) {

        formErrors.alias.type = true;

        errors.value.push({
            type: 'field',
            value: alias.value,
            msg: 'This field is required',
            path: 'alias',
            location: 'body'
        });

        isError = true

    } else {
        
        formErrors.alias.type = null
        
    }

    if (!email.value) {

        formErrors.alias.type = true;

        errors.value.push({
            type: 'field',
            value: email.value,
            msg: 'This field is required',
            path: 'email',
            location: 'body'
        });

        isError = true

    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {

        formErrors.email.type = true;

        errors.value.push({
            type: 'field',
            value: email.value,
            msg: 'Please enter a valid email address',
            path: 'email',
            location: 'body'
        });

        isError = true;

    } else {
        
        formErrors.email.type = null
        
    }

    return !isError

}

const modal = ref(false);
const isEdit = ref(false);

const filter = ref('');

const loading = ref(false);

const offices = ref([]);
const meta = ref({});
const page = ref(1);
const limit = ref(10);

const LoadAllOffices = async () => {
    loading.value = true;
    try {
        const { data } = await api.get('/office', {
            params: { 
                Page: page.value, 
                Limit: limit.value 
            }
        });
        offices.value = data.Data
        meta.value = data.Meta
    } catch (error) {
        console.error("Error fetching all offices:", error);
    } finally {
        loading.value = false
    }
}

const NextPage = () => {
     if (page.value < meta.value.TotalPages) {
        page.value++
        LoadAllOffices()
    }
}

const PreviousPage = () => {
    if (page.value > 1) {
        page.value--
        LoadAllOffices()
    }
}

const filteredData = computed(() => {

    let data = offices.value.slice()

    // always sort by createdAt (latest first)
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    if (filter.value) {
        data = data.filter(v =>
            v.name.toLowerCase().includes(filter.value.toLowerCase()) ||
            v.alias.toLowerCase().includes(filter.value.toLowerCase())
        ).slice(0, 5)
    }

    return data;

})


const ResetForm = () => {
    errors.value = [];
    name.value = '';
    alias.value = '';
    email.value = '';
    formErrors.name.type = null;
    formErrors.alias.type = null;
    formErrors.email.type = null;
}

const Create = async () => {
    if (!formValidations()) return;
    innerLoading.value = true;
    try {
        const response = await api.post(`/office`, {
            name: name.value,
            alias: alias.value,
            email: email.value
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
        offices.value.push(response.data.Data);
    } catch (e) {
        errors.value = e.response.data.errors || [];
    } finally {
        innerLoading.value = false;
    }
}

const Modify = async (data) => {
    id.value = data.id;
    name.value = data.name;
    alias.value = data.alias;
    email.value = data.email;
}

const Update = async () => {
    if (!formValidations()) return;
    innerLoading.value = true;
    try {
        const response = await api.post(`/office/${id.value}/update`, {
            name: name.value,
            alias: alias.value,
            email: email.value
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
    const index = offices.value.findIndex(item => item.id === data.id)
    if (index !== -1) {
        offices.value[index] = data
    }
}

const Disable = async (data) => {
    btnLoading.value = true;
    try {
        const response = await api.post(`/office/${data.id}/disable`);
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
        const response = await api.post(`/office/${data.id}/enable`);
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

onMounted(() => {
    LoadAllOffices();
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