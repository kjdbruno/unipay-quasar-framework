<template>
    <div>
        <q-card square class="no-shadow card-radius q-mb-md">
            <q-card-section>
                <div class="row items-center no-wrap">
                    <div class="col">
                        <div class="text-h6 text-uppercase">
                            <q-btn round flat size="sm" icon="arrow_back" @click="FeedbackStore.component = 'FeedbackComponent'"  class="q-mr-sm" />
                            {{ FeedbackStore.details.name }}
                        </div>
                    </div>
                    <div class="col-auto q-gutter-xs">
                        <q-select outlined dense square v-model="FeedbackStore.year" emit-value map-options :options="options" label="Year" @update:model-value="getAllRatings">
                            <template v-slot:before>
                                <div class="text-uppercase text-caption">filter:</div>
                            </template>
                            <template v-slot:after>
                                <q-btn unelevated square color="primary" label="new feedback" @click="newFeedback"/>
                            </template>
                        </q-select>
                    </div>
                </div>
            </q-card-section>
        </q-card>
        <div class="row q-col-gutter-md">
            <div class="col-3">
                <q-card square class="no-shadow card-radius q-mb-md">
                    <q-card-section class="q-pa-xl text-center">
                        <div class="text-h2">{{ formatNumber(totalFeedback) }}</div>
                        <div class="text-grey text-uppercase">total feedback</div>
                    </q-card-section>
                </q-card>
                <q-card square class="no-shadow card-radius q-mb-md">
                    <q-card-section class="q-pa-xl text-center">
                        <div class="text-h2">{{ formatPercentage(totalRating) }}</div>
                        <div class="text-grey text-uppercase">satisfactory rating</div>
                    </q-card-section>
                </q-card>
            </div>
            <div class="col">
                <q-card square class="no-shadow card-radius q-mb-md">
                    <q-card-section>
                        <div class="text-h6 text-capitalize">feedback frequency</div>
                    </q-card-section>
                    <q-card-section>
                        <apexchart type="line" height="250" :options="chartOptions1" :series="series1"></apexchart>
                    </q-card-section>
                </q-card>
            </div>
        </div>
        <div class="row q-col-gutter-md">
            <div class="col-3">
                <q-card square class="no-shadow card-radius q-mb-md">
                    <q-card-section>
                        <div class="text-h6 text-capitalize">by client type</div>
                    </q-card-section>
                    <q-card-section class="text-center">
                        <apexchart type="pie" width="100%" height="auto" :options="chartOptions2" :series="series2"></apexchart>
                    </q-card-section>
                </q-card>
            </div>
            <div class="col-3">
                <q-card square class="no-shadow card-radius q-mb-md">
                    <q-card-section>
                        <div class="text-h6 text-capitalize">by sex</div>
                    </q-card-section>
                    <q-card-section class="text-center">
                        <apexchart type="pie" width="100%" height="auto" :options="chartOptions3" :series="series3"></apexchart>
                    </q-card-section>
                </q-card>
            </div>
            <div class="col-3">
                <q-card square class="no-shadow card-radius q-mb-md">
                    <q-card-section>
                        <div class="text-h6 text-capitalize">by age</div>
                    </q-card-section>
                    <q-card-section class="text-center">
                        <apexchart type="pie" width="100%" height="auto" :options="chartOptions4" :series="series4"></apexchart>
                    </q-card-section>
                </q-card>
            </div>
            <div class="col-3">
                <q-card square class="no-shadow card-radius q-mb-md">
                    <q-card-section>
                        <div class="text-h6 text-capitalize">by entry</div>
                    </q-card-section>
                    <q-card-section class="text-center">
                        <apexchart type="pie" width="100%" height="auto" :options="chartOptions5" :series="series5"></apexchart>
                    </q-card-section>
                </q-card>
            </div>
        </div>
        <div class="row q-col-gutter-md">
            <div class="col-4">
                <q-card square class="no-shadow card-radius q-mb-md">
                    <q-card-section>
                        <div class="text-h6 text-capitalize">CC1</div>
                    </q-card-section>
                    <q-card-section class="text-center">
                        <apexchart type="donut" width="100%" height="auto" :options="chartOptions6" :series="series6"></apexchart>
                    </q-card-section>
                </q-card>
            </div>
            <div class="col-4">
                <q-card square class="no-shadow card-radius q-mb-md">
                    <q-card-section>
                        <div class="text-h6 text-capitalize">CC2</div>
                    </q-card-section>
                    <q-card-section class="text-center">
                        <apexchart type="donut" width="100%" height="auto" :options="chartOptions7" :series="series7"></apexchart>
                    </q-card-section>
                </q-card>
            </div>
            <div class="col-4">
                <q-card square class="no-shadow card-radius q-mb-md">
                    <q-card-section>
                        <div class="text-h6 text-capitalize">CC3</div>
                    </q-card-section>
                    <q-card-section class="text-center">
                        <apexchart type="donut" width="100%" height="auto" :options="chartOptions8" :series="series8"></apexchart>
                    </q-card-section>
                </q-card>
            </div>
        </div>
        <div class="row q-col-gutter-md">
            <div class="col-4">
                <q-card square class="no-shadow card-radius q-mb-md">
                    <q-card-section>
                        <div class="text-h6 text-capitalize">service quality dimension</div>
                    </q-card-section>
                    <q-card-section class="q-pa-none">
                        <q-list padding separator>
                            <q-item>
                                <q-item-section>
                                    <div class="text-bold text-uppercase">sqd0</div>
                                    <div class="text-caption">I am satisfied with the service that I availed</div>
                                </q-item-section>
                                <q-item-section avatar>
                                    <q-icon v-if="sqd0 !== 0" :name="sqd0 === 1 ? 'sentiment_very_dissatisfied' : (sqd0 === 2 ? 'sentiment_dissatisfied' : (sqd0 === 3 ? 'sentiment_neutral' : (sqd0 === 4 ? 'sentiment_satisfied' : (sqd0 === 5 ? 'sentiment_very_satisfied' : null))))" :color="sqd0 === 1 ? 'red' : (sqd0 === 2 ? 'amber' : (sqd0 === 3 ? 'yellow' : (sqd0 === 4 ? 'light-green' : (sqd0 === 5 ? 'green' : null))))" size="xl"/>
                                    <span v-else class="text-uppercase text-h6">N/A</span>
                                </q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section>
                                    <div class="text-bold text-uppercase">sqd1</div>
                                    <div class="text-caption">I spent a reasonable amount of time for my transaction</div>
                                </q-item-section>
                                <q-item-section avatar>
                                    <q-icon v-if="sqd1 !== 0" :name="sqd1 === 1 ? 'sentiment_very_dissatisfied' : (sqd1 === 2 ? 'sentiment_dissatisfied' : (sqd1 === 3 ? 'sentiment_neutral' : (sqd1 === 4 ? 'sentiment_satisfied' : (sqd1 === 5 ? 'sentiment_very_satisfied' : null))))" :color="sqd1 === 1 ? 'red' : (sqd1 === 2 ? 'amber' : (sqd1 === 3 ? 'yellow' : (sqd1 === 4 ? 'light-green' : (sqd1 === 5 ? 'green' : null))))" size="xl"/>
                                    <span v-else class="text-uppercase text-h6">N/A</span>
                                </q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section>
                                    <div class="text-bold text-uppercase">sqd2</div>
                                    <div class="text-caption">The office followed the transaction's requirements and steps based on the information provided</div>
                                </q-item-section>
                                <q-item-section avatar>
                                    <q-icon v-if="sqd2 !== 0" :name="sqd2 === 1 ? 'sentiment_very_dissatisfied' : (sqd2 === 2 ? 'sentiment_dissatisfied' : (sqd2 === 3 ? 'sentiment_neutral' : (sqd2 === 4 ? 'sentiment_satisfied' : (sqd2 === 5 ? 'sentiment_very_satisfied' : null))))" :color="sqd2 === 1 ? 'red' : (sqd2 === 2 ? 'amber' : (sqd2 === 3 ? 'yellow' : (sqd2 === 4 ? 'light-green' : (sqd2 === 5 ? 'green' : null))))" size="xl"/>
                                    <span v-else class="text-uppercase text-h6">N/A</span>
                                </q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section>
                                    <div class="text-bold text-uppercase">sqd3</div>
                                    <div class="text-caption">The steps (including payment) I needed to do for my transaction were easy and simple</div>
                                </q-item-section>
                                <q-item-section avatar>
                                    <q-icon v-if="sqd3 !== 0" :name="sqd3 === 1 ? 'sentiment_very_dissatisfied' : (sqd3 === 2 ? 'sentiment_dissatisfied' : (sqd3 === 3 ? 'sentiment_neutral' : (sqd3 === 4 ? 'sentiment_satisfied' : (sqd3 === 5 ? 'sentiment_very_satisfied' : null))))" :color="sqd3 === 1 ? 'red' : (sqd3 === 2 ? 'amber' : (sqd3 === 3 ? 'yellow' : (sqd3 === 4 ? 'light-green' : (sqd3 === 5 ? 'green' : null))))" size="xl"/>
                                    <span v-else class="text-uppercase text-h6">N/A</span>
                                </q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section>
                                    <div class="text-bold text-uppercase">sqd4</div>
                                    <div class="text-caption">I easily found information about my transaction from the office or its website</div>
                                </q-item-section>
                                <q-item-section avatar>
                                    <q-icon v-if="sqd4 !== 0" :name="sqd4 === 1 ? 'sentiment_very_dissatisfied' : (sqd4 === 2 ? 'sentiment_dissatisfied' : (sqd4 === 3 ? 'sentiment_neutral' : (sqd4 === 4 ? 'sentiment_satisfied' : (sqd4 === 5 ? 'sentiment_very_satisfied' : null))))" :color="sqd4 === 1 ? 'red' : (sqd4 === 2 ? 'amber' : (sqd4 === 3 ? 'yellow' : (sqd4 === 4 ? 'light-green' : (sqd4 === 5 ? 'green' : null))))" size="xl"/>
                                    <span v-else class="text-uppercase text-h6">N/A</span>
                                </q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section>
                                    <div class="text-bold text-uppercase">sqd5</div>
                                    <div class="text-caption">I paid a reasonable amount of fees fro my transaction</div>
                                </q-item-section>
                                <q-item-section avatar>
                                    <q-icon v-if="sqd5 !== 0" :name="sqd5 === 1 ? 'sentiment_very_dissatisfied' : (sqd5 === 2 ? 'sentiment_dissatisfied' : (sqd5 === 3 ? 'sentiment_neutral' : (sqd5 === 4 ? 'sentiment_satisfied' : (sqd5 === 5 ? 'sentiment_very_satisfied' : null))))" :color="sqd5 === 1 ? 'red' : (sqd5 === 2 ? 'amber' : (sqd5 === 3 ? 'yellow' : (sqd5 === 4 ? 'light-green' : (sqd5 === 5 ? 'green' : null))))" size="xl"/>
                                    <span v-else class="text-uppercase text-h6">N/A</span>
                                </q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section>
                                    <div class="text-bold text-uppercase">sqd6</div>
                                    <div class="text-caption">I feel the office was fair to everyone, or "walang palakasan" during my transaction</div>
                                </q-item-section>
                                <q-item-section avatar>
                                    <q-icon v-if="sqd6 !== 0" :name="sqd6 === 1 ? 'sentiment_very_dissatisfied' : (sqd6 === 2 ? 'sentiment_dissatisfied' : (sqd6 === 3 ? 'sentiment_neutral' : (sqd6 === 4 ? 'sentiment_satisfied' : (sqd6 === 5 ? 'sentiment_very_satisfied' : null))))" :color="sqd6 === 1 ? 'red' : (sqd6 === 2 ? 'amber' : (sqd6 === 3 ? 'yellow' : (sqd6 === 4 ? 'light-green' : (sqd6 === 5 ? 'green' : null))))" size="xl"/>
                                    <span v-else class="text-uppercase text-h6">N/A</span>
                                </q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section>
                                    <div class="text-bold text-uppercase">sqd7</div>
                                    <div class="text-caption">I was treated courteously by the staff, and (if ask for help) the staff was helpful</div>
                                </q-item-section>
                                <q-item-section avatar>
                                    <q-icon v-if="sqd7 !== 0" :name="sqd7 === 1 ? 'sentiment_very_dissatisfied' : (sqd7 === 2 ? 'sentiment_dissatisfied' : (sqd7 === 3 ? 'sentiment_neutral' : (sqd7 === 4 ? 'sentiment_satisfied' : (sqd7 === 5 ? 'sentiment_very_satisfied' : null))))" :color="sqd7 === 1 ? 'red' : (sqd7 === 2 ? 'amber' : (sqd7 === 3 ? 'yellow' : (sqd7 === 4 ? 'light-green' : (sqd7 === 5 ? 'green' : null))))" size="xl"/>
                                    <span v-else class="text-uppercase text-h6">N/A</span>
                                </q-item-section>
                            </q-item>
                            <q-item>
                                <q-item-section>
                                    <div class="text-bold text-uppercase">sqd8</div>
                                    <div class="text-caption">I got what I needed from the government office, or (if denied) denial of request was sufficiently explained</div>
                                </q-item-section>
                                <q-item-section avatar>
                                    <q-icon v-if="sqd8 !== 0" :name="sqd8 === 1 ? 'sentiment_very_dissatisfied' : (sqd8 === 2 ? 'sentiment_dissatisfied' : (sqd8 === 3 ? 'sentiment_neutral' : (sqd8 === 4 ? 'sentiment_satisfied' : (sqd8 === 5 ? 'sentiment_very_satisfied' : null))))" :color="sqd8 === 1 ? 'red' : (sqd8 === 2 ? 'amber' : (sqd8 === 3 ? 'yellow' : (sqd8 === 4 ? 'light-green' : (sqd8 === 5 ? 'green' : null))))" size="xl"/>
                                    <span v-else class="text-uppercase text-h6">N/A</span>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-card-section>
                </q-card>
            </div>
            <div class="col-8">
                <q-card square class="no-shadow card-radius q-mb-md">
                    <q-card-section>
                        <div class="text-h6 text-capitalize">list of Feedbacks</div>
                    </q-card-section>
                </q-card>
                <div class="q-gutter-md row q-col-gutter-md scroll" style="height: 750px;">
                    <q-card v-for="(dt, index) in ratings" :key="index" @click="generatePDF(dt.id)" class="card-rating bg-white col-xs-12 col-sm-4 col-md-3 col-lg-3 flex flex-center q-pa-md no-shadow cursor-pointer" square>
                        <q-icon
                            :name="dt.entryFrom === 'manual' ? 'description' : 'desktop_windows'"
                            class="absolute-top-right q-ma-sm"
                            :color="dt.entryFrom === 'manual' ? 'primary' : 'positive'"
                            size="sm"
                        />
                        <q-card-section>
                            <div>
                                <div class="text-h6">{{ formatPercentage(dt.averageSqdPercentage) }}</div>
                                <div class="text-caption text-uppercase text-grey">rating</div>
                            </div>
                        </q-card-section>
                        <q-card-actions>
                            <div>
                                <div class="text-caption text-uppercase">{{ formatDate(dt.date) }}</div>
                                <div class="text-caption text-uppercase">{{ dt.entryFrom === 'manual' ? 'N/A' : formatTime(dt.date) }}</div>
                            </div>
                        </q-card-actions>
                        <q-inner-loading :showing="dt.id == id ? rateLoading : null">
                            <q-spinner-ios />
                        </q-inner-loading>
                    </q-card>
                </div>
            </div>
        </div>
        <q-dialog v-model="ratingDialog" full-height full-width>
            <q-card>
                <q-btn icon="close" class="fixed bg-white" round dense v-close-popup style="top: 25px; right: 10px; transform: translateY(-50%); z-index: 999;" />
                <q-card-section class="q-pa-none">
                    <div v-if="file" class="myIframe">
                        <iframe :src="file" height="100%" width="100%"></iframe>
                    </div>
                </q-card-section>
            </q-card>
        </q-dialog>
        <q-dialog v-model="feedbackDialog" full-height persistent position="right" class="dialog-feedback" @before-show="resetFeedbackForm">
            <q-card class="card-dialog column full-height">
                <q-card-section class="row items-center">
                    <div class="text-h5 text-capitalize">create feedback</div>
                    <q-space />
                    <q-btn icon="close" flat round dense v-close-popup />
                </q-card-section>
                <q-separator />
                <q-card-section class="scroll" style="flex: 1">
                    <transition name="fade-slide" mode="out-in">
                        <div :key="step">
                            <div v-if="step === 0">
                                <q-card-section>
                                    <div class="text-h6 text-uppercase">office to rate:</div>
                                    <div class="text-body1 text-uppercase">{{ FeedbackStore.details.name }}</div>
                                </q-card-section>
                                <q-card-section>
                                    <q-date v-model="date" square/>
                                    <div class="q-mt-sm text-caption text-negative">{{ errors.date.message }}</div>
                                </q-card-section>
                            </div>
                            <div v-else-if="step === 1">
                                <q-card-section>
                                    <div class="text-h6 text-uppercase">client information</div>
                                </q-card-section>
                                <q-card-section>
                                    <q-radio v-model="type" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="citizen" label="Citizen" />
                                    <q-radio v-model="type" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="business" label="Business" />
                                    <q-radio v-model="type" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="government" label="Government (Employee or another agency)" />
                                    <div class="q-ml-md text-caption text-negative">{{ errors.type.message }}</div>
                                </q-card-section>
                                <q-card-section>
                                    <q-input square outlined v-model="email" label="Email" :error="errors.email.type" :error-message="errors.email.message"/>
                                </q-card-section>
                                <q-card-section>
                                    <div class="row q-col-gutter-sm">
                                        <div class="col">
                                            <q-input square outlined v-model="age" label="Age" :error="errors.age.type" :error-message="errors.age.message"/>
                                        </div>
                                        <div class="col">
                                            <q-radio v-model="sexId" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" :val="1" label="Male" />
                                            <q-radio v-model="sexId" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" :val="2" label="Female" />
                                            <div class="q-ml-md text-caption text-negative">{{ errors.sexId.message }}</div>
                                        </div>
                                    </div>
                                </q-card-section>
                                <q-card-section>
                                    <div class="row q-col-gutter-sm">
                                        <div class="col">
                                            <q-input square outlined v-model="residence" label="Residence" autogrow :error="errors.residence.type" :error-message="errors.residence.message"/>
                                        </div>
                                        <div class="col">
                                            <q-input square outlined v-model="serviceAvailed" label="Service Availed" autogrow :error="errors.serviceAvailed.type" :error-message="errors.serviceAvailed.message" />
                                        </div>
                                    </div>
                                </q-card-section>
                            </div>
                            <div v-else-if="step === 2">
                                <q-card-section>
                                    <div class="text-h6 text-uppercase">citizen's charter</div>
                                </q-card-section>
                                <q-card-section>
                                    <div class="text-body1">Which of the following best describes your awareness of the Citizen's Charter?</div>
                                    <div>
                                        <div>
                                            <q-radio v-model="cc1" size="xl" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="1" label="I know what a Citizen's Charter is and I saw this office's Citizen's Charter." />
                                        </div>
                                        <div>
                                            <q-radio v-model="cc1" size="xl" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="2" label="I know what a Citizen's Charter is but I did NOT see this office's Citizen's Charter." />
                                        </div>
                                        <div>
                                            <q-radio v-model="cc1" size="xl" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="3" label="I learned og the Citizen's Charter only when I saw this office's Citizen's Charter." />
                                        </div>
                                        <div>
                                            <q-radio v-model="cc1" size="xl" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="4" label="I do not know what Citizen's Charter is and I did not see in this office." />
                                        </div>
                                    </div>
                                    <div class="q-ml-md text-caption text-negative">{{ errors.cc1.message }}</div>
                                </q-card-section>
                            </div>
                            <div v-else-if="step === 3">
                                <q-card-section>
                                    <div class="text-h6 text-uppercase">citizen's charter</div>
                                </q-card-section>
                                <q-card-section>
                                    <div class="text-body1">If aware of the Citizen's Charter, would you say that the Citizen's Charter of this office was?</div>
                                    <div>
                                        <div>
                                        <q-radio v-model="cc2" size="xl" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="1" label="Easy to see" :disable="cc1 === '4'"/>
                                        <q-radio v-model="cc2" size="xl" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="2" label="Somewhat easy to see" :disable="cc1 === '4'"/>
                                        <q-radio v-model="cc2" size="xl" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="3" label="Difficult to see" :disable="cc1 === '4'"/>
                                        <q-radio v-model="cc2" size="xl" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="4" label="Not visible at all" :disable="cc1 === '4'"/>
                                        <q-radio v-model="cc2" size="xl" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="5" label="Not applicable" :disable="cc1 !== '4'"/>
                                        </div>
                                        <div class="q-ml-md text-caption text-negative">{{ errors.cc2.message }}</div>
                                    </div>
                                </q-card-section>
                            </div>
                            <div v-else-if="step === 4">
                                <q-card-section>
                                    <div class="text-h6 text-uppercase">citizen's charter</div>
                                </q-card-section>
                                <q-card-section>
                                    <div class="text-body1">If aware of the Citizen's Charter, how much did the Citizen's Charter help you in your transaction?</div>
                                    <div>
                                        <div>
                                        <q-radio v-model="cc3" size="xl" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="1" label="Helped very much" :disable="cc1 === '4'"/>
                                        <q-radio v-model="cc3" size="xl" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="2" label="Somewhat helped" :disable="cc1 === '4'"/>
                                        <q-radio v-model="cc3" size="xl" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="3" label="Did not help" :disable="cc1 === '4'"/>
                                        <q-radio v-model="cc3" size="xl" checked-icon="task_alt" unchecked-icon="panorama_fish_eye" val="4" label="Not applicable" :disable="cc1 !== '4'"/>
                                        </div>
                                        <div class="q-ml-md text-caption text-negative">{{ errors.cc3.message }}</div>
                                    </div>
                                </q-card-section>
                            </div>
                            <div v-else-if="step === 5">
                                <q-card-section>
                                    <div class="text-h6 text-uppercase">sqd0</div>
                                    <div class="text-body1">I am satisfied with the service that I availed</div>
                                </q-card-section>
                                <q-card-section>
                                    <q-rating v-model="qsqd0":max="5" size="5em" :color="colors" :icon="icons" />
                                </q-card-section>
                            </div>
                            <div v-else-if="step === 6">
                                <q-card-section>
                                    <div class="text-h6 text-uppercase">sqd1</div>
                                    <div class="text-body1">I spent a reasonable amount of time for my transaction</div>
                                </q-card-section>
                                <q-card-section>
                                    <q-rating v-model="qsqd1":max="5" size="5em" :color="colors" :icon="icons" />
                                </q-card-section>
                            </div>
                            <div v-else-if="step === 7">
                                <q-card-section>
                                    <div class="text-h6 text-uppercase">sqd2</div>
                                    <div class="text-body1">The office followed the transaction's requirements and steps based on the information provided</div>
                                </q-card-section>
                                <q-card-section>
                                    <q-rating v-model="qsqd2":max="5" size="5em" :color="colors" :icon="icons" />
                                </q-card-section>
                            </div>
                            <div v-else-if="step === 8">
                                <q-card-section>
                                    <div class="text-h6 text-uppercase">sqd3</div>
                                    <div class="text-body1">The steps (including payment) I needed to do for my transaction were easy and simple</div>
                                </q-card-section>
                                <q-card-section>
                                    <q-rating v-model="qsqd3":max="5" size="5em" :color="colors" :icon="icons" />
                                </q-card-section>
                            </div>
                            <div v-else-if="step === 9">
                                <q-card-section>
                                    <div class="text-h6 text-uppercase">sqd4</div>
                                    <div class="text-body1">I easily found information about my transaction from the office or its website</div>
                                </q-card-section>
                                <q-card-section>
                                    <q-rating v-model="qsqd4":max="5" size="5em" :color="colors" :icon="icons" />
                                </q-card-section>
                            </div>
                            <div v-else-if="step === 10">
                                <q-card-section>
                                    <div class="text-h6 text-uppercase">sqd5</div>
                                    <div class="text-body1">I paid a reasonable amount of fees for my transaction</div>
                                </q-card-section>
                                <q-card-section>
                                    <q-rating v-model="qsqd5":max="5" size="5em" :color="colors" :icon="icons" />
                                </q-card-section>
                            </div>
                            <div v-else-if="step === 11">
                                <q-card-section>
                                    <div class="text-h6 text-uppercase">sqd6</div>
                                    <div class="text-body1">I feel the office was fair to everyone, or "walang palakasan", during my transaction</div>
                                </q-card-section>
                                <q-card-section>
                                    <q-rating v-model="qsqd6":max="5" size="5em" :color="colors" :icon="icons" />
                                </q-card-section>
                            </div>
                            <div v-else-if="step === 12">
                                <q-card-section>
                                    <div class="text-h6 text-uppercase">sqd7</div>
                                    <div class="text-body1">I was treated courteously by the staff, and (if asked for help) the staff was helpful</div>
                                </q-card-section>
                                <q-card-section>
                                    <q-rating v-model="qsqd7":max="5" size="5em" :color="colors" :icon="icons" />
                                </q-card-section>
                            </div>
                            <div v-else-if="step === 13">
                                <q-card-section>
                                    <div class="text-h6 text-uppercase">sqd8</div>
                                    <div class="text-body1">I got what I needed from the government office, or (if denied) denial of request was sufficiently explained to me</div>
                                </q-card-section>
                                <q-card-section>
                                    <q-rating v-model="qsqd8":max="5" size="5em" :color="colors" :icon="icons" />
                                </q-card-section>
                            </div>
                            <div v-else-if="step === 14">
                                <q-card-section>
                                    <div class="text-h6 text-uppercase">suggestions</div>
                                    <div class="text-body1">Suggestions on how we can further improve our service</div>
                                </q-card-section>
                                <q-card-section>
                                    <q-input square outlined v-model="suggestion" label="Suggestions/Comments/Recommendations" autogrow />
                                </q-card-section>
                            </div>
                        </div>
                    </transition>
                </q-card-section>
                <q-separator />
                <q-card-actions align="center">
                    <q-btn-group unelevated spread class="full-width" size="xl" square>
                        <q-btn size="xl" color="primary" label="previous" :disable="step === 0" @click="step--"/>
                        <q-btn size="xl" color="primary" :label="step === totalSteps - 1 ? 'submit' : 'next'" @click="step === totalSteps - 1 ? createKioskRating() : nextStep()" />
                    </q-btn-group>
                </q-card-actions>
                <q-inner-loading :showing="feedbackLoading">
                    <q-spinner-ios />
                </q-inner-loading>
            </q-card>
        </q-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive, watch } from 'vue';
import { api } from 'src/boot/axios';
import moment from 'moment';
import Apexchart from "vue3-apexcharts";
import Swal from 'sweetalert2/dist/sweetalert2.js';
import 'sweetalert2/src/sweetalert2.scss';

import { useFeedbackStore } from '../stores/feedback-store';

const FeedbackStore = useFeedbackStore();

const Toast = Swal.mixin({
    toast: true,
    position: "bottom-start",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
    }
});

const options = ref([]);

const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];

    // Add years from 5 years in the future down to the current year
    for (let year = currentYear + 2; year >= currentYear; year--) {
        years.push({ value: String(year), label: String(year) });
    }

    // Add years from current year minus 1 down to 5 years before
    for (let year = currentYear - 1; year >= currentYear - 2; year--) {
        years.push({ value: String(year), label: String(year) });
    }
    
    options.value = years;
};

//
const totalFeedback = ref(0);

//
const totalRating = ref(0);

// frequency
const series1 = ref([]);
const chartOptions1 = ref({
    chart: {
        type: 'area',
        stacked: false,
        zoom: {
            type: 'x',
            enabled: true,
            autoScaleYaxis: true
        },
        toolbar: {
            autoSelected: 'zoom'
        },
    },
    stroke: {
        curve: 'stepline',
    },
    dataLabels: {
        enabled: false
    },
    markers: {
        size: 0,
    },
    xaxis: {
        categories: [] // This will be populated with month names
    },
    theme: {
        palette: 'palette1' // upto palette10
    },
    yaxis: {
        labels: {
            show: false // Hide values on the left side
        }
    }
});

// client type
const series2 = ref([]);
const chartOptions2 = ref({
    chart: {
        type: 'pie',
    },
    theme: {
        palette: 'palette1' // upto palette10
    },
    labels: [],
    legend: {
        show: false,
    },
});

// sex
const series3 = ref([]);
const chartOptions3 = ref({
    chart: {
        type: 'pie',
    },
    theme: {
        palette: 'palette1' // upto palette10
    },
    labels: [],
    legend: {
        show: false,
    },
});

// age
const series4 = ref([]);
const chartOptions4 = ref({
    chart: {
        type: 'pie',
    },
    theme: {
        palette: 'palette1' // upto palette10
    },
    labels: [],
    legend: {
        show: false,
    },
});

// entry
const series5 = ref([]);
const chartOptions5 = ref({
    chart: {
        type: 'pie',
    },
    theme: {
        palette: 'palette1' // upto palette10
    },
    labels: [],
    legend: {
        show: false,
    },
});

// cc1
const series6 = ref([]);
const chartOptions6 = ref({
    chart: {
        type: 'donut',
    },
    theme: {
        palette: 'palette1' // upto palette10
    },
    labels: [],
    legend: {
        show: false,
    },
});


// cc2
const series7 = ref([]);
const chartOptions7 = ref({
    chart: {
        type: 'donut',
    },
    theme: {
        palette: 'palette1' // upto palette10
    },
    labels: [],
    legend: {
        show: false,
    },
});

// cc3
const series8 = ref([]);
const chartOptions8 = ref({
    chart: {
        type: 'donut',
    },
    theme: {
        palette: 'palette1' // upto palette10
    },
    labels: [],
    legend: {
        show: false,
    },
});

const ratings = ref([]);
const ratingDialog = ref(false);
const file = ref(null);
const id = ref(null);
const rateLoading = ref(false);

const sqd0 = ref(0);
const sqd1 = ref(0);
const sqd2 = ref(0);
const sqd3 = ref(0);
const sqd4 = ref(0);
const sqd5 = ref(0);
const sqd6 = ref(0);
const sqd7 = ref(0);
const sqd8 = ref(0);

const getAllRatings = async () => {
    try {
        // --- 1. Reset to Default Values BEFORE fetching/processing ---
        // series1.value = []; // Clear the series data
        // chartOptions1.value = {
        //     ...chartOptions1.value, // Keep existing chart options
        //     xaxis: {
        //         ...chartOptions1.value.xaxis, // Keep existing xaxis options
        //         categories: [] // Clear the categories
        //     }
        // };

        const response = await api.get(`/feedback/${FeedbackStore.details.id}/${FeedbackStore.year}`);
        const data = response.data;

        totalFeedback.value = data.ratings.length;
        totalRating.value = data.averagePercentage;

        ratings.value = data.ratings;

        /**
         * 
         * FREQUENCY DATA
         * 
         */
        const frequenciesData = Array.isArray(data.frequencies) ? data.frequencies : [];

        const FrequencyCounts = frequenciesData.map(item => item.count);
        const FrequencyCategories = frequenciesData.map(item => item.label);

        series1.value = [{
            name: 'Feedback Frequency',
            data: FrequencyCounts
        }];

        chartOptions1.value = {
            ...chartOptions1.value,
            xaxis: {
                ...chartOptions1.value.xaxis,
                categories: FrequencyCategories
            }
        };

        /**
         * 
         * 
         * CLIENT TYPE DATA
         * 
         */
        const TypeCounts = [];
        const TypeCLabels = [];

        Object.values(data.types).forEach(item => {
            TypeCLabels.push(item.label);
            TypeCounts.push(item.count);
        });

        series2.value = TypeCounts;

        chartOptions2.value = {
            ...chartOptions2.value,
            labels: TypeCLabels,
        };

        /**
         * 
         * 
         * SEX
         * 
         */
        const SexCounts = [];
        const SexLabels = [];

        Object.values(data.sexes).forEach(item => {
            SexLabels.push(item.label);
            SexCounts.push(item.count);
        });

        series3.value = SexCounts;

        chartOptions3.value = {
            ...chartOptions3.value,
            labels: SexLabels,
        };

        /**
         * 
         * 
         * AGE BRACKET
         * 
         */
        const AgeCounts = [];
        const AgeLabels = [];

        Object.values(data.ages).forEach(item => {
            AgeLabels.push(item.label);
            AgeCounts.push(item.count);
        });

        series4.value = AgeCounts;

        chartOptions4.value = {
            ...chartOptions4.value,
            labels: AgeLabels,
        };

        /**
         * 
         * ENTRY FROM
         * 
         */
        const EntryCounts = [];
        const EntryLabels = [];

        Object.values(data.entry).forEach(item => {
            EntryLabels.push(item.label);
            EntryCounts.push(item.count);
        });

        series5.value = EntryCounts;

        chartOptions5.value = {
            ...chartOptions5.value,
            labels: EntryLabels,
        };

        /**
         * 
         * CC1
         * 
         */
        const CC1Counts = [];
        const CC1Labels = [];

        Object.values(data.cc1).forEach(item => {
            CC1Labels.push(item.label);
            CC1Counts.push(item.count);
        });

        series6.value = CC1Counts;

        chartOptions6.value = {
            ...chartOptions6.value,
            labels: CC1Labels,
        };

        /**
         * 
         * CC2
         * 
         */
        const CC2Counts = [];
        const CC2Labels = [];

        Object.values(data.cc2).forEach(item => {
            CC2Labels.push(item.label);
            CC2Counts.push(item.count);
        });

        series7.value = CC2Counts;

        chartOptions7.value = {
            ...chartOptions7.value,
            labels: CC2Labels,
        };

        /**
         * 
         * CC2
         * 
         */
        const CC3Counts = [];
        const CC3Labels = [];

        Object.values(data.cc3).forEach(item => {
            CC3Labels.push(item.label);
            CC3Counts.push(item.count);
        });

        series8.value = CC3Counts;

        chartOptions8.value = {
            ...chartOptions8.value,
            labels: CC3Labels,
        };

        /**
         * 
         * SQD
         * 
         */
        sqd0.value = data.sqd[0].avgSqd0;
        sqd1.value = data.sqd[0].avgSqd1;
        sqd2.value = data.sqd[0].avgSqd2;
        sqd3.value = data.sqd[0].avgSqd3;
        sqd4.value = data.sqd[0].avgSqd4;
        sqd5.value = data.sqd[0].avgSqd5;
        sqd6.value = data.sqd[0].avgSqd6;
        sqd7.value = data.sqd[0].avgSqd7;
        sqd8.value = data.sqd[0].avgSqd8;

    } catch (error) {
        console.error("Error fetching ratings or frequencies:", error);
        // You might want to display a user-friendly error message here
    }
}

const formatPercentage = (value) => {
    return (value == null ? `0%` : `${value.toFixed(2)}%`);
}

const formatDate = (timestamp) => {
    return moment(timestamp).format('MMMM DD, YYYY');
};

const formatTime = (timestamp) => {
    return moment(timestamp, 'HH:mm:ss').format('h:mm A');
};

const formatNumber = (value) => {
    return value.toLocaleString('en-US');
};

const generatePDF = async (rateId) => {
    id.value = rateId;
    rateLoading.value = true;
    try {
        const res = await api.get(`/feedback/pdf/rating/${rateId}`, {
            responseType: 'arraybuffer',
        })
        const blob = new Blob([res.data], { type: 'application/pdf' });
        const pdfurl = window.URL.createObjectURL(blob) + "#view=FitW";
        file.value = pdfurl
        ratingDialog.value = true;
        rateLoading.value = false;
    } catch (error) {
        rateLoading.value = false;
        console.error("Error generating PDF:", error);
    }
}

const feedbackDialog = ref(false);

const newFeedback = () => {
    feedbackDialog.value = true;
}

onMounted(() => {
    generateYearOptions();
    FeedbackStore.year = new Date().getFullYear();
    getAllRatings();
});

const step = ref(0)
const totalSteps = 15;
const feedbackLoading = ref(false);

const icons = ref([
    'sentiment_very_dissatisfied',
    'sentiment_dissatisfied',
    'sentiment_neutral',
    'sentiment_satisfied',
    'sentiment_very_satisfied'
]);
const colors = ref([
    'red',
    'amber',
    'yellow',
    'light-green',
    'green'
]);

const date = ref(null)
const type = ref('');
const email = ref('');
const sexId = ref('');
const age = ref('');
const residence = ref('');
const serviceAvailed = ref('');
const cc1 = ref('');
const cc2 = ref('');
const cc3 = ref('');
const qsqd0 = ref(0);
const qsqd1 = ref(0);
const qsqd2 = ref(0);
const qsqd3 = ref(0);
const qsqd4 = ref(0);
const qsqd5 = ref(0);
const qsqd6 = ref(0);
const qsqd7 = ref(0);
const qsqd8 = ref(0);
const suggestion = ref('');

const errors = reactive({
    date: { message: null, type: null },
    type: { message: null, type: null },
    email: { message: null, type: null },
    age: { message: null, type: null },
    sexId: { message: null, type: null },
    residence: { message: null, type: null },
    serviceAvailed: { message: null, type: null },
    cc1: { message: null, type: null },
    cc2: { message: null, type: null },
    cc3: { message: null, type: null }
});

const validateDate = () => {
    let isError = false;
    if (date.value == '' || date.value == null) {
        errors.date.message = 'Date is required';
        errors.date.type = true;
        isError = true;
    } else {
        errors.date.message = null;
        errors.date.type = null;
    }
    return isError;
}

const validateClient = () => {
    let isError = false;
    if (email.value == '' || email.value == null) {
        errors.email.message = 'Email is required';
        errors.email.type = true;
        isError = true;
    } else if (isEmail(email.value)) {
        errors.email.message = 'Invalid email';
        errors.email.type = true;
        isError = true;
    } else {
        errors.email.message = null;
        errors.email.type = null;
    }
    if (type.value == '' || type.value == null) {
        errors.type.message = 'Client type is required';
        errors.type.type = true;
        isError = true;
    } else {
        errors.type.message = null;
        errors.type.type = null;
    }
    if (age.value == '' || age.value == null) {
        errors.age.message = 'Age is required';
        errors.age.type = true;
        isError = true;
    } else if (isNumber(age.value)) {
        errors.age.message = 'Invalid age';
        errors.age.type = true;
        isError = true;
    } else {
        errors.age.message = null;
        errors.age.type = null;
    }
    if (sexId.value == '' || sexId.value == null) {
        errors.sexId.message = 'Sex is required';
        errors.sexId.type = true;
        isError = true;
    } else {
        errors.sexId.message = null;
        errors.sexId.type = null;
    }
    if (residence.value == '' || residence.value == null) {
        errors.residence.message = 'Residence is required';
        errors.residence.type = true;
        isError = true;
    } else {
        errors.residence.message = null;
        errors.residence.type = null;
    }
    if (serviceAvailed.value == '' || serviceAvailed.value == null) {
        errors.serviceAvailed.message = 'Service availed is required';
        errors.serviceAvailed.type = true;
        isError = true;
    } else {
        errors.serviceAvailed.message = null;
        errors.serviceAvailed.type = null;
    }
    return isError;
}

const validateCharterOne = () => {
    let isError = false;
    if (cc1.value == '' || cc1.value == null) {
        errors.cc1.message = 'Citizens Charter Question 1 is required';
        errors.cc1.type = true;
        isError = true;
    } else {
        errors.cc1.message = null;
        errors.cc1.type = null;
    }
    return isError;
}

const validateCharterTwo = () => {
    let isError = false;
    if (cc2.value == '' || cc2.value == null) {
        errors.cc2.message = 'Citizens Charter Question 2 is required';
        errors.cc2.type = true;
        isError = true;
    } else {
        errors.cc2.message = null;
        errors.cc2.type = null;
    }
    return isError;
}

const validateCharterThree = () => {
    let isError = false;
    if (cc3.value == '' || cc3.value == null) {
        errors.cc3.message = 'Citizens Charter Question 3 is required';
        errors.cc3.type = true;
        isError = true;
    } else {
        errors.cc3.message = null;
        errors.cc3.type = null;
    }
    return isError;
}

const isNumber = (val) => {
    const numberPattern = /^[0-9]+$/;
    return !numberPattern.test(val)
}

const isEmail = (val) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailPattern.test(val);
};

const nextStep = () => {
    if (step.value < totalSteps - 1) {
        if (step.value == 0) {
            const isError = validateDate();
            if (isError) return false;
        } else if (step.value == 1) {
            const isError = validateClient();
            if (isError) return false;
        } else if (step.value == 2) {
            const isError = validateCharterOne();
            if (isError) return false;
        } else if (step.value == 3) {
            const isError = validateCharterTwo();
            if (isError) return false;
        } else if (step.value == 4) {
            const isError = validateCharterThree();
            if (isError) return false;
        }
        step.value++
    } else {
        createKioskRating();
    }
}

const createKioskRating = async () => {
    feedbackLoading.value = true;
    try {
        const response = await api.post(`/feedback/kiosk`, {
            date: date.value,
            email: email.value,
            officeId: FeedbackStore.details.id,
            type: type.value,
            sexId: sexId.value,
            age: age.value,
            residence: residence.value,
            serviceAvailed: serviceAvailed.value,
            cc1: cc1.value,
            cc2: cc2.value,
            cc3: cc3.value,
            sqd0: qsqd0.value,
            sqd1: qsqd1.value,
            sqd2: qsqd2.value,
            sqd3: qsqd3.value,
            sqd4: qsqd4.value,
            sqd5: qsqd5.value,
            sqd6: qsqd6.value,
            sqd7: qsqd7.value,
            sqd8: qsqd8.value,
            suggestion: suggestion.value,
        })
        feedbackDialog.value = false;
        feedbackLoading.value = false;
        getAllRatings();
        Toast.fire({
            icon: "success",
            html: `<div class="text-h6 text-bold text-uppercase">granted!</div><div class="text-caption text-capitalize;">${response.data.message}<div>`
        });
    } catch (error) {
        feedbackLoading.value = false;
    }
}

watch(cc1, (val) => {
    if (val === '4') {
        cc2.value = '5';
        cc3.value = '4';
    } else {
        cc2.value = '';
        cc3.value = '';
    }
});

const resetFeedbackForm = () => {
    step.value = 0;
    date.value = null;
    email.value = '';
    type.value = '';
    sexId.value = '';
    age.value = '';
    residence.value = '';
    serviceAvailed.value = '';
    cc1.value = '';
    cc2.value = '';
    cc3.value = '';
    qsqd0.value = 0;
    qsqd1.value = 0;
    qsqd2.value = 0;
    qsqd3.value = 0;
    qsqd4.value = 0;
    qsqd5.value = 0;
    qsqd6.value = 0;
    qsqd7.value = 0;
    qsqd8.value = 0;
    suggestion.value = '';
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
}

.card-rating {
    height: 200px;
    width: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
}

.myIframe {
    position: relative;
    padding-bottom: 65.25%;
    padding-top: 30px;
    height: 0;
    overflow: auto;
    -webkit-overflow-scrolling: touch;
}

.myIframe iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
    transition: all 0.4s ease;
}
.fade-slide-enter-from {
    opacity: 0;
    transform: translateY(10px);
}
.fade-slide-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>