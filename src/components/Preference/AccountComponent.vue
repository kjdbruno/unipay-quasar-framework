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
                    v-if="!loading && !accounts.length"
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
                    v-if="!loading && accounts.length"
                    v-for="(v, index) in accounts"
                    :key="`data-${v.id}`"
                    class="card-anim-wrapper"
                    :style="{ animationDelay: `${index * 120}ms` }"
                >
                    <q-card
                        class="card card-hover-animate flex flex-center q-pa-md radius-sm"
                        >
                        <q-card-section class="text-center full-width">
                            <div class="text-body1 text-uppercase">{{ v.code }}</div>
                            <div class="text-caption text-capitalize">{{ v.title }}</div>
                        </q-card-section>
                        <q-card-section class="text-center full-width">
                            <div class="text-caption text-grey">
                                {{ v.balance }}
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
                    <div class="text-h5 text-uppercase">{{ isEdit ? 'modify account' : 'create new account' }}</div>
                </q-card-section>
                <q-separator inset/>
                <q-card-section class="col scroll">
                    <div class="row q-col-gutter-xs q-mb-md">
                        <div class="col-2">
                            <div class="text-caption text-uppercase" :class="formErrors.code.type ? 'text-negative' : 'text-grey'">{{ formErrors.code.type ? formErrors.code.msg : 'account code' }}</div>
                            <q-input 
                                v-model="code"
                                label="Enter Account Code"
                                outlined
                                :error="formErrors.code.type"
                                no-error-icon
                            />
                        </div>
                        <div class="col-3">
                            <div class="text-caption text-uppercase" :class="formErrors.title.type ? 'text-negative' : 'text-grey'">{{ formErrors.title.type ? formErrors.title.msg : 'account title' }}</div>
                            <q-input 
                                v-model="title"
                                label="Enter Account Title"
                                outlined 
                                :error="formErrors.title.type"
                                no-error-icon
                                class="text-capitalize"
                            />
                        </div>
                    </div>
                    <div class="row q-col-gutter-xs q-mb-md">
                        <div class="col-5">
                            <div class="text-caption text-uppercase" :class="formErrors.description.type ? 'text-negative' : 'text-grey'">{{ formErrors.description.type ? formErrors.description.msg : 'account description' }}</div>
                            <q-input 
                                v-model="description"
                                label="Enter Account Description"
                                outlined 
                                :error="formErrors.description.type"
                                no-error-icon
                                type="textarea"
                            />
                        </div>
                    </div>
                    <div class="">
                        <div class="text-caption text-uppercase" :class="formErrors.balance.type ? 'text-negative' : 'text-grey'">{{ formErrors.balance.type ? formErrors.balance.msg : 'account balance' }}</div>
                        <q-radio v-model="balance" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="Credit" label="Credit" />
                        <q-radio v-model="balance" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="Debit" label="Debit" />
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

const PreferenceStore = usePreferenceStore();

const id = ref('');
const code = ref('');
const title = ref('');
const description = ref('');
const balance = ref('');

const innerLoading = ref(false);
const btnLoading = ref(false);

const errors = ref([]);

const formErrors = reactive({
    code: { 
        type: null, msg: '' 
    },
    title: { 
        type: null, msg: '' 
    },
    description: {
        type: null, msg: ''
    },
    balance: {
        type: null, msg: ''
    }
});

const formValidations = () => {

    errors.value = [];

    let isError = false;

    if (!code.value) {
        formErrors.code.type = true;
        formErrors.code.msg = 'account code is required'
        isError = true
    } else {
        formErrors.code.type = null;
        formErrors.code.msg = '';
    }

    if (!title.value) {
        formErrors.title.type = true;
        formErrors.title.msg = 'account title is required';
        isError = true
    } else {
        formErrors.title.type = null
        formErrors.title.msg = '';
    }

    if (!description.value) {
        formErrors.description.type = true;
        formErrors.description.msg = 'account description is required';
        isError = true
    } else {
        formErrors.description.type = null
        formErrors.description.msg = '';
    }

    if (!balance.value) {
        formErrors.balance.type = true;
        formErrors.balance.msg = 'account balance is required';
        isError = true
    } else {
        formErrors.balance.type = null
        formErrors.balance.msg = '';
    }

    return !isError

}

const modal = ref(false);
const isEdit = ref(false);

const filter = ref('');

const loading = ref(false);

const accounts = ref([]);
const meta = ref({});
const page = ref(1);
const limit = ref(10);

const LoadAll = async () => {
    loading.value = true;
    try {
        const { data } = await api.get('/account', {
            params: { 
                Page: page.value, 
                Limit: limit.value,
                Filter: filter.value
            }
        });
        accounts.value = data.Data
        meta.value = data.Meta
    } catch (error) {
        console.error("Error fetching all accounts:", error);
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

    let data = accounts.value.slice()

    // always sort by createdAt (latest first)
    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    if (filter.value) {
        data = data.filter(v =>
            v.title.toLowerCase().includes(filter.value.toLowerCase()) ||
            v.code.toLowerCase().includes(filter.value.toLowerCase())
        ).slice(0, 5)
    }

    return data;

})


const ResetForm = () => {
    errors.value = [];
    code.value = '';
    title.value = '';
    description.value = '';
    balance.value = '';
    formErrors.code.type = null;
    formErrors.title.type = null;
    formErrors.description.type = null;
    formErrors.balance.type = null;
}

const Create = async () => {
    if (!formValidations()) return;
    innerLoading.value = true;
    try {
        const response = await api.post(`/account`, {
            code: code.value,
            title: title.value,
            description: description.value,
            balance: balance.value
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
        accounts.value.push(response.data.Data);
    } catch (e) {
        errors.value = e.response.data.errors || [];
    } finally {
        innerLoading.value = false;
    }
}

const Modify = async (data) => {
    id.value = data.id;
    code.value = data.code;
    title.value = data.title;
    description.value = data.description;
    balance.value = data.balance;
}

const Update = async () => {
    if (!formValidations()) return;
    innerLoading.value = true;
    try {
        const response = await api.post(`/account/${id.value}/update`, {
            code: code.value,
            title: title.value,
            description: description.value,
            balance: balance.value
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
    const index = accounts.value.findIndex(item => item.id === data.id)
    if (index !== -1) {
        accounts.value[index] = data
    }
}

const Disable = async (data) => {
    btnLoading.value = true;
    try {
        const response = await api.post(`/account/${data.id}/disable`);
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
        const response = await api.post(`/account/${data.id}/enable`);
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
    LoadAll();
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