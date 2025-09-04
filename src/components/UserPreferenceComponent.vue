<template>
    <div>user</div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue';
import { api } from 'src/boot/axios';
import moment from 'moment';
import { usePreferenceStore } from '../stores/preference-store';
import { Toast } from 'src/boot/sweetalert'; 

const PreferenceStore = usePreferenceStore();

const rows = ref([]);
const columns = ref([
    { name: 'status', label: '', align: 'left' },
    { name: 'name', label: 'Name', align: 'left', field: row => row.name, sortable: true },
    { name: 'office', label: 'Office', align: 'left', field: row => row.office, sortable: true },
    { name: 'role', label: 'Role', align: 'left', field: row => row.role, sortable: true },
    { name: 'created_at', label: 'Created At', align: 'left', field: row => moment(row.createdAt).format('MMM DD, YYYY hh:mm A') },
    { name: 'actions', label: '', align: 'right', field: 'actions', sortable: false, style: 'width: 150px;' }
]);

const id = ref(null);
const form = reactive({
    name: '',
    username: '',
    password: '',
    officeId: '',
    roleId: '',
    email: '',
    phone: '',
    avatar: '',
});

const errors = reactive({
    name: '',
    username: '',
    password: '',
    officeId: '',
    roleId: '',
    email: '',
    phone: '',
    avatar: '',
});

// Validation the form inputs
const validate = () => {
    errors.name.type = !form.name;
    errors.username.type = !form.username;
    errors.password.type = !form.password;
    errors.officeId.type = !form.officeId;
    errors.roleId.type = !form.roleId;
    errors.email.type = !form.email;
    errors.email.type = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);
    errors.phone.type = !form.phone;
    errors.phone.type = !/^\+?[1-9]\d{1,14}$/.test(form.phone);
    errors.avatar.type = !form.avatar;

    errors.name.message = errors.name.type ? 'Name is required.' : '';
    errors.username.message = errors.username.type ? 'Username is required.' : '';
    errors.password.message = errors.password.type ? 'Password is required.' : '';
    errors.officeId.message = errors.officeId.type ? 'Office is required.' : '';
    errors.roleId.message = errors.roleId.type ? 'Role is required.' : '';
    errors.email.message = errors.email.type ? 'Email is required.' : '';
    errors.phone.message = errors.phone.type ? 'Phone is required.' : '';
    errors.avatar.message = errors.avatar.type ? 'Avatar is required.' : '';

    return !errors.name.type &&
           !errors.username.type &&
           !errors.password.type &&
           !errors.officeId.type &&
           !errors.roleId.type &&
           !errors.email.type &&
           !errors.phone.type &&
           !errors.avatar.type;
}

// Fetch the list of users
const fetchUsers = async () => {
    PreferenceStore.isLoadingTable = true;
    try {
        const response = await api.get('/preference/user');
        rows.value = response.data;
        PreferenceStore.isLoadingTable = false;
    } catch (error) {
        console.error('Error fetching data:', error);
        PreferenceStore.isLoadingTable = false;
        Toast.fire({
            icon: "error",
            html: `
                <div class="text-h6 text-bold text-uppercase">error!</div>
                <div class="text-caption;">${error.response.data.message || 'An error occurred while fetching user preferences.'}<div>
            `
        });
    }
};

// Fetch users on component mount
onMounted(() => {
    fetchUsers();
});

// Open the dialog for creating or editing a user
const openDialog = (user = null) => {
    if (PreferenceStore.isEdit && user) {
        id.value = user.id;
        form.name = user.name;
        form.username = user.username;
        form.password = ''; // Do not pre-fill password
        form.officeId = user.officeId;
        form.roleId = user.roleId;
        form.email = user.email;
        form.phone = user.phone;
        form.avatar = user.avatar;
    } else {
        id.value = null;
        form.name = '';
        form.username = '';
        form.password = '';
        form.officeId = '';
        form.roleId = '';
        form.email = '';
        form.phone = '';
        form.avatar = '';
    }
    errors.name.type = false;
    errors.username.type = false;
    errors.password.type = false;
    errors.officeId.type = false;
    errors.roleId.type = false;
    errors.email.type = false;
    errors.phone.type = false;
    errors.avatar.type = false;
};

//Save  the form data
const save = async () => {
    if (!validate()) return;
    PreferenceStore.isLoading = true;
    try {
        const response = id.value
            ? await api.post(`/preference/user/${id.value}/update`, form)
            : await api.post('/preference/user', form);
        PreferenceStore.dialog = false;
        PreferenceStore.isLoading = false;
        if (id.value) {
            updateRows(id.value, response.data.user);
        } else {
            rows.value.push(response.data.user);
        }
        Toast.fire({
            icon: "success",
            html: `
                <div class="text-h6 text-bold text-uppercase">success!</div>
                <div class="text-caption;">${response.data.message || 'User preferences saved successfully.'}<div>
            `
        });
    } catch (error) {
        console.error('Error saving data:', error);
        PreferenceStore.isLoading = false;
        Toast.fire({
            icon: "error",
            html: `
                <div class="text-h6 text-bold text-uppercase">error!</div>
                <div class="text-caption;">${error.response.data.message || 'An error occurred while saving user preferences.'}<div>
            `
        });
    }
};

// Disable the user
const disableUser = async (user) => {
    PreferenceStore.isLoading = true;
    try {
        const response = await api.post(`/preference/user/${user.id}/disable`);
        PreferenceStore.isLoading = false;
        updateRows(user.id, response.data.user);
        Toast.fire({
            icon: "success",
            html: `
                <div class="text-h6 text-bold text-uppercase">success!</div>
                <div class="text-caption;">${response.data.message || 'User disabled successfully.'}<div>
            `
        });
    } catch (error) {
        console.error('Error disabling user:', error);
        PreferenceStore.isLoading = false;
        Toast.fire({
            icon: "error",
            html: `
                <div class="text-h6 text-bold text-uppercase">error!</div>
                <div class="text-caption;">${error.response.data.message || 'An error occurred while disabling the user.'}<div>
            `
        });
    }
};

// Enable the user
const enableUser = async (user) => {
    PreferenceStore.isLoading = true;
    try {
        const response = await api.post(`/preference/user/${user.id}/enable`);
        PreferenceStore.isLoading = false;
        updateRows(user.id, response.data.user);
        Toast.fire({
            icon: "success",
            html: `
                <div class="text-h6 text-bold text-uppercase">success!</div>
                <div class="text-caption;">${response.data.message || 'User enabled successfully.'}<div>
            `
        });
    } catch (error) {
        console.error('Error enabling user:', error);
        PreferenceStore.isLoading = false;
        Toast.fire({
            icon: "error",
            html: `
                <div class="text-h6 text-bold text-uppercase">error!</div>
                <div class="text-caption;">${error.response.data.message || 'An error occurred while enabling the user.'}<div>
            `
        });
    }
};

// Update row when save or delete
const updateRows = (data) => {
    const index = rows.value.findIndex(office => office.id === id);
    if (index !== -1) {
        Object.assign(rows.value[index], data)
    }
};
</script>