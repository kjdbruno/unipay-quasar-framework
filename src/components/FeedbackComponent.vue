<template>
    <div>
        <div class="q-gutter-md row q-col-gutter-md" v-if="!loading && feedbacks.length > 0">
            <q-card v-for="(dt, index) in feedbacks" :key="index" @click="viewOffice(dt)" class="card card-hover-animate col-xs-12 col-sm-4 col-md-3 col-lg-3 flex flex-center q-pa-md no-shadow cursor-pointer" square>
                <q-card-section class="text-center">
                    <div class="text-h5 text-uppercase">{{ dt.alias }}</div>
                    <div class="text-caption">{{ dt.name }}</div>
                </q-card-section>
                <q-card-actions>
                    <div>
                        <div class="text-h6">{{ formatPercentage(dt.averageSqdPercentage) }}</div>
                        <div class="text-caption text-uppercase text-grey">average rating</div>
                    </div>
                </q-card-actions>
            </q-card>
        </div>
        <div class="q-mt-md" v-if="loading">
            <q-card class="card col-xs-12 col-sm-4 col-md-3 col-lg-3 flex flex-center q-pa-md no-shadow cursor-pointer" square>
                <q-card-section class="text-center">
                    <q-spinner-ios size="1.5em" />
                    <div class="q-ml-sm text-uppercase text-caption">Loading feedbacks...</div>
                </q-card-section>
            </q-card>
        </div>
        <div class="q-mt-md" v-if="feedbacks.length === 0 && !loading">
            <q-card class="card col-xs-12 col-sm-4 col-md-3 col-lg-3 flex flex-center q-pa-md no-shadow cursor-pointer" square>
                <q-card-section class="text-center">
                    <div class="q-ml-sm text-uppercase text-caption">no feedback</div>
                </q-card-section>
            </q-card>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { api } from 'src/boot/axios';

import { useFeedbackStore } from '../stores/feedback-store';

const FeedbackStore = useFeedbackStore();

const feedbacks = ref([]);

const loading = ref(false);

const getAllFeedbacks = async () => {
    loading.value = true;
    try {
        const response = await api.get(`/feedback`);
        feedbacks.value = response.data;
        loading.value = false;
    } catch (error) {
        console.error("Error fetching all feedbacks:", error);
        loading.value = false;
    }
}

const formatPercentage = (value) => {
    return (value == null ? `0%` : `${value.toFixed(2)}%`);
}

const viewOffice = (dt) => {
    //
    FeedbackStore.details = dt;
    FeedbackStore.component = 'FeedbackOfficeComponent';
}

onMounted(() => {
    getAllFeedbacks()
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
}
.card-hover-animate {
    transition: border-color 0.3s ease, transform 0.2s ease;
}

.card-hover-animate:hover {
  transform: scale(1.02); /* optional zoom effect */
}

</style>