import React, { useState, useEffect, useRef, } from 'react';
import _ from 'lodash';
import './App.css';

const HOST = 'http://localhost:8000';
const CATEGORIES = ['Luxury', 'Standard', 'Twin', 'King', 'Single', 'Double'];

function App() {
	const [prices, setPrices] = useState([]);
	const [message, setMessage] = useState('');
	const [dates, setDates] = useState(['2020-04-24', '2020-04-25', '2020-04-26']);
	const startDateInput = useRef();
	const endDateInput = useRef();

	// Handle change dates
	const handleDateChange = function () {
		// Get array of dates (as string) between 2 dates
		const getDatesBetween = function (startDate, endDate) {
			let dates = [];
			let current = startDate;
			while (current <= endDate) {
				dates.push(current.toISOString().substr(0, 10));
				current.setDate(current.getDate() + 1);
			}

			return dates;
		};

		let startDate = new Date(startDateInput.current.value);
		let endDate = new Date(endDateInput.current.value);
		let newDates = getDatesBetween(startDate, endDate);

		if (newDates.length) {
			console.log(newDates);
			setDates(newDates);
		}
	};

	// Handle checkbox click: update prices.checked
	const handleCheck = function (event) {
		let newPrices = _.cloneDeep(prices);
		let categoryindex = +event.target.dataset.categoryindex;
		let dateindex = +event.target.dataset.dateindex;
		newPrices[categoryindex][dateindex].checked = event.target.checked;
		setPrices(newPrices);
	};

	// Handle change recommended price: update prices.price.recommend
	const handleChangePrice = function (event) {
		let newPrices = _.cloneDeep(prices);
		let categoryindex = +event.target.dataset.categoryindex;
		let dateindex = +event.target.dataset.dateindex;
		let newValue = +event.target.value;
		newPrices[categoryindex][dateindex].price.recommend = newValue;
		setPrices(newPrices);
	};

	// Handle form submission: log information of selected cells
	const handleSubmit = function (event) {
		event.preventDefault();
		let pricesClone = _.cloneDeep(prices);
		let checked = pricesClone
			.reduce((acc, cur) => acc.concat(cur)) // to 1D array
			.filter(price => price.checked) // get selected only
			.map(price => {
				delete price.checked;
				return price;
			}); // delete checked key

		if (checked.length) {
			setMessage('Applying...');

			// POST request
			let url=`${HOST}/rooms`;
			fetch(url, {
				method: 'POST',

				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ rooms: checked, }),
			})
				.then(res => {
					if (res.ok) {
						// Log selected cells
						console.log(checked);

						// Update submited
						setMessage('Applied! Sent Data is logged on Console!');
					} else {
						setMessage('Something went wrong.');
					}
				});
		} else {
			setMessage('Please choose your room!');
		}
	};

	// Update prices when dates change
	useEffect(() => {
		// Get Data by making GET requests to server
		const updatePrices = async function () {
			// Get price of category on date
			const getPrice = async function (category, date) {
				let url = `${HOST}/rooms?cat=${category}&date=${date}`;
				let response = await fetch(url);
				let data = await response.json();

				// Add checked value
				data.checked = false;
				return data;
			};

			// Get prices of category on dates
			const getCategoryPrices = async function (category, dates) {
				let categoryPrices = await Promise.all(
					dates.map(
						async (date) => await getPrice(category, date)
					)
				);
				return categoryPrices;
			};

			// Get prices of all categories on dates
			let newPrices = await Promise.all(
				CATEGORIES.map(async (category) =>await getCategoryPrices(category, dates))
			);

			// Update prices state
			setPrices(newPrices);
		};

		updatePrices();
	}, [dates]);

	return (
		<>
		<h1>VTF FrontEnd Test Task</h1>
		<form>
		<label>From: 
		<input onChange={handleDateChange} ref={startDateInput} type="date" value={dates[0]}/>
		</label>
		<label>To: 
		<input onChange={handleDateChange} ref={endDateInput} type="date" value={dates[dates.length - 1]}/>
		</label>
		</form>
		{ !dates ||
			<form onSubmit={handleSubmit}>
			<div className="overflow">
			<table>

			<thead>
			<tr>
			<th>Category</th>
			{ dates.map(date => <th key={date}>{date}</th>) }
			</tr>
			</thead>

			<tbody>
			{ prices.map((categoryPrices, categoryIndex) =>
				<tr key={categoryIndex}>
				<th>{CATEGORIES[categoryIndex]}</th>
				{
					categoryPrices.map((price, dateIndex) =>
						<td key={`${categoryIndex}-${dateIndex}`}>

						<label className="container">
						<input type="checkbox" data-dateindex={dateIndex} data-categoryindex={categoryIndex} onClick={handleCheck}/>
						<span className="checkmark"></span>
						</label>

						<ul>
						<li>{price.price.current}</li>
						<li><input type="number" min="0" value={price.price.recommend} data-dateindex={dateIndex} data-categoryindex={categoryIndex} onChange={handleChangePrice}/></li>
						</ul>

						{ price.price.current === price.price.recommend &&
							<img src="/check.svg" alt="Check" />
						}
						{ price.price.current < price.price.recommend &&
								<img src="/down.svg" alt="Down" />
						}
						{ price.price.current > price.price.recommend &&
								<img src="/up.svg" alt="Up" />
						}

						</td>
					)
				}
				</tr>
			)
			}
			</tbody>
			</table>
			</div>
			<button>Apply</button>
			</form>
		}

		{ message && <p>{message}</p>}
		</>
	);
}

export default App;
