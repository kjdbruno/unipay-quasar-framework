<template>
    <div class="q-page-office">
        <q-card square class="no-shadow">
            <q-card-section class="q-pa-none">
                <q-table
                    :rows="rows"
                    :columns="columns"
                    row-key="id"
                    :filter="PreferenceStore.filter"
                    :loading="PreferenceStore.isLoadingTable"
                    :pagination.sync="PreferenceStore.pagination"
                    :filter-method="PreferenceStore.filterMethod"
                    class="no-shadow"
                    flat
                >
                    <template v-slot:body-cell-status="props">
                        <q-td :props="props">
                            <q-badge :color="props.row.isActive ? 'positive' : 'negative'"rounded class="q-mr-sm"/> {{props.row.isActive ? 'ACTIVE' : 'INACTIVE'}}
                        </q-td>
                    </template>
                    <template v-slot:body-cell-name="props">
                        <q-td :props="props">
                            <div class="text-uppercase text-bold">{{ props.row.name }}</div>
                            <div class="text-uppercase text-caption text-grey">{{ props.row.alias }}</div>
                        </q-td>
                    </template>
                    <template v-slot:body-cell-email="props">
                        <q-td :props="props">
                            <div class="text-caption">{{ props.row.email }}</div>
                        </q-td>
                    </template>
                    <template v-slot:body-cell-actions="props">
                        <q-td :props="props">
                            <div class="q-gutter-xs">
                                <q-btn v-if="props.row.isActive" square unelevated color="grey-5" size="sm" label="edit" @click="() => { PreferenceStore.dialog = true; PreferenceStore.isEdit = true; PreferenceStore.office = props.row; }" />
                                <q-btn v-if="props.row.isActive" square unelevated color="grey-5" size="sm" label="disable" @click="disableOffice(props.row)" :loading="props.row.id == id ? PreferenceStore.isLoading : null" :disable="PreferenceStore.isLoading">
                                    <template v-slot:loading>
                                        <q-spinner-ios/>
                                    </template>
                                </q-btn>
                                <q-btn v-if="!props.row.isActive" square unelevated color="grey-5" size="sm" label="enable" @click="enableOffice(props.row)" :loading="props.row.id == id ? PreferenceStore.isLoading : null" :disable="PreferenceStore.isLoading">
                                    <template v-slot:loading>
                                        <q-spinner-ios/>
                                    </template>
                                </q-btn>
                            </div>
                        </q-td>
                    </template>
                </q-table>
            </q-card-section>
        </q-card>
        <q-dialog v-model="PreferenceStore.dialog" full-height persistent position="right" transition-show="slide-left" transition-hide="slide-right"  backdrop-filter="blur(4px) grayscale(100%)" class="dialog-office" @before-show="openDialog(PreferenceStore.office)">
            <q-card square class="card-dialog column full-height">
                <q-card-section class="row items-center">
                    <div class="text-h5 text-uppercase">{{ PreferenceStore.isEdit ? 'Edit Office' : 'New Office' }}</div>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>
                <q-separator />
                <q-card-section class="scroll" style="flex: 1">
                    <div class="q-gutter-xs">
                        <q-input outlined square v-model="form.name" label="Office Name" :error="errors.name.type" :error-message="errors.name.message" />
                        <q-input outlined square v-model="form.alias" label="Office Alias" :error="errors.alias.type" :error-message="errors.alias.message" />
                        <q-input outlined square v-model="form.email" label="Office Email" type="email" :error="errors.email.type" :error-message="errors.email.message" />
                    </div>
                </q-card-section>
                <q-separator />
                <q-card-actions align="center">
                    <q-btn square unelevated size="lg" color="primary" label="submit" @click="save()" class="full-width"/>
                </q-card-actions>
                <q-inner-loading :showing="PreferenceStore.isLoading" color="primary">
                    <div class="q-gutter-xs text-center">
                        <q-spinner-ios size="1.5em" />
                        <div class="text-caption text-uppercase">We're working on it</div>
                    </div>
                </q-inner-loading>
            </q-card>
        </q-dialog>
    </div>
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
    { name: 'name', label: 'Office Name', align: 'left', field: row => row.name, sortable: true },
    { name: 'email', label: 'Office Email', align: 'left', field: row => row.email, sortable: true },
    { name: 'created_at', label: 'Created At', align: 'left', field: row => moment(row.createdAt).format('MMM DD, YYYY hh:mm A') },
    { name: 'actions', label: '', align: 'right', field: 'actions', sortable: false, style: 'width: 150px;' }
]);

const id = ref(null);
const form = reactive({
    name: '',
    alias: '',
    email: '',
});

const errors = reactive({
    name: { type: false, message: '' },
    alias: { type: false, message: '' },
    email: { type: false, message: '' },
});

// Validate the form inputs
const validate = () => {
    errors.name.type = !form.name;
    errors.alias.type = !form.alias;
    errors.email.type = !form.email;
    errors.email.type = errors.email.type || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email);

    errors.name.message = errors.name.type ? 'Name is required.' : '';
    errors.alias.message = errors.alias.type ? 'Alias is required.' : '';
    errors.email.message = errors.email.type ? 'Email is required.' : '';
    errors.email.message = errors.email.type ? 'Email is invalid.' : '';

    return  !errors.name.type && 
            !errors.alias.type && 
            !errors.email.type;
};

// Fetch data when the component is mounted
const fetchData = async () => {
    PreferenceStore.isLoadingTable = true;
    try {
        const response = await api.get('/preference/office');
        rows.value = response.data;
        PreferenceStore.isLoadingTable = false;
    } catch (error) {
        console.error('Error fetching data:', error);
        PreferenceStore.isLoadingTable = false;
        Toast.fire({
            icon: "error",
            html: `
                <div class="text-h6 text-bold text-uppercase">error!</div>
                <div class="text-caption;">${error.response.data.message || 'An error occurred while fetching office preferences.'}<div>
            `
        });
    }
};

// Fetch data when the component is mounted
onMounted(() => {
    fetchData();
});

// Open the dialog for creating or editing an office preference
const openDialog = (office) => {

    if (PreferenceStore.isEdit && office) {
        id.value = office.id;
        form.name = office.name || '';
        form.alias = office.alias || '';
        form.email = office.email || '';
    } else {
        id.value = null;
        form.name = '';
        form.alias = '';
        form.email = '';
    }
    errors.name.type = false;
    errors.alias.type = false;
    errors.email.type = false;
};

// Save the form data
const save = async () => {
    if (!validate()) return;
    PreferenceStore.isLoading = true;
    try {
        const response = id.value
            ? await api.post(`/preference/office/${id.value}/update`, form)
            : await api.post('/preference/office', form);
        
        PreferenceStore.dialog = false;
        PreferenceStore.isEdit = false;
        PreferenceStore.isLoading = false;
        if (id.value) {
            updateRows(id.value, response.data.office);
        } else {
            rows.value.push(response.data.office);
        }
        Toast.fire({
            icon: "success",
            html: `
                <div class="text-h6 text-bold text-uppercase">granted!</div>
                <div class="text-caption;">${response.data.message}<div>
            `
        });
    } catch (error) {
        console.error('Error saving data:', error);
        PreferenceStore.isLoading = false;
        Toast.fire({
            icon: "error",
            html: `
                <div class="text-h6 text-bold text-uppercase">error!</div>
                <div class="text-caption;">${error.response.data.message || 'An error occurred while saving the office.'}<div>
            `
        });
    }
};

// Disable an office preference
const disableOffice = async (office) => {
    PreferenceStore.isLoading = true;
    try {
        const response = await api.post(`/preference/office/${office.id}/disable`);
        updateRows(office.id, response.data.office);
        PreferenceStore.isLoading = false;
        Toast.fire({
            icon: "success",
            html: `
                <div class="text-h6 text-bold text-uppercase">granted!</div>
                <div class="text-caption;">${response.data.message}<div>
            `
        });
    } catch (error) {
        console.error('Error disabling office:', error);
        PreferenceStore.isLoading = false;
        Toast.fire({
            icon: "error",
            html: `
                <div class="text-h6 text-bold text-uppercase">error!</div>
                <div class="text-caption;">${error.response.data.message || 'An error occurred while disabling the office.'}<div>
            `
        });
    }
};

// Enable an office preference
const enableOffice = async (office) => {
    PreferenceStore.isLoading = true;
    try {
        const response = await api.post(`/preference/office/${office.id}/enable`);
        updateRows(office.id, response.data.office);
        PreferenceStore.isLoading = false;
        Toast.fire({
            icon: "success",
            html: `
                <div class="text-h6 text-bold text-uppercase">granted!</div>
                <div class="text-caption;">${response.data.message}<div>
            `
        });
    } catch (error) {
        console.error('Error enabling office:', error);
        PreferenceStore.isLoading = false;
        Toast.fire({
            icon: "error",
            html: `
                <div class="text-h6 text-bold text-uppercase">error!</div>
                <div class="text-caption;">${error.response.data.message || 'An error occurred while enabling the office.'}<div>
            `
        });
    }
};

// Update rows when save or delete actions are performed
const updateRows = (id, data) => {
    const index = rows.value.findIndex(office => office.id === id);
    if (index !== -1) {
        Object.assign(rows.value[index], data)
    }
};
</script>