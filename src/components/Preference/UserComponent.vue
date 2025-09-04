<template>
    <div>
        <q-card class="no-shadow">
            <q-card-section>
                <div class="row items-center no-wrap justify-between">
                    <div class="row items-center">
                        <q-btn flat round dense icon="arrow_back" size="sm" class="text-dark" @click="PreferenceStore.component = 'PreferenceComponent'"/>
                        <span class="text-h5 text-dark text-uppercase q-ml-sm">user management</span>
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
                        <div class="q-mb-sm">
                            <q-avatar>
                                <img :src="v.avatar" />
                            </q-avatar>
                        </div>
                        <div class="text-body1 text-uppercase">{{ v.firstname }}&nbsp;{{ v.lastname }}</div>
                    </q-card-section>
                    <q-card-section class="text-center">
                        <div class="text-caption text-uppercase">{{ v.Role.name }}</div>
                        <div class="text-caption text-grey">
                            {{ v.username }}
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
                    <div class="text-h5 text-uppercase">{{ isEdit ? 'modify user' : 'create new user' }}</div>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>
                <q-separator inset/>
                <q-card-section class="col q-pa-lg">
                    <q-input 
                        v-model="firstname"
                        outlined 
                        label="Firstname" 
                        :error="formErrors.firstname.type"
                        class="q-mb-sm"
                    >
                    </q-input>
                    <q-input 
                        v-model="lastname"
                        outlined 
                        label="Lastname" 
                        :error="formErrors.lastname.type"
                        class="q-mb-sm"
                    >
                    </q-input>
                    <q-input 
                        v-model="username"
                        outlined 
                        label="Username" 
                        :error="formErrors.username.type"
                        class="q-mb-sm"
                    >
                    </q-input>
                    <q-input 
                        v-model="password"
                        outlined 
                        label="Password" 
                        :error="formErrors.password.type"
                        :type="showPassword ? 'text' : 'password'"
                        class="q-mb-sm"
                    >
                        <template v-slot:append>
                            <q-icon :name="showPassword ? 'visibility' : 'visibility_off'" class="cursor-pointer" @click="showPassword = !showPassword" style="font-size: 1rem;" />
                        </template>
                    </q-input>
                    <q-select 
                        v-model="roleId" 
                        emit-value 
                        map-options 
                        :options="filteredRoles" 
                        label="Choose Role" 
                        outlined
                        use-input 
                        fill-input 
                        input-debounce="300" 
                        @filter="filterRoleFn" 
                        :error="formErrors.roleId.type"
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
                        fill-input 
                        input-debounce="300" 
                        @filter="filterOfficeFn" 
                        :error="formErrors.officeId.type"
                        class="q-mb-sm"
                    />
                    <q-file
                        v-model="avatar"
                        label="Upload Avatar"
                        accept="image/png, image/jpeg"
                        outlined
                        :error="formErrors.avatar.type"
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

const PreferenceStore = usePreferenceStore();

const id = ref('');
const firstname = ref('');
const lastname = ref('');
const username = ref('');
const password = ref('');
const roleId = ref('');
const officeId = ref('');
const avatar = ref('');

const innerLoading = ref(false);
const btnLoading = ref(false);
const showPassword = ref(false);

const errors = ref([]);

const formErrors = reactive({
    firstname: { 
        type: null 
    },
    lastname: { 
        type: null 
    },
    username: {
        type: null
    },
    password: {
        type: null
    },
    roleId: {
        type: null
    },
    officeId: {
        type: null
    },
    avatar: {
        type: null
    }
});

const formValidations = () => {

    errors.value = [];

    let isError = false;

    if (!firstname.value) {
        formErrors.firstname.type = true;
        errors.value.push({
            type: 'field',
            value: firstname.value,
            msg: 'Firstname is required',
            path: 'firstname',
            location: 'body'
        });
        isError = true
    } else {  
        formErrors.firstname.type = null
    }

    if (!lastname.value) {
        formErrors.lastname.type = true;
        errors.value.push({
            type: 'field',
            value: lastname.value,
            msg: 'Lastname is required',
            path: 'lastname',
            location: 'body'
        });
        isError = true
    } else {
        formErrors.lastname.type = null
    }

    if (!username.value) {
        formErrors.username.type = true;
        errors.value.push({
            type: 'field',
            value: username.value,
            msg: 'Username is required',
            path: 'username',
            location: 'body'
        });
        isError = true
    } else {
        formErrors.username.type = null
    }

    if (!password.value) {
        formErrors.password.type = true;
        errors.value.push({
            type: 'field',
            value: password.value,
            msg: 'Password is required',
            path: 'password',
            location: 'body'
        });
        isError = true
    } else if (password.value.length < 4) {
        formErrors.password.type = true;
        errors.value.push({
            type: 'field',
            value: password.value,
            msg: 'Password must be at least 4 characters',
            path: 'password',
            location: 'body'
        });
        isError = true;
    } else {
        formErrors.password.type = null
    }

    if (!roleId.value) {
        formErrors.roleId.type = true;
        errors.value.push({
            type: 'field',
            value: roleId.value,
            msg: 'Role is required',
            path: 'roleId',
            location: 'body'
        });
        isError = true
    } else {
        formErrors.roleId.type = null
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

    if (!avatar.value) {
        formErrors.avatar.type = true;
        errors.value.push({
            type: 'field',
            value: avatar.value,
            msg: 'Avatar is required',
            path: 'avatar',
            location: 'body'
        });
        isError = true;
    } else {
        const file = avatar.value;
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        const maxSize = 2 * 1024 * 1024; // 2MB

        if (!allowedTypes.includes(file.type)) {
            formErrors.avatar.type = true;
            errors.value.push({
                type: 'field',
                value: file.type,
                msg: 'Only JPG and PNG images are allowed',
                path: 'avatar',
                location: 'body'
            });
            isError = true;
        } else if (file.size > maxSize) {
            formErrors.avatar.type = true;
            errors.value.push({
                type: 'field',
                value: file.size,
                msg: 'File size must not exceed 2MB',
                path: 'avatar',
                location: 'body'
            });
            isError = true;
        } else {
            formErrors.avatar.type = null;
        }
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

const LoadAllUsers = async () => {
    loading.value = true;
    try {
        const { data } = await api.get('/user', {
            params: { 
                Page: page.value, 
                Limit: limit.value 
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
        LoadAllUsers()
    }
}

const PreviousPage = () => {
    if (page.value > 1) {
        page.value--
        LoadAllUsers()
    }
}

const filteredData = computed(() => {

    let data = users.value

    if (filter.value) {
        data = data.filter(v =>
            v.name.toLowerCase().includes(filter.value.toLowerCase()) ||
            v.code.toLowerCase().includes(filter.value.toLowerCase())
        )
    }

    return data.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
})

const LimitCharacter = (str) => {
    if (str.length <= 6) return str; // too short to mask

    const first = str.slice(0, 3);
    const last = str.slice(-3);
    const masked = "*".repeat(str.length - 6);

    return first + masked + last;
}

const ResetForm = () => {
    errors.value = [];
    firstname.value = '';
    lastname.value = '';
    username.value = '';
    password.value = '';
    roleId.value = '';
    officeId.value = '';
    avatar.value = '';
    formErrors.firstname.type = null;
    formErrors.lastname.type = null;
    formErrors.username.type = null;
    formErrors.password.type = null;
    formErrors.roleId.type = null;
    formErrors.officeId.type = null;
    formErrors.avatar.type = null;
}

const Create = async () => {
    if (!formValidations()) return;
    innerLoading.value = true;
    try {
        const response = await api.post(`/user`, {
            firstname: firstname.value,
            lastname: lastname.value,
            username: username.value,
            password: password.value,
            roleId: roleId.value,
            officeId: officeId.value,
            avatar: avatar.value
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
        users.value.push(response.data.Data);
    } catch (e) {
        errors.value = [];
        errors.value = e.response.data.errors;
    } finally {
        innerLoading.value = false;
    }
}

const Modify = async (data) => {
    id.value = data.id;
    firstname.value = data.firstname;
    lastname.value = data.lastname;
    username.value = data.username;
    roleId.value = data.roleId;
    officeId.value = data.officeId;
    avatar.value = data.avatar;
}

const Update = async () => {
    if (!formValidations()) return;
    innerLoading.value = true;
    try {
        const response = await api.post(`/user/${id.value}/update`, {
            firstname: firstname.value,
            lastname: lastname.value,
            username: username.value,
            password: password.value,
            roleId: roleId.value,
            officeId: officeId.value,
            avatar: avatar.value
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
        errors.value = [];
        errors.value = e.response.data.errors;
    } finally {
        innerLoading.value = false;
    }
}

const UpdateList = async (data) => {
    const index = users.value.findIndex(item => item.id === data.id)
    if (index !== -1) {
        users.value[index] = data
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
        UpdateList(response.data.Data);
    } catch (e) {
        errors.value = [];
        errors.value = e.response.data.errors;
    } finally {
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
        UpdateList(response.data.Data);
    } catch (e) {
        errors.value = [];
        errors.value = e.response.data.errors;
    } finally {
        btnLoading.value = false;
    }
}

const roles = ref([]);
const offices = ref([]);
const filteredRoles = ref(roles.value);
const filteredOffices = ref(offices.value);

const LoadRoles = async () => {
    try {
        const response = await api.get('/option/role');
        roles.value = response.data;
    } catch (error) {
        console.error("Error fetching roles:", error);
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

const filterRoleFn = (val, update) => {
    if (val === '') {
        update(() => {
            filteredRoles.value = roles.value
        })
        return
    }
    update(() => {
        const needle = val.toLowerCase()
        filteredRoles.value = roles.value.filter(v =>
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

onMounted(() => {
    LoadAllUsers();
    LoadRoles();
    LoadOffices();
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