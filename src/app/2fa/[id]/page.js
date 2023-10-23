'use client'

import { useState, } from 'react'

export default function TwoFA({ params }) {
	const [code, setCode] = useState('');
	
	const handleCodeChange = (event) => {
		event.preventDefault();
		setCode(event.target.value);
	}

	const handleSubmit = (event) => {
		event.preventDefault();
		fetch('http://localhost:3000/auth/validate-otp', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				userId: params.id,
				otp: code
			})
		})
		.then(res => res.json())
		.then(data => console.log(data))
		.catch(error => console.error(error))
	}

	return (
		<div>
			<h1>2FA</h1>
			<h1>userId: { params.id }</h1>
			<form onSubmit={handleSubmit}>
				<input type="text" value={code} onChange={handleCodeChange} />
				<button type="submit">Submit</button>
			</form>
		</div>
	)
}