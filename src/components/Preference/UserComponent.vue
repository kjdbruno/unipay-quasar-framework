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
                    v-if="!loading && !users.length"
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
                    v-if="!loading && users.length"
                    v-for="(v, index) in users"
                    :key="`data-${v.id}`"
                    class="card-anim-wrapper"
                    :style="{ animationDelay: `${index * 120}ms` }"
                >
                    <q-card
                        class="card card-hover-animate flex flex-center q-pa-md radius-sm"
                        >
                        <q-card-section class="text-center full-width">
                            <div class="text-body1 text-uppercase">{{ formatName(v) }}</div>
                            <div class="text-caption text-capitalize text-grey">{{ formatOffice(v) }}</div>
                        </q-card-section>
                        <q-card-section class="text-center full-width">
                            <div class="text-caption text-grey">{{ formatRole(v) }}</div>
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
                    <div class="text-h5 text-uppercase">{{ isEdit ? 'modify user' : 'create new user' }}</div>
                </q-card-section>
                <q-separator inset/>
                <q-card-section class="col scroll">
                    <div class="row q-col-gutter-xs q-mb-md">
                        <div class="col-3">
                            <div class="text-caption text-uppercase" :class="formErrors.firstname.type ? 'text-negative' : 'text-grey'">{{ formErrors.firstname.type ? formErrors.firstname.msg : 'first name' }}</div>
                            <q-input 
                                v-model="firstname"
                                label="Enter First Name"
                                outlined
                                :error="formErrors.firstname.type"
                                no-error-icon
                                class="text-capitalize"
                            />
                        </div>
                        <div class="col-3">
                            <div class="text-caption text-uppercase" :class="formErrors.lastname.type ? 'text-negative' : 'text-grey'">{{ formErrors.lastname.type ? formErrors.lastname.msg : 'last name' }}</div>
                            <q-input 
                                v-model="lastname"
                                label="Enter Last Name"
                                outlined
                                :error="formErrors.lastname.type"
                                no-error-icon
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
                                :hide-dropdown-icon="true"
                                no-error-icon
                                class="text-capitalize"
                            />
                        </div>
                    </div>
                    <div class="q-mb-md">
                        <div class="text-caption text-uppercase" :class="formErrors.role.type ? 'text-negative' : 'text-grey'">{{ formErrors.role.type ? formErrors.role.msg : 'role' }}</div>
                        <div class="q-gutter-sm">
                            <q-radio v-for="(r, index) in roles" v-model="role" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" :val="r.value" :label="r.label" />
                        </div>
                    </div>
                    <div class="row q-col-gutter-xs q-mb-md">
                        <div class="col-3">
                            <div class="text-caption text-uppercase" :class="formErrors.username.type ? 'text-negative' : 'text-grey'">{{ formErrors.username.type ? formErrors.username.msg : 'username' }}</div>
                            <q-input 
                                v-model="username"
                                label="Enter Username"
                                outlined
                                :error="formErrors.username.type"
                                no-error-icon
                            />
                        </div>
                        <div class="col-3">
                            <div class="text-caption text-uppercase" :class="formErrors.password.type ? 'text-negative' : 'text-grey'">{{ formErrors.password.type ? formErrors.password.msg : 'password' }}</div>
                            <q-input 
                                v-model="password"
                                label="Enter Password"
                                :type="showPassword ? 'text' : 'password'"
                                outlined
                                :error="formErrors.password.type"
                                no-error-icon
                            >
                                <template v-slot:append>
                                    <q-icon 
                                        :name="showPassword ? 'visibility_off' : 'visibility'" 
                                        class="cursor-pointer" 
                                        @click="showPassword = !showPassword" 
                                    />
                                </template>
                            </q-input>
                        </div>
                    </div>
                    <div class="row q-col-gutter-xs q-mb-md">
                        <div class="col-3">
                            <div class="text-caption text-uppercase" :class="formErrors.file.type ? 'text-negative' : 'text-grey'">{{ formErrors.file.type ? formErrors.file.msg : 'photo' }}</div>
                            <q-file 
                                v-model="file"
                                label="Upload Photo"
                                outlined
                                :error="formErrors.file.type"
                                no-error-icon
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
const firstname = ref('');
const lastname = ref('');
const officeId = ref('');
const username = ref('');
const password = ref('');
const role = ref('');
const file = ref(null);

const showPassword = ref(false);

const innerLoading = ref(false);
const btnLoading = ref(false);

const formErrors = reactive({
    firstname: { 
        type: null, msg: '' 
    },
    lastname: {
        type: null, msg: ''
    },
    officeId: {
        type: null, msg: ''
    },
    username: {
        type: null, msg: ''
    },
    password: {
        type: null, msg: ''
    },
    role: {
        type: null, msg: ''
    },
    file: {
        type: null, msg: ''
    }
});

const formValidations = () => {

    let isError = false;

    if (!firstname.value) {
        formErrors.firstname.type = true;
        formErrors.firstname.msg = 'first name is required';
        isError = true;
    } else {
        formErrors.firstname.type = null;
        formErrors.firstname.msg = '';
    }

    if (!lastname.value) {
        formErrors.lastname.type = true;
        formErrors.lastname.msg = 'last name is required';
        isError = true;
    } else {
        formErrors.lastname.type = null;
        formErrors.lastname.msg = '';
    }

    if (!officeId.value) {
        formErrors.officeId.type = true;
        formErrors.officeId.msg = 'office is required';
        isError = true;
    } else {
        formErrors.officeId.type = null;
        formErrors.officeId.msg = '';
    }

    if (!username.value) {
        formErrors.username.type = true;
        formErrors.username.msg = 'username is required';
        isError = true;
    } else {
        formErrors.username.type = null;
        formErrors.username.msg = '';
    }

    if (isEdit.value === false) {
        if (!password.value) {
            formErrors.password.type = true;
            formErrors.password.msg = 'password is required';
            isError = true;
        } else {
            formErrors.password.type = null;
            formErrors.password.msg = '';
        }
    }

    if (!role.value) {
        formErrors.role.type = true;
        formErrors.role.msg = 'role is required';
        isError = true;
    } else {
        formErrors.role.type = null;
        formErrors.role.msg = '';
    }

    if (!file.value) {
        formErrors.file.type = true;
        formErrors.file.msg = 'profile photo is required';
        isError = true;
    } else {
        formErrors.file.type = null;
        formErrors.file.msg = '';
    }

    return !isError

}

const modal = ref(false);
const isEdit = ref(false);

const filter = ref('');

const loading = ref(false);

const users = ref([]);
const meta = ref({});
const page = ref(1);
const limit = ref(10);

const LoadAll = async () => {
    loading.value = true;
    try {
        const { data } = await api.get('/user', {
            params: { 
                Page: page.value, 
                Limit: limit.value,
                Filter: filter.value
            }
        });
        users.value = data.Data
        meta.value = data.Meta
    } catch (error) {
        console.error("Error fetching all users:", error);
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
    firstname.value = '';
    lastname.value = '';
    officeId.value = '';
    username.value = '';
    password.value = '';
    role.value = '';
    file.value = null;
    formErrors.firstname.type = null;
    formErrors.lastname.type = null;
    formErrors.officeId.type = null;
    formErrors.username.type = null;
    formErrors.password.type = null;
    formErrors.role.type = null;
    formErrors.file.type = null;
}

const Create = async () => {
    if (!formValidations()) return;
    innerLoading.value = true;
    try {
        const form = new FormData();
        form.append("firstname", firstname.value);
        form.append("lastname", lastname.value);
        form.append("officeId", officeId.value);
        form.append("username", username.value);
        form.append("password", password.value);
        form.append("role", role.value);
        form.append("file", file.value);
        const response = await api.post(`/user`, form, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        Toast.fire({
            icon: "success",
            html: `
                <div class="text-h6 text-bold text-uppercase">granted!</div>
                <div class="text-caption; text-capitalize;">${response.data.Message}<div>
            `
        });
        (users.value.length ? (users.value.push(response.data.Data)) : LoadAll());
    } catch (e) {
        errors.value = e.response.data.errors || [];
    } finally {
        LoadAll();
        ResetForm();
        modal.value = false;
        innerLoading.value = false;
    }
}

const Modify = async (data) => {
    id.value = data.id;
    firstname.value = data.firstname;
    lastname.value = data.lastname;
    username.value = data.username;
    officeId.value = Number(data.officeId);
    role.value = data.role;
}

const Update = async () => {
    if (!formValidations()) return;
    innerLoading.value = true;
    try {
        const response = await api.post(`/user/${id.value}/update`, {
            firstname: firstname.value,
            lastname: lastname.value,
            officeId: officeId.value,
            username: username.value,
            password: password.value,
            role: role.value
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
        errors.value = e.response.data.errors || [];
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
        const response = await api.post(`/user/${data.id}/disable`);
        Toast.fire({
            icon: "success",
            html: `
                <div class="text-h6 text-bold text-uppercase">granted!</div>
                <div class="text-caption; text-capitalize;">${response.data.Message}<div>
            `
        });
    } catch (e) {
        errors.value = e.response.data.errors || [];
    } finally {
        LoadAll();
        btnLoading.value = false;
    }
}

const Enable = async (data) => {
    btnLoading.value = true;
    try {
        const response = await api.post(`/user/${data.id}/enable`);
        Toast.fire({
            icon: "success",
            html: `
                <div class="text-h6 text-bold text-uppercase">granted!</div>
                <div class="text-caption; text-capitalize;">${response.data.Message}<div>
            `
        });
    } catch (e) {
        errors.value = e.response.data.errors || [];
    } finally {
        btnLoading.value = false;
        LoadAll();
    }
}

// --- State ---
const roles = ref([
    {
        value: 'admin',
        label: 'Administrator'
    },
    {
        value: 'supervisor',
        label: 'Supervisor'
    },
    {
        value: 'collector',
        label: 'Collection Officer'
    },
    {
        value: 'biller',
        label: 'Billing Officer'
    },
    {
        value: 'auditor',
        label: 'Auditor'
    }
]);
const offices = ref([]);

const filteredOffices = ref([]);

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
const LoadOffices = () => LoadOptions('office', offices, filteredOffices);

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
const filterOfficeFn = createFilterFn(offices, filteredOffices);

onMounted(() => {
    LoadAll();
    LoadOffices();
})

const formatName = (user) => {
    if (!user) return "";
    const first = user.firstname || "";
    const last = user.lastname || "";
    const fullName = `${first} ${last}`.trim();
    return fullName;
};

const formatOffice = (user) => {
    if (!user) return "";
    const alias = user.Office?.alias || "";
    return alias;
};

const roleMap = {
    admin: "Administrator",
    supervisor: "Supervisor",
    collector: "Collection Officer",
    biller: "Billing Officer",
    auditor: "Auditor"
};

const formatRole = (user) => {
    return roleMap[user.role] || "Unknown Role";
};


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