<template>
	<div class="left" v-if="!showListView">
		<div class="line_chart">
			<div id="calorie_chart" style="height: 370px"></div>
		</div>
	</div>

	<div v-else class="left">
		<el-table
			stripe
			row-key="dataid"
			ref="filterTable"
			:data="calorieData"
			class="folder-list"
		>
			<!-- Document title -->
			<el-table-column
				sortable=""
				width="300"
				prop="calorie"
				align="center"
				label="Calorie"
				column-key="calorie"
			>
			</el-table-column>

			<el-table-column
				sortable=""
				width="200"
				prop="date"
				align="center"
				label="Date"
				column-key="date"
			>
			</el-table-column>

			<!-- Operations -->
			<el-table-column label="Operations" align="center">
				<template #default="scope">
					<el-button
						size="small"
						@click="handleDelete(scope.$index, scope.row)"
						style="background: #f1eeec"
						>Delete</el-button
					>
				</template>
			</el-table-column>
		</el-table>
	</div>

	<div class="right">
		<div class="filter_add">
			<div class="filtertime">
				<el-radio-group v-model="radio" @change="applyFilter">
					<el-radio :label="1">All Data</el-radio>
					<el-radio :label="2">This Week </el-radio>
					<el-radio :label="3">Last Month</el-radio>
					<el-radio :label="4">Last 6 Months</el-radio>
					<el-radio :label="5">Last Year</el-radio>
				</el-radio-group>
			</div>

			<el-button
				v-if="!showListView"
				class="rihgt_buttons"
				style="margin-top: 1vw"
				type="primary"
				plain
				@click="showListView = true"
				>Show All Data</el-button
			>
			<el-button
				v-else
				class="rihgt_buttons"
				style="margin-top: 1vw"
				type="primary"
				plain
				@click="(showListView = False), applyFilter()"
				>Show Chart</el-button
			>
			<el-button
				class="rihgt_buttons"
				type="primary"
				plain
				style="margin-top: 1vw"
				@click="alertdialogFormVisible = true"
			>
				Alert Settings</el-button
			>
			<!-- add new document pop up window -->
			<el-button
				class="rihgt_buttons"
				label="Add"
				type="primary"
				plain
				style="margin-top: 1vw"
				@click="AdddialogFormVisible = true"
				><el-icon><Plus /></el-icon> Add Data</el-button
			>
		</div>
	</div>
	<!-- add dialog -->
	<el-dialog width="350px" title="Add Data" v-model="AdddialogFormVisible">
		<el-form :model="documentForm">
			<el-form-item label="Calorie" class="add_window">
				<el-input
					v-model="documentForm.calorie"
					placeholder="In Kcal"
					autocomplete="off"
				></el-input>
			</el-form-item>

			<el-form-item label="Date" class="add_window">
				<el-date-picker
					type="date"
					placeholder="Select a Date"
					v-model="documentForm.date"
					format="YYYY-MM-DD"
					value-format="YYYY-MM-DD"
				>
				</el-date-picker>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button
					@click="AdddialogFormVisible = false"
					type="primary"
					plain
					>Cancel</el-button
				>
				<el-button @click="adddocument" type="primary" plain
					>Create</el-button
				>
			</span>
		</template>
	</el-dialog>

	<!-- delete dialog -->
	<el-dialog
		v-model="deletedialogVisible"
		title=""
		width="30%"
		:before-close="handleClose"
	>
		<span>Are you sure to delete this record?</span>
		<template #footer>
			<span class="dialog-footer">
				<el-button @click="deletedialogVisible = false"
					>Cancel</el-button
				>
				<el-button type="primary" @click="documentDelete()"
					>Delete</el-button
				>
			</span>
		</template>
	</el-dialog>

	<!-- alert dialog -->
	<el-dialog
		width="450px"
		title="Alert Settings"
		v-model="alertdialogFormVisible"
	>
		<el-form :model="documentForm">
			<el-form-item
				label="Minimum Calorie Threshold"
				class="alert_window"
			>
				<el-input
					v-model="documentForm.weight"
					placeholder="In Kcal"
					autocomplete="off"
				></el-input>
			</el-form-item>

			<el-form-item
				label="Maximum Calorie Threshold"
				class="alert_window"
			>
				<el-input placeholder="In Kcal" autocomplete="off"></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<span class="dialog-footer">
				<el-button
					@click="alertdialogFormVisible = false"
					type="primary"
					plain
					>Cancel</el-button
				>
				<el-button type="primary" plain>Save</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup>
import { onMounted } from 'vue';
import * as echarts from 'echarts';
import httpServices from '@services';
</script>

<script>
export default {
	data() {
		return {
			petId: this.$route.query.id,
			calorieData: []
		};
	},
	mounted() {
		this.getdata(this.$data.petId, 'All');
	},
	created() {
		this.$data.radio = 1;
		this.$data.showListView = false;
		this.$data.alertdialogFormVisible = false;

		this.$data.AdddialogFormVisible = false;
		this.$data.documentForm = {
			pet_id: this.$data.petId,
			date: '',
			calorie: ''
		};

		//delete dialog related
		this.$data.deletedialogVisible = false;
		this.$data.delete_data_id = '';
	},
	methods: {
		applyFilter() {
			var dict = {
				1: 'All',
				2: 'Week',
				3: 'Month',
				4: '6Month',
				5: 'Year'
			};
			this.getdata(this.$data.petId, dict[this.$data.radio]);
		},
		getdata(petid, range) {
			//get calorie data
			httpServices.healthTracking
				.getcalorie({ pet_id: petid, range: range })
				.then(response => {
					this.$data.calorieData = response.data.data;
					console.log(this.$data.calorieData, 'hehe');
					let temp_dates = [];
					let temp_calorie = [];
					for (const record of this.$data.calorieData) {
						temp_calorie.push(record.calorie);
						temp_dates.push(record.date);
						console.log();
					}
					this.renderChart(temp_dates, temp_calorie);
				})
				.catch(error => {
					console.log(error.message);
				});
		},
		renderChart(date, calorie) {
			if (document.getElementById('calorie_chart') == null) {
				return;
			}
			echarts.dispose(document.getElementById('calorie_chart'));
			let calorieChart = echarts.init(
				document.getElementById('calorie_chart')
			);
			calorieChart.setOption({
				title: {
					text: 'Calorie'
				},
				tooltip: {},
				xAxis: {
					data: date,
					name: 'Date'
				},
				yAxis: {
					name: 'Kcal'
				},
				series: [
					{
						name: 'Calorie',
						type: 'line',
						data: calorie
					}
				]
			});
			window.onresize = function () {
				calorieChart.resize();
			};
		},

		adddocument() {
			this.$data.AdddialogFormVisible = false;
			console.log(this.$data.documentForm);

			// add new calorie data
			httpServices.healthTracking
				.addcalorie(this.$data.documentForm)
				.then(response => {
					console.log(response);
					location.reload();
				})
				.catch(error => {
					console.log(error);
				});
		},

		//delete document related
		handleDelete(index, row) {
			this.$data.deletedialogVisible = true;
			this.$data.delete_data_id = row.data_id;
			console.log(this.$data.delete_data_id);
		},
		documentDelete() {
			this.$data.deletedialogVisible = false;
			//delete record list
			httpServices.healthTracking
				.deletedata({ data_id: this.$data.delete_data_id })
				.then(response => {
					console.log(response);
					location.reload();
				})
				.catch(error => {
					console.log(error);
				});
		}
	}
};
</script>

<style lang="scss" scoped>
.left {
	float: left;
	width: 80%;
}
.right {
	float: right;
	width: 20%;
}

.filter_add {
	margin-top: 2vh;
	display: flex;
	justify-content: space-evenly;
	flex-direction: column;
	align-items: center;

	.rihgt_buttons {
		margin-left: 0;
		margin-right: 0;
		width: 100px;
		height: 40px;
	}

	.filtertime {
		display: flex;
		justify-content: space-evenly;
		flex-direction: column;
		align-items: center;
		margin-left: 50px;
	}

	:deep(.el-radio-group) {
		display: inline-flex;
		align-items: flex-start;
		flex-direction: column;
	}
}

.line_chart {
	margin-top: 2%;
	margin-left: 2%;
}

.alert_window :deep(.el-form-item__label) {
	width: 200px;
}
.add_window :deep(.el-input__inner) {
	width: 200px;
}

.add_window :deep(.el-form-item__label) {
	width: 80px;
}
</style>
